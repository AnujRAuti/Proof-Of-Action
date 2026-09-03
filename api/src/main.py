import io
import json

from typing import Annotated
from datetime import date
from fastapi import APIRouter, FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from image_processor import ImageProcessor

app = FastAPI()
api = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # remind me to change this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

image_processor = ImageProcessor()

@api.post("/images/")
async def get_images(
    before_img: Annotated[UploadFile, File()],
    after_img: Annotated[UploadFile, File()],
    before_coords: Annotated[str, Form()],
    after_coords: Annotated[str, Form()],
    before_date: Annotated[date, Form()],
    after_date: Annotated[date, Form()],
):
    parsed_before_coords = tuple(json.loads(before_coords))
    parsed_after_coords = tuple(json.loads(after_coords))

    before_img_bytes: bytes = await before_img.read()
    after_img_bytes: bytes = await after_img.read()

    before_img_file: Image.Image = Image.open(io.BytesIO(before_img_bytes))
    after_img_file: Image.Image = Image.open(io.BytesIO(after_img_bytes))

    response = image_processor.compare_images(before_img_file, after_img_file, parsed_before_coords, parsed_after_coords, before_date, after_date)

    return {"response": response}

app.include_router(api)
