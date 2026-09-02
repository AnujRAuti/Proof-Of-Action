from typing import final
from datetime import date
from geopy.distance import geodesic
from PIL import Image
from transformers import ImageTextToTextPipeline, pipeline


@final
class ImageProcessor:
    message = {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are a generic comparison bot whose purpose is to analyze two images and compare them in detail. The location, distance between both photographs locations, date, and time gap will be provided too. You will describe the differences with the fewest words possible while still covering every important point. The output should be unformatted. Ensure that only differences are covered, and no description of the scenes beyond that.",
                }
            ],
        }

    def __init__(self):
        self.pipe: ImageTextToTextPipeline = pipeline("image-text-to-text", model="Qwen/Qwen3.5-4B")

    def compare_images(self, before_img: Image.Image, after_img: Image.Image, before_coords: tuple[float, float], after_coords: tuple[float, float], before_date: date, after_date: date) -> str:
        distance: float = geodesic(before_coords, after_coords).meters
        time_gap: int = (after_date-before_date).days

        prompted_message = [
            ImageProcessor.message,
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Before image:"},
                    {"type": "image", "image": before_img},
                    {"type": "text", "text": "The date for the before image is - " + before_date},
                    {"type": "text", "text": "After image:"},
                    {"type": "image", "image": after_img},
                    {"type": "text", "text": "The date for the after image is - " + after_date},
                    {"type": "text", "text": "The physical distance between both photographs is: " + distance},
                    {"type": "text", "text": "The time gap between both photographs is: " + time_gap},
                    {"type": "text", "text": "/think"},
                ],
            }
        ]

        result = self.pipe(text=prompted_message, max_new_tokens=8192)
        clean_output: str = result[0]["generated_text"][-1]["content"].split("</think>")[-1].strip()

        return clean_output
