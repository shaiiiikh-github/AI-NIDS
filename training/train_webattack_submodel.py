"""
Stage 2: A specialized submodel for distinguishing Web Attack subtypes
(Brute Force / XSS / SQL Injection).

WHY THIS EXISTS
Your main 15-class model gets diluted attention on these 3 classes --
they're ~2,146 rows out of 2.3M. This submodel trains ONLY on Web Attack
rows, so 100% of its capacity goes toward the one problem: telling these
three apart.

WHAT TO EXPECT
- Brute Force vs XSS should improve noticeably -- there's real signal to
  learn from ~1,470 and ~652 examples respectively.
- SQL Injection (21 total rows, ~4 in any given fold) will likely remain
  unreliable no matter what we do here. That's a data-volume ceiling, not
  a modeling failure -- flag any SQL Injection prediction from this
  submodel as lower-confidence in your deployment logic.

HOW TO USE THE RESULT
In production: run the main model first. If it predicts "Web Attack" (or
any of the 3 subtypes), pass that same flow's features through this
submodel to get the specific subtype. See predict_hierarchical() at the
bottom for the combined inference function.

USAGE:
    pip install lightgbm scikit-learn imbalanced-learn joblib
    python train_webattack_submodel.py
"""

import os
import re
import json
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, f1_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
DATA_PATH = "D:/AI-NIDS/merged_dataset/cicids2017_merged.parquet"
LABEL_COL = "Label"
MODEL_DIR = "D:/AI-NIDS/models"
SUBMODEL_OUT = f"{MODEL_DIR}/webattack_submodel.txt"
SUBLABEL_MAP_OUT = f"{MODEL_DIR}/webattack_label_mapping.json"
RANDOM_STATE = 42
N_FOLDS = 5

WEB_ATTACK_CLASSES = [
    "Web Attack - Brute Force",
    "Web Attack - XSS",
    "Web Attack - Sql Injection",
]


