import io

from datetime import date
from fastapi import APIRouter, FastAPI, UploadFile
from PIL import Image

from image_processor import ImageProcessor

app = FastAPI()
api = APIRouter()

image_processor = ImageProcessor()

@api.post("/images/")
async def get_images(before_img: UploadFile, after_img: UploadFile, before_coords: tuple[float, float], after_coords: tuple[float, float], before_date: date, after_date: date):
    before_img_bytes: bytes = await before_img.read()
    after_img_bytes: bytes = await after_img.read()

    before_img_file: Image.Image = Image.open(io.BytesIO(before_img_bytes))
    after_img_file: Image.Image = Image.open(io.BytesIO(after_img_bytes))

    response = image_processor.compare_images(before_img_file, after_img_file)

    return {"response": response}

app.include_router(api)
