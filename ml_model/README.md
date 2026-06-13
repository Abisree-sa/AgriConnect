# AgriMind — Custom ML Model

A real MobileNetV2-based crop disease classifier trained on the **PlantVillage dataset** (38 classes, ~54k images).

## Architecture

```
Input Image (224×224)
        ↓
MobileNetV2 backbone (pretrained ImageNet, frozen)
        ↓
Custom head: Dropout → Linear(1280→256) → ReLU → Dropout → Linear(256→38)
        ↓
Softmax → Top-1 class + confidence
        ↓
disease_meta.json → crop, disease, risk level, treatment advice
```

## Files

| File | Purpose |
|---|---|
| `train.py` | Downloads PlantVillage dataset, trains MobileNetV2, saves `model.pt` + `classes.json` |
| `serve.py` | FastAPI server — loads `model.pt`, exposes `POST /predict` |
| `disease_meta.json` | 38-class treatment + risk database |
| `requirements.txt` | Python dependencies |
| `start.py` | One-command: install → train → serve |

## How to Run

### Step 1 — Setup Python env (once)
```bash
cd ml_model
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

### Step 2 — (Optional) Kaggle dataset for real training
For best accuracy, download the real PlantVillage dataset:
1. Create account at https://www.kaggle.com
2. Go to Account → Create API Token → download `kaggle.json`
3. Place `kaggle.json` at `C:\Users\<YOU>\.kaggle\kaggle.json`

Without Kaggle credentials, `train.py` automatically builds a demo dataset using CIFAR-10 images mapped to crop disease class names (good for testing the pipeline, but accuracy will be low).

### Step 3 — Train
```bash
python train.py
```
Outputs:
- `model.pt` — trained weights (best val accuracy checkpoint)
- `classes.json` — index → class name mapping

Training time (demo dataset):
- CPU: ~5–10 minutes
- GPU (CUDA): ~1–2 minutes

Training time (real PlantVillage, ~54k images):
- CPU: ~2–4 hours
- GPU: ~15–30 minutes

### Step 4 — Serve
```bash
uvicorn serve:app --host 0.0.0.0 --port 8000 --reload
```

Or just run everything at once:
```bash
python start.py
```

## API

### `GET /health`
```json
{ "status": "ok", "model": "MobileNetV2", "classes": 38, "device": "cpu" }
```

### `POST /predict`
Request:
```json
{ "base64Image": "<base64 encoded JPEG/PNG>" }
```
Response:
```json
{
  "crop": "Tomato",
  "disease": "Late Blight",
  "confidence": 91,
  "risk": "High",
  "treatment": "Immediately spray Metalaxyl + Mancozeb 2.5g/L...",
  "raw_class": "Tomato___Late_blight",
  "top3": [
    { "class": "Tomato___Late_blight", "confidence": 91.2 },
    { "class": "Tomato___Early_blight", "confidence": 5.1 },
    { "class": "Tomato___healthy", "confidence": 1.8 }
  ]
}
```

## How Next.js uses the ML server

`src/app/api/image-analysis/route.ts` calls `http://localhost:8000/predict` first.
- If ML server is running → uses custom model (`source: "ml_model"`)
- If ML server is down → falls back to OpenAI GPT-4o Vision (`source: "openai"`)
- If neither → returns static fallback (`source: "fallback"`)

## Supported Diseases (38 classes)

| Crop | Diseases |
|---|---|
| Corn | Common Rust, Northern Leaf Blight, Gray Leaf Spot, Healthy |
| Tomato | Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, YLC Virus, Mosaic Virus, Bacterial Spot, Healthy |
| Potato | Early Blight, Late Blight, Healthy |
| Rice | Leaf Scald, Brown Spot, Hispa, Healthy |
| Wheat | Leaf Rust, Yellow Rust, Healthy |
| Cotton | Bacterial Blight, Curl Virus, Fusarium Wilt, Healthy |
| Grape | Black Rot, Esca, Leaf Blight, Healthy |
| Apple | Apple Scab, Black Rot, Cedar Rust, Healthy |
| Strawberry | Leaf Scorch, Healthy |
