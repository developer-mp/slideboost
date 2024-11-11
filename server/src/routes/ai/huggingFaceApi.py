import sys
import requests

file_path = sys.argv[1]
prompt = sys.argv[2]

with open(file_path, 'r') as file:
    transcript = file.read()

api_url = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B"
api_key = "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"

headers = {
    "Authorization": f"Bearer {api_key}"
}

payload = {
    "inputs": f"{prompt}\n{transcript}",
}

try:
    response = requests.post(api_url, headers=headers, json=payload)
    response.raise_for_status()

    generated_text = response.json()[0]["generated_text"]
    print(generated_text)

except requests.exceptions.RequestException as e:
    print(f"Error: {str(e)}")
    print(response.text if response else "No response from API")
