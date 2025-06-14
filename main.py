from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dummy_model import predict
from PIL import Image
import shutil
import os

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/inspect")
async def inspect(file: UploadFile = File(...)):
    # Save the uploaded file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Optionally, open with PIL to check it's a valid image
    try:
        img = Image.open(temp_path)
        img.verify()
    except Exception:
        os.remove(temp_path)
        return {"label": "Invalid Image", "solution": "कृपया मान्य छवि अपलोड करें।"}
    # Predict (dummy)
    result = predict(temp_path)
    os.remove(temp_path)
    return result