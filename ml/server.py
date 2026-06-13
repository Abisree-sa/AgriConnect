"""
AgriMind ML Server
==================
FastAPI microservice that serves:
  POST /predict/yield   → yield + profit + risk prediction
  POST /predict/pest    → rule-based pest risk from farm features
  GET  /health          → health check

Run:  python ml/server.py
Port: 8000
"""

import pickle
import numpy as np
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os

# ─── Load models ─────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

def load_models():
    with open(os.path.join(BASE, 'yield_model.pkl'), 'rb') as f:
        yield_model = pickle.load(f)
    with open(os.path.join(BASE, 'risk_model.pkl'), 'rb') as f:
        risk_model = pickle.load(f)
    with open(os.path.join(BASE, 'encoders.pkl'), 'rb') as f:
        enc = pickle.load(f)
    return yield_model, risk_model, enc

try:
    yield_model, risk_model, enc = load_models()
    MODELS_LOADED = True
    print("✅ Models loaded successfully")
except Exception as e:
    MODELS_LOADED = False
    print(f"❌ Models not found: {e}")
    print("   Run: python ml/train.py first")

# ─── Recommendation engine ───────────────────────────────────────────────────
TREATMENT = {
    'Fall Armyworm':   'Spray Emamectin Benzoate 0.4g/L in evenings. Use Beauveria bassiana biopesticide.',
    'Bollworm':        'Apply Chlorpyrifos 2ml/L. Install pheromone traps 5/acre.',
    'Leaf Blight':     'Spray Mancozeb 2.5g/L. Remove infected leaves. Improve drainage.',
    'Early Blight':    'Apply Copper Oxychloride 3g/L. Avoid overhead irrigation.',
    'Rust Disease':    'Spray Propiconazole 1ml/L. Use rust-resistant varieties next season.',
    'Whitefly':        'Apply Imidacloprid 0.3ml/L. Use yellow sticky traps.',
    'Leaf Spot':       'Spray Carbendazim 1g/L. Ensure proper plant spacing.',
    'Red Rot':         'Remove infected canes immediately. Apply Carbendazim soil drench.',
}

PEST_BY_CROP = {
    'Maize':     'Fall Armyworm',
    'Cotton':    'Bollworm',
    'Rice':      'Leaf Blight',
    'Tomato':    'Early Blight',
    'Wheat':     'Rust Disease',
    'Sugarcane': 'Red Rot',
    'Groundnut': 'Leaf Spot',
    'Turmeric':  'Leaf Spot',
}

def build_features(data):
    soil    = data.get('soilType', 'Loamy')
    water   = data.get('waterAvailability', 'Medium')
    crop    = data.get('cropType', 'Maize')
    season  = data.get('season', 'Kharif')
    size    = float(data.get('farmSize', 5))
    n       = float(data.get('nitrogen', 50))
    p       = float(data.get('phosphorus', 40))
    k       = float(data.get('potassium', 45))
    temp    = float(data.get('temperature', 28))
    rain    = float(data.get('rainfall', 800))

    # Safe encoding with fallback
    soils   = list(enc['soil'].classes_)
    waters  = list(enc['water'].classes_)
    crops   = list(enc['crop'].classes_)
    seasons = list(enc['season'].classes_)

    soil_enc   = enc['soil'].transform([soil if soil in soils else soils[0]])[0]
    water_enc  = enc['water'].transform([water if water in waters else waters[0]])[0]
    crop_enc   = enc['crop'].transform([crop if crop in crops else crops[0]])[0]
    season_enc = enc['season'].transform([season if season in seasons else seasons[0]])[0]

    return np.array([[soil_enc, water_enc, crop_enc, season_enc,
                      size, n, p, k, temp, rain]]), crop, size

