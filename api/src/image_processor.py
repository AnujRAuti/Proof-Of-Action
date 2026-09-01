from transformers import pipeline

pipe = pipeline("image-text-to-text", model="Qwen/Qwen3.5-4B")
messages = [
    {
        "role": "system",
        "content": [
            {"type": "text", "text": "You are a generic comparison bot whose purpose is to analyze two images and compare them in detail. You will describe the differences with the fewest words possible while still covering every important point. The output should be unformatted. Ensure that only differences are covered, and no description of the scenes beyond that."}
        ]
    },
    {
        "role": "user",
        "content": [
            {"type": "image", "url": "before.png"},
            {"type": "image", "url": "after.png"},
            {"type": "text", "text": "/think"},
        ]
    },
]
result = pipe(text=messages, max_new_tokens=8192)
clean_output = result[0]['generated_text'][-1]['content'].split('</think>')[-1].strip()
print(clean_output)
