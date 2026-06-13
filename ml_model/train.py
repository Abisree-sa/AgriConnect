"""
AgriMind — Custom CNN Crop Disease Classifier
Dataset : PlantVillage (38 classes, ~54k images)
Model   : MobileNetV2 (pretrained ImageNet) + custom head
Output  : model.pt  +  classes.json
"""

import os, json, time
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms
from torchvision.datasets import ImageFolder

# ── Config ──────────────────────────────────────────────────────────────────
DATA_DIR   = "data/plantvillage"      # will be downloaded here
MODEL_PATH = "model.pt"
CLASS_PATH = "classes.json"
IMG_SIZE   = 224
BATCH      = 32
EPOCHS     = 10
LR         = 1e-3
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Training on: {DEVICE}")

# ── 1. Download dataset ──────────────────────────────────────────────────────
def download_dataset():
    if os.path.exists(DATA_DIR) and len(os.listdir(DATA_DIR)) > 0:
        print("Dataset already exists, skipping download.")
        return

    os.makedirs(DATA_DIR, exist_ok=True)

    # Try kaggle first
    try:
        import kaggle
        print("Downloading PlantVillage dataset from Kaggle...")
        kaggle.api.authenticate()
        kaggle.api.dataset_download_files(
            "abdallahalidev/plantvillage-dataset",
            path="data/",
            unzip=True,
            quiet=False
        )
        # Kaggle unzips to data/plantvillage/color
        color_dir = "data/plantvillage/color"
        if os.path.exists(color_dir):
            import shutil
            # Move color subfolder contents up
            for item in os.listdir(color_dir):
                shutil.move(os.path.join(color_dir, item), DATA_DIR)
        print("Dataset downloaded from Kaggle.")
        return
    except Exception as e:
        print(f"Kaggle download failed: {e}")

    # Fallback: use torchvision built-in tiny subset for demo
    print("Using torchvision demo subset (10 classes, smaller)...")
    _build_demo_dataset()


def _build_demo_dataset():
    """
    Build a minimal demo dataset using torchvision Food101 / CIFAR as placeholder.
    In production replace with real PlantVillage images.
    """
    from torchvision.datasets import CIFAR10
    import shutil
    from PIL import Image
    import numpy as np

    cifar = CIFAR10(root="data/cifar_tmp", download=True, train=True)
    class_names = [
        "Corn_healthy", "Corn_CommonRust", "Corn_NorthernBlight", "Corn_GrayLeafSpot",
        "Tomato_healthy", "Tomato_EarlyBlight", "Tomato_LateBlight", "Tomato_LeafMold",
        "Potato_healthy", "Potato_EarlyBlight"
    ]
    # Map CIFAR classes → crop disease classes (for structure demo only)
    for i, cls in enumerate(class_names):
        cls_dir = os.path.join(DATA_DIR, cls)
        os.makedirs(cls_dir, exist_ok=True)
        indices = [j for j, (_, label) in enumerate(cifar) if label == (i % 10)][:200]
        for k, idx in enumerate(indices):
            img_array, _ = cifar[idx]
            if not isinstance(img_array, Image.Image):
                img_array = Image.fromarray(img_array)
            img_array = img_array.resize((224, 224))
            img_array.save(os.path.join(cls_dir, f"img_{k:04d}.jpg"))
    print(f"Demo dataset built: {len(class_names)} classes, ~200 images each.")
    shutil.rmtree("data/cifar_tmp", ignore_errors=True)


# ── 2. Data transforms ───────────────────────────────────────────────────────
train_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

val_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


# ── 3. Build model ───────────────────────────────────────────────────────────
def build_model(num_classes: int) -> nn.Module:
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
    # Freeze all backbone layers
    for param in model.features.parameters():
        param.requires_grad = False
    # Replace classifier head
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(model.last_channel, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes),
    )
    return model.to(DEVICE)


# ── 4. Train ─────────────────────────────────────────────────────────────────
def train():
    download_dataset()

    full_ds = ImageFolder(DATA_DIR, transform=train_tf)
    class_names = full_ds.classes
    num_classes = len(class_names)
    print(f"Classes found: {num_classes} → {class_names}")

    # Save class index mapping
    with open(CLASS_PATH, "w") as f:
        json.dump({str(v): k for k, v in full_ds.class_to_idx.items()}, f, indent=2)
    print(f"Saved {CLASS_PATH}")

    # 80/20 train-val split
    val_size = int(0.2 * len(full_ds))
    train_ds, val_ds = random_split(full_ds, [len(full_ds) - val_size, val_size])
    val_ds.dataset.transform = val_tf

    train_loader = DataLoader(train_ds, batch_size=BATCH, shuffle=True,  num_workers=0, pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=BATCH, shuffle=False, num_workers=0, pin_memory=True)

    model     = build_model(num_classes)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()), lr=LR
    )
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=4, gamma=0.5)

    best_val_acc = 0.0

    for epoch in range(1, EPOCHS + 1):
        # — Train —
        model.train()
        train_loss, correct, total = 0.0, 0, 0
        t0 = time.time()
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            out  = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * imgs.size(0)
            correct    += (out.argmax(1) == labels).sum().item()
            total      += imgs.size(0)

        # — Validate —
        model.eval()
        val_loss, val_correct, val_total = 0.0, 0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
                out  = model(imgs)
                loss = criterion(out, labels)
                val_loss    += loss.item() * imgs.size(0)
                val_correct += (out.argmax(1) == labels).sum().item()
                val_total   += imgs.size(0)

        train_acc = 100 * correct    / total
        val_acc   = 100 * val_correct / val_total
        elapsed   = time.time() - t0
        print(
            f"Epoch {epoch:02d}/{EPOCHS} | "
            f"Train Loss: {train_loss/total:.4f} Acc: {train_acc:.1f}% | "
            f"Val Loss: {val_loss/val_total:.4f} Acc: {val_acc:.1f}% | "
            f"Time: {elapsed:.1f}s"
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "epoch": epoch,
                "model_state": model.state_dict(),
                "num_classes": num_classes,
                "val_acc": val_acc,
            }, MODEL_PATH)
            print(f"  ✓ Best model saved (val_acc={val_acc:.1f}%)")

        scheduler.step()

    print(f"\nTraining complete. Best val accuracy: {best_val_acc:.1f}%")
    print(f"Model saved → {MODEL_PATH}")


if __name__ == "__main__":
    train()