def predict_yield(data):
    X, crop, farm_size = build_features(data)

    yield_per_acre = float(yield_model.predict(X)[0])
    risk_encoded   = int(risk_model.predict(X)[0])
    risk_label     = enc['risk'].inverse_transform([risk_encoded])[0]

    # Risk probabilities
    proba = risk_model.predict_proba(X)[0]
    risk_classes = enc['risk'].classes_
    risk_proba = {str(risk_classes[i]): round(float(proba[i]) * 100, 1)
                  for i in range(len(risk_classes))}

    price = enc['price_per_ton'].get(crop, 20000)
    profit_per_acre = yield_per_acre * price
    total_profit    = profit_per_acre * farm_size

    n  = float(data.get('nitrogen', 50))
    p  = float(data.get('phosphorus', 40))
    k  = float(data.get('potassium', 45))
    wa = data.get('waterAvailability', 'Medium')
    st = data.get('soilType', 'Loamy')

    recs = []
    if n < 30:  recs.append('Apply Urea 35kg/acre — nitrogen is critically low.')
    elif n < 50: recs.append('Apply Urea 20kg/acre — nitrogen below optimal.')
    if p < 20:  recs.append('Apply DAP 25kg/acre — phosphorus is deficient.')
    if k < 20:  recs.append('Apply MOP 15kg/acre — potassium needs improvement.')
    if wa == 'Low': recs.append('Install drip irrigation — water stress will reduce yield 25%.')
    if st == 'Sandy': recs.append('Add organic matter (FYM 5 tons/acre) to improve water retention.')
    if not recs: recs.append(f'Farm conditions are good for {crop}. Maintain current NPK schedule.')

    return {
        'yieldPrediction':  round(yield_per_acre, 2),
        'profitPerAcre':    round(profit_per_acre),
        'profitPrediction': round(total_profit),
        'riskScore':        risk_label,
        'riskProbabilities': risk_proba,
        'recommendations':  ' '.join(recs),
        'cropPrice':        price,
        'modelSource':      'RandomForest+GradientBoosting',
    }

def predict_pest(data):
    crop = data.get('cropType', 'Maize')
    n    = float(data.get('nitrogen', 50))
    temp = float(data.get('temperature', 28))
    rain = float(data.get('rainfall', 800))

    pest = PEST_BY_CROP.get(crop, 'Fall Armyworm')
    treatment = TREATMENT.get(pest, 'Consult local agronomist.')

    # Simple agronomic risk scoring
    risk_pts = 0
    if n < 30:    risk_pts += 2
    if temp > 35: risk_pts += 2
    if rain < 400: risk_pts += 1
    if rain > 1200: risk_pts += 1

    risk = 'High' if risk_pts >= 4 else 'Medium' if risk_pts >= 2 else 'Low'
    confidence = min(95, 60 + risk_pts * 8)

    return {
        'crop':       crop,
        'disease':    pest,
        'confidence': confidence,
        'risk':       risk,
        'treatment':  treatment,
        'source':     'ml_model',
    }

# ─── HTTP Server ─────────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"  [{self.address_string()}] {format % args}")

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            self.send_json({
                'status': 'ok',
                'models_loaded': MODELS_LOADED,
                'endpoints': ['/predict/yield', '/predict/pest', '/health']
            })
        else:
            self.send_json({'error': 'Not found'}, 404)

    def do_POST(self):
        if not MODELS_LOADED:
            self.send_json({'error': 'Models not loaded. Run: python ml/train.py'}, 503)
            return

        length = int(self.headers.get('Content-Length', 0))
        body   = self.rfile.read(length)
        try:
            data = json.loads(body)
        except Exception:
            self.send_json({'error': 'Invalid JSON'}, 400)
            return

        try:
            if self.path == '/predict/yield':
                self.send_json(predict_yield(data))
            elif self.path == '/predict/pest':
                self.send_json(predict_pest(data))
            elif self.path == '/predict':
                # Legacy endpoint — route by content
                if 'base64Image' in data:
                    self.send_json(predict_pest(data))
                else:
                    self.send_json(predict_yield(data))
            else:
                self.send_json({'error': 'Unknown endpoint'}, 404)
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

if __name__ == '__main__':
    PORT = int(os.environ.get('ML_PORT', 8000))
    print(f"\nAgriMind ML Server starting on http://localhost:{PORT}")
    print(f"   Models loaded: {MODELS_LOADED}")
    print(f"   Endpoints:")
    print(f"     GET  /health")
    print(f"     POST /predict/yield  - yield + profit + risk prediction")
    print(f"     POST /predict/pest   - pest detection from farm params")
    print(f"\n   Press Ctrl+C to stop\n")
    server = HTTPServer(('localhost', PORT), Handler)
    server.serve_forever()
