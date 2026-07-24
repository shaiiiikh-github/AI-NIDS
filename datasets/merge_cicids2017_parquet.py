"""
Merge the CICIDS2017 daily Parquet files into a single Parquet dataset.

v2: fixes a crash from the previous version. That version picked each
column's downcast dtype (e.g. int32 vs int64) based only on the *first*
file's values, then a later file's value fell outside that range and the
schema cast failed. This version first scans Parquet row-group metadata
(min/max stats -- cheap, no data read) across ALL files to pick one safe
dtype per column, then streams and writes using that fixed schema.

USAGE:
    1. Edit INPUT_DIR / OUTPUT_PARQUET below if needed.
    2. pip install pandas numpy pyarrow
    3. python merge_cicids2017_parquet.py
"""

import os
import gc
import glob
import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# ---------------------------------------------------------------------------
# CONFIG - edit these
# ---------------------------------------------------------------------------
INPUT_DIR = r"D:/AI-NIDS/dataset"
OUTPUT_PARQUET = "D:/AI-NIDS/merged_dataset/cicids2017_merged.parquet"
BATCH_SIZE = 200_000          # rows per batch read at a time (safe for 16GB RAM)
DROP_ROWS_WITH_NAN_OR_INF = True   # CICIDS2017 has some inf/NaN in Flow Bytes/s, Flow Packets/s
LABEL_COL = "Label"

INT32_MIN, INT32_MAX = -2_147_483_648, 2_147_483_647


def clean_columns(cols):
    """CICIDS2017 files have inconsistent leading/trailing spaces in headers."""
    return [c.strip() for c in cols]


def get_common_columns(parquet_files):
    """Read just the schema (cheap, no data) of each file and take the
    intersection of columns, preserving the first file's column order."""
    common = None
    first_order = None
    for f in parquet_files:
        schema = pq.read_schema(f)
        cols = clean_columns(schema.names)
        if first_order is None:
            first_order = cols
        cols_set = set(cols)
        common = cols_set if common is None else (common & cols_set)
    return [c for c in first_order if c in common]


def plan_dtypes(parquet_files, columns):
    """Decide one safe dtype per column, using Parquet row-group statistics
    (no full data read) so the plan reflects the ENTIRE merged dataset,
    not just the first file. float columns -> float32 (always safe).
    int columns -> int32 if the global min/max fits, else int64.
    Non-numeric (e.g. Label) -> left alone (handled as category later)."""
    first_file_schema = pq.read_schema(parquet_files[0])
    name_map_first = dict(zip(clean_columns(first_file_schema.names),
                               first_file_schema.types))

    is_float = {}
    is_int = {}
    for c in columns:
        t = name_map_first.get(c)
        is_float[c] = pa.types.is_floating(t) if t is not None else False
        is_int[c] = (pa.types.is_integer(t) and not is_float[c]) if t is not None else False

    global_min = {c: None for c in columns if is_int[c]}
    global_max = {c: None for c in columns if is_int[c]}

    for f in parquet_files:
        pf = pq.ParquetFile(f)
        raw_names = pf.schema_arrow.names
        name_map = dict(zip(raw_names, clean_columns(raw_names)))
        for rg_idx in range(pf.num_row_groups):
            rg_meta = pf.metadata.row_group(rg_idx)
            for col_idx in range(rg_meta.num_columns):
                col_meta = rg_meta.column(col_idx)
                clean_name = name_map.get(col_meta.path_in_schema,
                                           col_meta.path_in_schema.strip())
                if clean_name not in global_min:
                    continue
                stats = col_meta.statistics
                if global_min[clean_name] == "unknown":
                    continue
                if stats is None or not stats.has_min_max:
                    global_min[clean_name] = "unknown"
                    continue
                mn, mx = stats.min, stats.max
                if not isinstance(mn, (int, float)) or not isinstance(mx, (int, float)):
                    # Stats came back as bytes/str for this column in this
                    # file (inconsistent typing across the 8 source files).
                    # Play it safe: fall back to int64 for this column.
                    global_min[clean_name] = "unknown"
                    continue
                if global_min[clean_name] is None or mn < global_min[clean_name]:
                    global_min[clean_name] = mn
                if global_max[clean_name] is None or mx > global_max[clean_name]:
                    global_max[clean_name] = mx

    target_dtype = {}
    for c in columns:
        if is_float[c]:
            target_dtype[c] = "float32"
        elif is_int[c]:
            mn, mx = global_min[c], global_max[c]
            if mn == "unknown" or mn is None or mx is None:
                target_dtype[c] = "int64"   # stats missing -> play it safe
            elif mn >= INT32_MIN and mx <= INT32_MAX:
                target_dtype[c] = "int32"
            else:
                target_dtype[c] = "int64"
        else:
            target_dtype[c] = None  # leave as-is (e.g. Label -> category)

    return target_dtype


_DEBUG_DTYPE_PRINTED = False