def normalize_label(label: str) -> str:
    label = label.strip()
    label = re.sub(r"\s*[\ufffd\u2013\u2014\x96]\s*", " - ", label)
    label = re.sub(r"\s+", " ", label)
    return label


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print(f"Loading {DATA_PATH} ...")
    df = pd.read_parquet(DATA_PATH)
    df[LABEL_COL] = df[LABEL_COL].astype(str).map(normalize_label)

    web_df = df[df[LABEL_COL].isin(WEB_ATTACK_CLASSES)].copy()
    print(f"\nWeb Attack subset: {len(web_df):,} rows")
    print(web_df[LABEL_COL].value_counts())

    y_raw = web_df[LABEL_COL].values
    X = web_df.drop(columns=[LABEL_COL]).reset_index(drop=True)

    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)
    label_mapping = {int(i): cls for i, cls in enumerate(encoder.classes_)}
    with open(SUBLABEL_MAP_OUT, "w") as f:
        json.dump(label_mapping, f, indent=2)

    # -----------------------------------------------------------------
    # Evaluate with stratified k-fold CV first, so we get an honest sense
    # of performance despite the tiny SQL Injection class (single-split
    # testing would be too noisy with only ~4 SQL Injection rows in a
    # test set).
    # -----------------------------------------------------------------
    print(f"\nRunning {N_FOLDS}-fold stratified CV for an honest performance estimate...")
    skf = StratifiedKFold(n_splits=N_FOLDS, shuffle=True, random_state=RANDOM_STATE)

    all_true, all_pred = [], []
    for fold, (train_idx, test_idx) in enumerate(skf.split(X, y), start=1):
        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]

        # SMOTE needs at least k_neighbors+1 samples in the smallest class.
        # With SQL Injection this small, use a safe, small k.
        min_class_count = pd.Series(y_train).value_counts().min()
        k_neighbors = max(1, min(5, min_class_count - 1))
        try:
            sm = SMOTE(random_state=RANDOM_STATE, k_neighbors=k_neighbors)
            X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
        except ValueError:
            # Falls back to no oversampling if a class is still too small
            X_train_res, y_train_res = X_train, y_train

        model = lgb.LGBMClassifier(
            objective="multiclass",
            num_class=len(label_mapping),
            num_leaves=31,
            learning_rate=0.03,
            n_estimators=300,
            min_child_samples=5,
            random_state=RANDOM_STATE,
            verbosity=-1,
        )
        model.fit(X_train_res, y_train_res)
        preds = model.predict(X_test)

        all_true.extend(y_test)
        all_pred.extend(preds)
        fold_f1 = f1_score(y_test, preds, average="macro")
        print(f"  Fold {fold}: macro-F1 = {fold_f1:.4f}")

    target_names = [label_mapping[i] for i in range(len(label_mapping))]
    print("\nOverall (all folds combined) per-class report:")
    print(classification_report(all_true, all_pred, target_names=target_names,
                                 zero_division=0))
    print("Confusion matrix (rows=true, cols=predicted):")
    cm = confusion_matrix(all_true, all_pred)
    print(pd.DataFrame(cm, index=target_names, columns=target_names))

    # -----------------------------------------------------------------
    # Train the FINAL submodel on all Web Attack data (with SMOTE) for
    # actual deployment -- the CV above was just to measure how well it
    # generalizes.
    # -----------------------------------------------------------------
    print("\nTraining final submodel on all Web Attack data...")
    min_class_count = pd.Series(y).value_counts().min()
    k_neighbors = max(1, min(5, min_class_count - 1))
    sm = SMOTE(random_state=RANDOM_STATE, k_neighbors=k_neighbors)
    X_res, y_res = sm.fit_resample(X, y)

    final_model = lgb.LGBMClassifier(
        objective="multiclass",
        num_class=len(label_mapping),
        num_leaves=31,
        learning_rate=0.03,
        n_estimators=300,
        min_child_samples=5,
        random_state=RANDOM_STATE,
        verbosity=-1,
    )
    final_model.fit(X_res, y_res)
    final_model.booster_.save_model(SUBMODEL_OUT)
    joblib.dump(encoder, f"{MODEL_DIR}/webattack_label_encoder.joblib")

    print(f"\nSaved submodel -> {SUBMODEL_OUT}")
    print(f"Saved label mapping -> {SUBLABEL_MAP_OUT}")
    print("\nDone. Use predict_hierarchical() (see bottom of this file) at "
          "inference time: run your main model first, and only call this "
          "submodel on flows the main model flags as a Web Attack.")


def predict_hierarchical(flow_features_df, main_model, main_label_mapping,
                          submodel, sub_label_mapping):
    """
    Combined inference: main model first, submodel only for Web Attack hits.

    flow_features_df : DataFrame of feature rows (same 77 columns used in training)
    main_model        : the lgb Booster from train_lightgbm.py
    main_label_mapping: dict int -> class name, from label_mapping.json
    submodel           : the lgb Booster from this script
    sub_label_mapping  : dict int -> class name, from webattack_label_mapping.json

    Returns a list of final predicted label strings, one per row.
    """
    main_pred_idx = np.argmax(main_model.predict(flow_features_df), axis=1)
    main_pred_labels = [main_label_mapping[str(i)] if isinstance(list(main_label_mapping.keys())[0], str)
                         else main_label_mapping[i] for i in main_pred_idx]

    final_labels = list(main_pred_labels)
    web_attack_mask = [lbl in WEB_ATTACK_CLASSES for lbl in main_pred_labels]

    if any(web_attack_mask):
        web_rows = flow_features_df[web_attack_mask]
        sub_pred_idx = np.argmax(submodel.predict(web_rows), axis=1)
        sub_labels = [sub_label_mapping[str(i)] if isinstance(list(sub_label_mapping.keys())[0], str)
                      else sub_label_mapping[i] for i in sub_pred_idx]
        j = 0
        for i, is_web in enumerate(web_attack_mask):
            if is_web:
                final_labels[i] = sub_labels[j]
                j += 1

    return final_labels


if __name__ == "__main__":
    main()
