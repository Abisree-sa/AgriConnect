"""
Quick-start: checks Python env and launches training then the server.
Run: python start.py
"""
import subprocess, sys, os

def run(cmd, **kw):
    print(f"\n$ {cmd}")
    return subprocess.run(cmd, shell=True, **kw)

# 1. Install deps
run(f"{sys.executable} -m pip install -r requirements.txt")

# 2. Train if model doesn't exist
if not os.path.exists("model.pt"):
    print("\n── Training model (first time) ──")
    result = run(f"{sys.executable} train.py")
    if result.returncode != 0:
        print("Training failed. Fix errors above and retry.")
        sys.exit(1)
else:
    print("\nmodel.pt already exists — skipping training. Delete it to retrain.")

# 3. Serve
print("\n── Starting ML API server on http://localhost:8000 ──")
run("uvicorn serve:app --host 0.0.0.0 --port 8000 --reload")
