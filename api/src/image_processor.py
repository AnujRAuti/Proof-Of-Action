from transformers import pipeline

class ImageProcessor:
    def __init__(self):
        self.pipe = pipeline("image-text-to-text", model="Qwen/Qwen3.5-4B")
        self.messages = [
            {
                "role": "system",
                "content": [
                    {"type": "text", "text": "You are a generic comparison bot whose purpose is to analyze two images and compare them in detail. You will describe the differences with the fewest words possible while still covering every important point. The output should be unformatted. Ensure that only differences are covered, and no description of the scenes beyond that."}
                ]
            }
        ]

    def compare_images(self):
        self.messages.append({
            "role": "user",
            "content": [
                {"type": "image", "url": "before.png"},
                {"type": "image", "url": "after.png"},
                {"type": "text", "text": "/think"},
            ]
        })

        result = self.pipe(text=self.messages, max_new_tokens=8192)
        clean_output = result[0]['generated_text'][-1]['content'].split('</think>')[-1].strip()

        return clean_output
