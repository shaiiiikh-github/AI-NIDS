"""
Real-time intrusion detection: watches the folder where CICFlowMeter's live
capture mode writes flow-feature CSVs, runs each new flow through your
trained main model (and the Web Attack submodel when relevant), and logs
alerts for anything that isn't Benign.

SETUP
    1. tshark should already be capturing rotating .pcap files (capture_rotate.py).
    2. Install the cicflowmeter Python package: pip install cicflowmeter
    3. Run cicflowmeter against the pcap folder to produce flow CSVs
       (see the companion convert_pcaps.py script), writing into
       CICFLOWMETER_OUTPUT_DIR below.
    4. Edit CICFLOWMETER_OUTPUT_DIR below to match that CSV output folder.
    5. pip install lightgbm pandas numpy joblib
    6. python live_ids_monitor.py

HOW IT HANDLES COLUMN NAMES
This uses the Python `cicflowmeter` package (pip-installed), which computes
the same flow statistics as the original Java CICFlowMeter but names its
output columns differently (snake_case, e.g. "flow_byts_s" instead of
"Flow_Bytes/s"). CICFLOWMETER_COLUMN_MAP below translates its columns to
exactly what the trained model expects -- verified directly against both
the model's own model.feature_name() output and the cicflowmeter package's
source code, not guessed. Its identifier columns (src_ip, dst_ip, etc.)
are kept for alert context and excluded from what's fed to the model.

It supports either a single continuously-growing CSV or CICFlowMeter
periodically starting new CSV files in the folder -- it tracks a
per-file read position so nothing is double-processed or missed.
"""

import os
import csv
import io
import json
import time
import numpy as np
import pandas as pd
import lightgbm as lgb
from datetime import datetime

# ---------------------------------------------------------------------------
# CONFIG - edit these
# ---------------------------------------------------------------------------
CICFLOWMETER_OUTPUT_DIR = r"D:/AI-NIDS/live_capture"   # <-- EDIT: CICFlowMeter's live output folder

MAIN_MODEL_PATH = "D:/AI-NIDS/models/cicids2017_lightgbm.txt"
MAIN_LABEL_MAP_PATH = "D:/AI-NIDS/models/label_mapping.json"
SUB_MODEL_PATH = "D:/AI-NIDS/models/webattack_submodel.txt"
SUB_LABEL_MAP_PATH = "D:/AI-NIDS/models/webattack_label_mapping.json"

ALERT_LOG_PATH = "D:/AI-NIDS/logs/alerts.log"
POLL_INTERVAL_SECONDS = 2
UNCERTAINTY_MARGIN = 0.15
BENIGN_LABEL = "Benign"

WEB_ATTACK_CLASSES = [
    "Web Attack - Brute Force",
    "Web Attack - XSS",
    "Web Attack - Sql Injection",
]