def apply_dtypes(df, target_dtype, debug=False):
    global _DEBUG_DTYPE_PRINTED
    numeric_target_cols = [c for c, dt in target_dtype.items()
                            if dt in ("float32", "int32", "int64")]

    for c in numeric_target_cols:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    int_cols = [c for c in numeric_target_cols if target_dtype[c] in ("int32", "int64")]

    if debug and not _DEBUG_DTYPE_PRINTED and int_cols:
        n = len(df)
        nan_counts = df[int_cols].isna().sum()
        fully_nan = nan_counts[nan_counts == n].index.tolist()
        partially_nan = nan_counts[(nan_counts > 0) & (nan_counts < n)].index.tolist()
        print(f"    [DEBUG] rows={n}")
        print(f"    [DEBUG] int columns 100% NaN after coercion: {fully_nan}")
        print(f"    [DEBUG] int columns partially NaN: {partially_nan}")
        _DEBUG_DTYPE_PRINTED = True

    if int_cols:
        df.dropna(subset=int_cols, inplace=True)

    for c in numeric_target_cols:
        df[c] = df[c].astype(target_dtype[c])

    if LABEL_COL in df.columns:
        df[LABEL_COL] = df[LABEL_COL].astype("category")
    return df


def process_file(path, columns, target_dtype, writer_holder, output_schema):
    print(f"Processing {os.path.basename(path)} ...")
    pf = pq.ParquetFile(path)
    print(f"    [DEBUG] file reports {pf.metadata.num_rows:,} rows, "
          f"{pf.num_row_groups} row groups")
    total_rows = 0

    for batch in pf.iter_batches(batch_size=BATCH_SIZE):
        df = batch.to_pandas()
        df.columns = clean_columns(df.columns)
        n_read = len(df)
        df = df[columns]

        if DROP_ROWS_WITH_NAN_OR_INF:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            df[numeric_cols] = df[numeric_cols].replace([np.inf, -np.inf], np.nan)
            df[numeric_cols] = df[numeric_cols].fillna(0)
            n_after_fill = len(df)
            if LABEL_COL in df.columns:
                df.dropna(subset=[LABEL_COL], inplace=True)
            n_after_label_drop = len(df)
        else:
            n_after_fill = n_after_label_drop = n_read

        df = apply_dtypes(df, target_dtype, debug=True)
        n_after_dtypes = len(df)

        if n_read > 0 and n_after_dtypes == 0:
            print(f"    [DEBUG] read={n_read} after_fill={n_after_fill} "
                  f"after_label_drop={n_after_label_drop} after_dtypes={n_after_dtypes}")

        table = pa.Table.from_pandas(df, preserve_index=False, schema=output_schema)

        if writer_holder[0] is None:
            writer_holder[0] = pq.ParquetWriter(OUTPUT_PARQUET, output_schema)

        writer_holder[0].write_table(table)
        total_rows += len(df)

        del df, table, batch
        gc.collect()

    print(f"  -> {total_rows:,} rows written")
    return total_rows


def build_output_schema(columns, target_dtype):
    fields = []
    for c in columns:
        dt = target_dtype[c]
        if dt == "float32":
            fields.append(pa.field(c, pa.float32()))
        elif dt == "int32":
            fields.append(pa.field(c, pa.int32()))
        elif dt == "int64":
            fields.append(pa.field(c, pa.int64()))
        elif c == LABEL_COL:
            fields.append(pa.field(c, pa.dictionary(pa.int32(), pa.string())))
        else:
            fields.append(pa.field(c, pa.string()))
    return pa.schema(fields)


def main():
    os.makedirs(os.path.dirname(OUTPUT_PARQUET), exist_ok=True)

    parquet_files = sorted(glob.glob(os.path.join(INPUT_DIR, "*.parquet")))
    if not parquet_files:
        raise SystemExit(f"No .parquet files found in: {INPUT_DIR}")

    print(f"Found {len(parquet_files)} Parquet files:")
    for f in parquet_files:
        print("  -", os.path.basename(f))

    columns = get_common_columns(parquet_files)
    print(f"\nUsing {len(columns)} common columns across all files.")

    print("Scanning row-group stats to plan safe dtypes (no full data read)...")
    target_dtype = plan_dtypes(parquet_files, columns)
    output_schema = build_output_schema(columns, target_dtype)
    print("Dtype plan ready.\n")

    writer_holder = [None]
    grand_total = 0
    for f in parquet_files:
        grand_total += process_file(f, columns, target_dtype, writer_holder, output_schema)

    if writer_holder[0] is not None:
        writer_holder[0].close()

    size_mb = os.path.getsize(OUTPUT_PARQUET) / (1024 ** 2)
    print(f"\nDone. {grand_total:,} total rows merged -> {OUTPUT_PARQUET} "
          f"({size_mb:.1f} MB on disk)")


if __name__ == "__main__":
    main()