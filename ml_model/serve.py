"""
AgriMind — ML Model FastAPI Server
Loads trained MobileNetV2 model and serves predictions.

Run:
    uvicorn serve:app --host 0.0.0.0 --port 8000 --reload

Endpoint:
    POST /predict   { "base64Image": "<base64 string>" }
    GET  /health
"""

import os, json, base64, io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Paths ────────────────────────────────────────────────────────────────────
MODEL_PATH  = os.path.join(os.path.dirname(__file__), "model.pt")
CLASS_PATH  = os.path.join(os.path.dirname(__file__), "classes.json")
META_PATH   = os.path.join(os.path.dirname(__file__), "disease_meta.json")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── Load class map & disease metadata ────────────────────────────────────────
with open(CLASS_PATH) as f:
    idx_to_class: dict[str, str] = json.load(f)   # {"0": "Apple___Apple_scab", ...}

with open(META_PATH) as f:
    disease_meta: dict = json.load(f)

# ── Load model ────────────────────────────────────────────────────────────────
def load_model() -> nn.Module:
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    num_classes = checkpoint["num_classes"]

    model = models.mobilenet_v2(weights=None)
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes),
    )
    model.load_state_dict(checkpoint["model_state"])
    model.to(DEVICE)
    model.eval()
    print(f"Model loaded — {num_classes} classes — device: {DEVICE}")
    return model

model = load_model()

# ── Image preprocessing ───────────────────────────────────────────────────────
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title="AgriMind ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    base64Image: str

class PredictResponse(BaseModel):
    crop: str
    disease: str
    confidence: int
    risk: str
    treatment: str
    raw_class: str
    top3: list[dict]


@app.get("/health")
def health():
    return {"status": "ok", "model": "MobileNetV2", "classes": len(idx_to_class), "device": str(DEVICE)}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # 1. Decode base64 → PIL Image
    try:
        img_bytes = base64.b64decode(req.base64Image)
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image")

    # 2. Preprocess
    tensor = preprocess(image).unsqueeze(0).to(DEVICE)  # (1, 3, 224, 224)

    # 3. Inference
    with torch.no_grad():
        logits = model(tensor)                          # (1, num_classes)
        probs  = torch.softmax(logits, dim=1)[0]        # (num_classes,)

    # 4. Top-3 predictions
    top3_vals, top3_idxs = torch.topk(probs, 3)
    top3 = [
        {
            "class": idx_to_class[str(idx.item())],
            "confidence": round(val.item() * 100, 1),
        }
        for val, idx in zip(top3_vals, top3_idxs)
    ]

    # 5. Best prediction
    best_class  = idx_to_class[str(top3_idxs[0].item())]
    confidence  = int(round(top3_vals[0].item() * 100))

    # 6. Lookup metadata
    meta = disease_meta.get(best_class)
    if meta:
        crop      = meta["crop"]
        disease   = meta["disease"]
        risk      = meta["risk"]
        treatment = meta["treatment"]
    else:
        # Fallback: parse class name directly (format: Crop___Disease)
        parts   = best_class.replace("___", "___").split("___")
        crop    = parts[0].replace("_", " ") if parts else "Unknown"
        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        risk    = "Medium"
        treatment = "Consult your local agricultural extension officer for specific treatment advice."

    # Adjust risk based on confidence
    if confidence < 60:
        risk = "Low"   # uncertain prediction — don't alarm farmer

    return PredictResponse(
        crop=crop,
        disease=disease,
        confidence=confidence,
        risk=risk,
        treatment=treatment,
        raw_class=best_class,
        top3=top3,
    )
