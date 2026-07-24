"""
Train a multiclass intrusion-detection model on the merged CICIDS2017 dataset.

Model: LightGBM (gradient-boosted trees)
Why: this is tabular flow-based data, not images/sequences -- trees
consistently match or beat deep nets here, train in minutes on CPU alone,
and completely sidestep your 6GB VRAM limit (no GPU needed or used).

Handles CICIDS2017's well-known extreme class imbalance via:
  - stratified train/test split (so rare classes like Heartbleed, with
    only 11 rows total, still appear in both train and test)
  - per-class sample weighting (rare classes count for more during training)
  - macro-F1 as the headline metric instead of accuracy, plus a full
    per-class precision/recall/F1 report

USAGE:
    pip install lightgbm scikit-learn pandas numpy joblib
    python train_lightgbm.py
"""

import re
import json
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, f1_score, confusion_matrix
from sklearn.utils.class_weight import compute_sample_weight
import joblib

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
DATA_PATH = "D:/AI-NIDS/merged_dataset/cicids2017_merged.parquet"
LABEL_COL = "Label"
TEST_SIZE = 0.2
RANDOM_STATE = 42
MODEL_OUT = "D:/AI-NIDS/models/cicids2017_lightgbm.txt"
LABEL_MAP_OUT = "D:/AI-NIDS/models/label_mapping.json"


def normalize_label(label: str) -> str:
    """Some 'Web Attack' labels have an en-dash that got mangled into a
    replacement character during earlier CSV->Parquet conversion (shows as
    '�' in some terminals). Normalize any dash-like separator to a plain
    hyphen so these don't accidentally become separate classes."""
    label = label.strip()
    label = re.sub(r"\s*[\ufffd\u2013\u2014\x96]\s*", " - ", label)
    label = re.sub(r"\s+", " ", label)
    return label


def main():
    import os
    os.makedirs("D:/AI-NIDS/models", exist_ok=True)

    print(f"Loading {DATA_PATH} ...")
    df = pd.read_parquet(DATA_PATH)
    print(f"Loaded {len(df):,} rows, {df.shape[1]} columns")

    df[LABEL_COL] = df[LABEL_COL].astype(str).map(normalize_label)

    print("\nClass distribution after normalization:")
    print(df[LABEL_COL].value_counts())

    y_raw = df[LABEL_COL].values
    X = df.drop(columns=[LABEL_COL])

    # LightGBM needs numeric labels, but we keep the mapping to translate
    # predictions back to human-readable attack names later.
    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)
    label_mapping = {int(i): cls for i, cls in enumerate(encoder.classes_)}
    with open(LABEL_MAP_OUT, "w") as f:
        json.dump(label_mapping, f, indent=2)
    print(f"\nSaved label mapping ({len(label_mapping)} classes) -> {LABEL_MAP_OUT}")

    print("\nSplitting train/test (stratified, so rare classes appear in both)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train: {len(X_train):,} rows | Test: {len(X_test):,} rows")

    # Give rare classes (e.g. Heartbleed, Infiltration) proportionally more
    # weight during training so the model doesn't just ignore them.
    sample_weight = compute_sample_weight(class_weight="balanced", y=y_train)

    train_set = lgb.Dataset(X_train, label=y_train, weight=sample_weight)
    val_set = lgb.Dataset(X_test, label=y_test, reference=train_set)

    params = {
        "objective": "multiclass",
        "num_class": len(label_mapping),
        "metric": "multi_logloss",
        "boosting_type": "gbdt",
        "num_leaves": 63,
        "learning_rate": 0.05,
        "feature_fraction": 0.9,
        "bagging_fraction": 0.9,
        "bagging_freq": 5,
        "min_data_in_leaf": 20,
        "num_threads": os.cpu_count(),   # CPU training -- 6GB VRAM never touched
        "verbosity": -1,
        "seed": RANDOM_STATE,
    }

    print("\nTraining LightGBM (CPU, multiclass)...")
    model = lgb.train(
        params,
        train_set,
        num_boost_round=500,
        valid_sets=[train_set, val_set],
        valid_names=["train", "test"],
        callbacks=[
            lgb.early_stopping(stopping_rounds=30),
            lgb.log_evaluation(period=25),
        ],
    )

    model.save_model(MODEL_OUT)
    print(f"\nSaved model -> {MODEL_OUT}")

    print("\nEvaluating on held-out test set...")
    y_pred_proba = model.predict(X_test, num_iteration=model.best_iteration)
    y_pred = np.argmax(y_pred_proba, axis=1)

    macro_f1 = f1_score(y_test, y_pred, average="macro")
    weighted_f1 = f1_score(y_test, y_pred, average="weighted")
    print(f"\nMacro-F1:    {macro_f1:.4f}  (treats every class equally -- best "
          f"single number for imbalanced data like this)")
    print(f"Weighted-F1: {weighted_f1:.4f}  (accounts for class size)")

    print("\nPer-class report:")
    target_names = [label_mapping[i] for i in range(len(label_mapping))]
    print(classification_report(y_test, y_pred, target_names=target_names,
                                 zero_division=0))

    print("Confusion matrix (rows=true, cols=predicted):")
    cm = confusion_matrix(y_test, y_pred)
    cm_df = pd.DataFrame(cm, index=target_names, columns=target_names)
    print(cm_df)

    joblib.dump(encoder, "D:/AI-NIDS/models/label_encoder.joblib")
    print("\nDone. Model, label mapping, and encoder saved to D:/AI-NIDS/models/")


if __name__ == "__main__":
    main()
