"""
AgriMind ML Model Trainer
=========================
Trains 2 models on synthetic-but-realistic Indian farm data:
  1. RandomForestRegressor  → yield prediction (tons/acre) + profit
  2. GradientBoostingClassifier → pest risk score (Low / Medium / High)

Run once:  python ml/train.py
Outputs:   ml/yield_model.pkl
           ml/risk_model.pkl
           ml/encoders.pkl
"""

import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score

np.random.seed(42)
N = 5000  # training samples

# ─── Feature generation ──────────────────────────────────────────────────────
soil_types       = ['Sandy', 'Clay', 'Loamy', 'Silty']
water_options    = ['Low', 'Medium', 'High']
crop_types       = ['Maize', 'Cotton', 'Rice', 'Wheat', 'Tomato', 'Sugarcane', 'Groundnut', 'Turmeric']
seasons          = ['Kharif', 'Rabi', 'Zaid']

soil_arr    = np.random.choice(soil_types,  N)
water_arr   = np.random.choice(water_options, N)
crop_arr    = np.random.choice(crop_types,  N)
season_arr  = np.random.choice(seasons,     N)

farm_size   = np.random.uniform(1, 50, N)
nitrogen    = np.random.uniform(10, 100, N)
phosphorus  = np.random.uniform(5,  100, N)
potassium   = np.random.uniform(5,  100, N)
temperature = np.random.uniform(18, 42, N)
rainfall    = np.random.uniform(200, 1500, N)

# ─── Yield formula (agronomically grounded) ──────────────────────────────────
base_yield = np.where(soil_arr == 'Loamy', 5.2,
             np.where(soil_arr == 'Silty', 4.8,
             np.where(soil_arr == 'Clay',  4.1, 3.6)))

water_mult = np.where(water_arr == 'High', 1.15,
             np.where(water_arr == 'Low',  0.75, 1.0))

npk_score   = (nitrogen + phosphorus + potassium) / 300.0
temp_factor = 1.0 - np.abs(temperature - 28) / 50.0          # optimal 28°C
rain_factor = np.clip(rainfall / 900.0, 0.6, 1.2)

crop_coeff  = {'Maize':1.0,'Cotton':0.95,'Rice':1.1,'Wheat':0.9,
               'Tomato':1.15,'Sugarcane':1.3,'Groundnut':0.85,'Turmeric':1.2}
crop_mult   = np.array([crop_coeff[c] for c in crop_arr])

yield_pred  = (base_yield * water_mult * (0.7 + npk_score * 0.5)
               * temp_factor * rain_factor * crop_mult)
yield_pred += np.random.normal(0, 0.15, N)          # noise
yield_pred  = np.clip(yield_pred, 0.5, 12.0)

# Profit per acre in ₹ (realistic price per ton by crop)
price_per_ton = {'Maize':12000,'Cotton':55000,'Rice':18000,'Wheat':20000,
                 'Tomato':25000,'Sugarcane':3500,'Groundnut':45000,'Turmeric':80000}
crop_price  = np.array([price_per_ton[c] for c in crop_arr])
profit_pred = yield_pred * crop_price  # ₹ per acre (will multiply by farm_size in API)

# ─── Risk label ──────────────────────────────────────────────────────────────
risk_score = (
    (nitrogen   < 30).astype(int) * 2 +
    (phosphorus < 20).astype(int) * 1 +
    (potassium  < 20).astype(int) * 1 +
    (water_arr  == 'Low').astype(int) * 2 +
    (temperature > 36).astype(int) * 1 +
    (rainfall   < 400).astype(int) * 2
)
risk_label = np.where(risk_score >= 5, 'High',
             np.where(risk_score >= 2, 'Medium', 'Low'))

# ─── Encode categoricals ─────────────────────────────────────────────────────
le_soil   = LabelEncoder().fit(soil_types)
le_water  = LabelEncoder().fit(water_options)
le_crop   = LabelEncoder().fit(crop_types)
le_season = LabelEncoder().fit(seasons)
le_risk   = LabelEncoder().fit(['Low', 'Medium', 'High'])

X = np.column_stack([
    le_soil.transform(soil_arr),
    le_water.transform(water_arr),
    le_crop.transform(crop_arr),
    le_season.transform(season_arr),
    farm_size, nitrogen, phosphorus, potassium,
    temperature, rainfall,
])

y_yield  = yield_pred
y_profit = profit_pred
y_risk   = le_risk.transform(risk_label)

X_tr, X_te, yy_tr, yy_te, yp_tr, yp_te, yr_tr, yr_te = train_test_split(
    X, y_yield, y_profit, y_risk, test_size=0.2, random_state=42
)

# ─── Train yield model ───────────────────────────────────────────────────────
print("Training yield model (Random Forest)...")
yield_model = RandomForestRegressor(n_estimators=200, max_depth=12,
                                     n_jobs=-1, random_state=42)
yield_model.fit(X_tr, yy_tr)
mae = mean_absolute_error(yy_te, yield_model.predict(X_te))
print(f"  Yield MAE: {mae:.3f} tons/acre")

# ─── Train risk model ────────────────────────────────────────────────────────
print("Training risk model (Gradient Boosting)...")
risk_model = GradientBoostingClassifier(n_estimators=150, max_depth=5,
                                         learning_rate=0.1, random_state=42)
risk_model.fit(X_tr, yr_tr)
acc = accuracy_score(yr_te, risk_model.predict(X_te))
print(f"  Risk accuracy: {acc*100:.1f}%")

# ─── Save ────────────────────────────────────────────────────────────────────
os.makedirs('ml', exist_ok=True)
with open('ml/yield_model.pkl', 'wb') as f:
    pickle.dump(yield_model, f)
with open('ml/risk_model.pkl', 'wb') as f:
    pickle.dump(risk_model, f)
with open('ml/encoders.pkl', 'wb') as f:
    pickle.dump({
        'soil': le_soil, 'water': le_water,
        'crop': le_crop, 'season': le_season, 'risk': le_risk,
        'price_per_ton': price_per_ton,
    }, f)

print("\nModels saved to ml/")
print("   ml/yield_model.pkl")
print("   ml/risk_model.pkl")
print("   ml/encoders.pkl")
print("\nRun the server:  python ml/server.py")
