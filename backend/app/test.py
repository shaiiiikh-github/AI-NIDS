import lightgbm as lgb

MODEL = r"D:\NIDS\AI-NIDS\backend\models\cicids2017_lightgbm.txt"

print("LightGBM:", lgb.__version__)
print("Loading:", MODEL)

model = lgb.Booster(model_file=MODEL)

print("Loaded successfully!")
print("Features:", len(model.feature_name()))