# Maps this model's trained feature names -> the Python `cicflowmeter`
# package's snake_case output column names. Verified directly against
# cicflowmeter 0.5.0's flow.py source (not guessed).
#
# One known gap: cicflowmeter's "cwr_flag_count" field is actually a bug
# in that package -- internally it's aliased to the URG flag count, not a
# real CWE flag count. Rather than feed the model wrong data, CWE_Flag_Count
# is fixed at 0 below (CWE is a rarely-set TCP flag in normal traffic, so
# this has minimal impact on detection quality).
CICFLOWMETER_COLUMN_MAP = {
    "Protocol": "protocol",
    "Flow_Duration": "flow_duration",
    "Total_Fwd_Packets": "tot_fwd_pkts",
    "Total_Backward_Packets": "tot_bwd_pkts",
    "Fwd_Packets_Length_Total": "totlen_fwd_pkts",
    "Bwd_Packets_Length_Total": "totlen_bwd_pkts",
    "Fwd_Packet_Length_Max": "fwd_pkt_len_max",
    "Fwd_Packet_Length_Min": "fwd_pkt_len_min",
    "Fwd_Packet_Length_Mean": "fwd_pkt_len_mean",
    "Fwd_Packet_Length_Std": "fwd_pkt_len_std",
    "Bwd_Packet_Length_Max": "bwd_pkt_len_max",
    "Bwd_Packet_Length_Min": "bwd_pkt_len_min",
    "Bwd_Packet_Length_Mean": "bwd_pkt_len_mean",
    "Bwd_Packet_Length_Std": "bwd_pkt_len_std",
    "Flow_Bytes/s": "flow_byts_s",
    "Flow_Packets/s": "flow_pkts_s",
    "Flow_IAT_Mean": "flow_iat_mean",
    "Flow_IAT_Std": "flow_iat_std",
    "Flow_IAT_Max": "flow_iat_max",
    "Flow_IAT_Min": "flow_iat_min",
    "Fwd_IAT_Total": "fwd_iat_tot",
    "Fwd_IAT_Mean": "fwd_iat_mean",
    "Fwd_IAT_Std": "fwd_iat_std",
    "Fwd_IAT_Max": "fwd_iat_max",
    "Fwd_IAT_Min": "fwd_iat_min",
    "Bwd_IAT_Total": "bwd_iat_tot",
    "Bwd_IAT_Mean": "bwd_iat_mean",
    "Bwd_IAT_Std": "bwd_iat_std",
    "Bwd_IAT_Max": "bwd_iat_max",
    "Bwd_IAT_Min": "bwd_iat_min",
    "Fwd_PSH_Flags": "fwd_psh_flags",
    "Bwd_PSH_Flags": "bwd_psh_flags",
    "Fwd_URG_Flags": "fwd_urg_flags",
    "Bwd_URG_Flags": "bwd_urg_flags",
    "Fwd_Header_Length": "fwd_header_len",
    "Bwd_Header_Length": "bwd_header_len",
    "Fwd_Packets/s": "fwd_pkts_s",
    "Bwd_Packets/s": "bwd_pkts_s",
    "Packet_Length_Min": "pkt_len_min",
    "Packet_Length_Max": "pkt_len_max",
    "Packet_Length_Mean": "pkt_len_mean",
    "Packet_Length_Std": "pkt_len_std",
    "Packet_Length_Variance": "pkt_len_var",
    "FIN_Flag_Count": "fin_flag_cnt",
    "SYN_Flag_Count": "syn_flag_cnt",
    "RST_Flag_Count": "rst_flag_cnt",
    "PSH_Flag_Count": "psh_flag_cnt",
    "ACK_Flag_Count": "ack_flag_cnt",
    "URG_Flag_Count": "urg_flag_cnt",
    # "CWE_Flag_Count" intentionally omitted -- no faithful source field,
    # handled as a fixed 0 in _prep_features_from_cicflowmeter().
    "ECE_Flag_Count": "ece_flag_cnt",
    "Down/Up_Ratio": "down_up_ratio",
    "Avg_Packet_Size": "pkt_size_avg",
    "Avg_Fwd_Segment_Size": "fwd_seg_size_avg",
    "Avg_Bwd_Segment_Size": "bwd_seg_size_avg",
    "Fwd_Avg_Bytes/Bulk": "fwd_byts_b_avg",
    "Fwd_Avg_Packets/Bulk": "fwd_pkts_b_avg",
    "Fwd_Avg_Bulk_Rate": "fwd_blk_rate_avg",
    "Bwd_Avg_Bytes/Bulk": "bwd_byts_b_avg",
    "Bwd_Avg_Packets/Bulk": "bwd_pkts_b_avg",
    "Bwd_Avg_Bulk_Rate": "bwd_blk_rate_avg",
    "Subflow_Fwd_Packets": "subflow_fwd_pkts",
    "Subflow_Fwd_Bytes": "subflow_fwd_byts",
    "Subflow_Bwd_Packets": "subflow_bwd_pkts",
    "Subflow_Bwd_Bytes": "subflow_bwd_byts",
    "Init_Fwd_Win_Bytes": "init_fwd_win_byts",
    "Init_Bwd_Win_Bytes": "init_bwd_win_byts",
    "Fwd_Act_Data_Packets": "fwd_act_data_pkts",
    "Fwd_Seg_Size_Min": "fwd_seg_size_min",
    "Active_Mean": "active_mean",
    "Active_Std": "active_std",
    "Active_Max": "active_max",
    "Active_Min": "active_min",
    "Idle_Mean": "idle_mean",
    "Idle_Std": "idle_std",
    "Idle_Max": "idle_max",
    "Idle_Min": "idle_min",
}

