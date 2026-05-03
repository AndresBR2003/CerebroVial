import sys
import os
import uvicorn

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.main import app  # noqa: E402

if __name__ == "__main__":
    print("Starting CerebroVial Core API...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