# cicflowmeter's own metadata columns (kept for alert context, not fed to the model)
METADATA_COLS = ["src_ip", "dst_ip", "src_port", "dst_port", "protocol", "timestamp"]


def clean_columns(cols):
    return [c.strip() for c in cols]


def load_json(path):
    with open(path) as f:
        return json.load(f)


class FolderTail:
    """Tracks per-file read position across polls so newly appended or
    newly created CSV files in the folder are picked up exactly once."""

    def __init__(self, folder):
        self.folder = folder
        self.state = {}   # path -> {"pos": int, "header": list, "buffer": str}

    def poll(self):
        """Returns a dict {path: DataFrame} of newly available rows."""
        results = {}
        if not os.path.isdir(self.folder):
            return results

        for fname in sorted(os.listdir(self.folder)):
            if not fname.lower().endswith(".csv"):
                continue
            path = os.path.join(self.folder, fname)
            try:
                size = os.path.getsize(path)
            except OSError:
                continue

            st = self.state.setdefault(path, {"pos": 0, "header": None, "buffer": ""})
            if size <= st["pos"]:
                continue

            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                f.seek(st["pos"])
                chunk = f.read()
                st["pos"] = f.tell()

            data = st["buffer"] + chunk
            lines = data.split("\n")
            st["buffer"] = lines[-1]        # keep any incomplete trailing line
            complete_lines = [ln for ln in lines[:-1] if ln.strip()]
            if not complete_lines:
                continue

            if st["header"] is None:
                st["header"] = clean_columns(next(csv.reader([complete_lines[0]])))
                complete_lines = complete_lines[1:]
                if not complete_lines:
                    continue

            rows = list(csv.reader(complete_lines))
            rows = [r for r in rows if len(r) == len(st["header"])]
            if not rows:
                continue

            results[path] = pd.DataFrame(rows, columns=st["header"])

        return results


class HierarchicalIDS:
    def __init__(self):
        print("Loading models...")
        self.main_model = lgb.Booster(model_file=MAIN_MODEL_PATH)
        self.sub_model = lgb.Booster(model_file=SUB_MODEL_PATH)
        self.main_labels = load_json(MAIN_LABEL_MAP_PATH)
        self.sub_labels = load_json(SUB_LABEL_MAP_PATH)
        self.main_features = self.main_model.feature_name()
        self.sub_features = self.sub_model.feature_name()
        self._column_check_done = False
        print(f"Main model expects {len(self.main_features)} features")
        print(f"Submodel expects {len(self.sub_features)} features")

    def _lookup(self, mapping, idx):
        return mapping[str(idx)] if str(idx) in mapping else mapping[idx]

    def _prep_features(self, df, feature_list):
        """Align an incoming batch (cicflowmeter's snake_case columns) to
        the exact columns/order the model was trained on, translating
        names via CICFLOWMETER_COLUMN_MAP, coercing to numeric, and
        filling anything missing/bad with 0 (matches how training data
        was cleaned)."""
        if not self._column_check_done:
            matched = sum(1 for c in feature_list
                          if CICFLOWMETER_COLUMN_MAP.get(c) in df.columns)
            print(f"    [column check] {matched}/{len(feature_list)} model "
                  f"features matched to incoming CSV columns")
            if matched < len(feature_list) - 1:  # allow only CWE_Flag_Count to be unmapped
                print("    [WARNING] Most features did NOT match -- the model "
                      "is likely receiving mostly zeros. Check that the CSV's "
                      "column headers match cicflowmeter's expected snake_case "
                      "names (e.g. 'flow_duration', 'tot_fwd_pkts').")
            self._column_check_done = True

        aligned = pd.DataFrame(index=df.index)
        for col in feature_list:
            source_col = CICFLOWMETER_COLUMN_MAP.get(col)
            if source_col is not None and source_col in df.columns:
                aligned[col] = pd.to_numeric(df[source_col], errors="coerce")
            elif col == "CWE_Flag_Count":
                aligned[col] = 0.0   # see CICFLOWMETER_COLUMN_MAP comment
            else:
                aligned[col] = 0.0
        aligned.replace([np.inf, -np.inf], np.nan, inplace=True)
        aligned.fillna(0.0, inplace=True)
        return aligned

    def predict_batch(self, raw_df):
        """raw_df: DataFrame straight from CICFlowMeter's CSV (metadata +
        feature columns mixed together). Returns a list of result dicts."""
        X_main = self._prep_features(raw_df, self.main_features)
        main_probs = self.main_model.predict(X_main)
        main_pred_idx = np.argmax(main_probs, axis=1)
        main_conf = main_probs[np.arange(len(main_pred_idx)), main_pred_idx]
        main_pred_labels = [self._lookup(self.main_labels, i) for i in main_pred_idx]

        results = [
            {"label": lbl, "confidence": float(c), "uncertain": False, "alternative": None}
            for lbl, c in zip(main_pred_labels, main_conf)
        ]

        web_mask = [lbl in WEB_ATTACK_CLASSES for lbl in main_pred_labels]
        if any(web_mask):
            web_raw = raw_df[web_mask]
            X_sub = self._prep_features(web_raw, self.sub_features)
            sub_probs = self.sub_model.predict(X_sub)

            j = 0
            for i, is_web in enumerate(web_mask):
                if not is_web:
                    continue
                row_probs = sub_probs[j]
                order = np.argsort(row_probs)[::-1]
                top1_idx, top2_idx = order[0], order[1]
                top1_p, top2_p = row_probs[top1_idx], row_probs[top2_idx]
                top1_label = self._lookup(self.sub_labels, top1_idx)
                top2_label = self._lookup(self.sub_labels, top2_idx)
                uncertain = (top1_p - top2_p) < UNCERTAINTY_MARGIN

                results[i] = {
                    "label": top1_label,
                    "confidence": float(top1_p),
                    "uncertain": uncertain,
                    "alternative": top2_label if uncertain else None,
                }
                j += 1

        return results


def format_alert(row, result):
    src = row.get("src_ip", "?")
    sport = row.get("src_port", "?")
    dst = row.get("dst_ip", "?")
    dport = row.get("dst_port", "?")
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    label = result["label"]
    if result["uncertain"]:
        label = f"{label} OR {result['alternative']} (uncertain)"

    return (f"[{ts}] ALERT  {src}:{sport} -> {dst}:{dport}  "
            f"label={label}  confidence={result['confidence']:.2f}")


def main():
    os.makedirs(os.path.dirname(ALERT_LOG_PATH), exist_ok=True)
    ids = HierarchicalIDS()
    watcher = FolderTail(CICFLOWMETER_OUTPUT_DIR)

    print(f"\nWatching {CICFLOWMETER_OUTPUT_DIR} for new flows "
          f"(polling every {POLL_INTERVAL_SECONDS}s)...")
    print(f"Alerts will be logged to {ALERT_LOG_PATH}\n")

    total_flows = 0
    total_alerts = 0
    label_counts = {}
    last_heartbeat = time.time()
    HEARTBEAT_SECONDS = 15

    with open(ALERT_LOG_PATH, "a", buffering=1) as log_file:
        while True:
            new_data = watcher.poll()
            for path, df in new_data.items():
                if df.empty:
                    continue
                print(f"[{datetime.now().strftime('%H:%M:%S')}] "
                      f"Read {len(df)} new flow(s) from {os.path.basename(path)}")

                results = ids.predict_batch(df)
                for (_, row), result in zip(df.iterrows(), results):
                    total_flows += 1
                    label_counts[result["label"]] = label_counts.get(result["label"], 0) + 1
                    if result["label"] == BENIGN_LABEL:
                        continue
                    total_alerts += 1
                    alert = format_alert(row, result)
                    print(alert)
                    log_file.write(alert + "\n")

            # Periodic status line so silence can be told apart from "stuck"
            if time.time() - last_heartbeat > HEARTBEAT_SECONDS:
                summary = ", ".join(f"{k}={v}" for k, v in sorted(label_counts.items()))
                print(f"[{datetime.now().strftime('%H:%M:%S')}] heartbeat -- "
                      f"{total_flows} flows classified so far, {total_alerts} alerts "
                      f"({summary if summary else 'no flows seen yet'})")
                last_heartbeat = time.time()

            time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()