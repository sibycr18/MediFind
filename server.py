from flask import Flask, jsonify, request
import requests
from together import Together
from pydantic import BaseModel, Field
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)
together = Together()
CORS(app)

API_KEY = str(os.getenv("GOOGLE_API_KEY"))

# Define the schema for the medicine information
class MedicineInfo(BaseModel):
    name: str = Field(description="Medicine name (It should be the brand name, not the content of the medicine). Return 'Medicine not found' if the medicine cannot be identified.")
    description: str = Field(description="Explain the medicine's use, its contents, and why it is used in a detailed and easy-to-understand way. Should be atleast two paragraphs.")
    sideEffects: list[str] = Field(description="List of confirmed side effects. Include only significant side effects, exceed 3 only if necessary.")
    usage: str = Field(description="Concise instructions on how to use or take the medicine.")
    warnings: list[str] = Field(description="List of critical warnings or precautions. Only include essential information.")
    alternatives: list[str] = Field(description="List of brand names of alternative medicines, if any. Leave empty if no alternatives are found.")
    confidence: float = Field(description="Confidence score between 0 and 1 indicating reliability of the information.")

@app.route("/", methods=["GET"])
def hello_world():
    return {"status": "Connected"}

@app.route("/getinfo/<medicine>", methods=["GET"])
def get_medicine_info(medicine):
    try:
        response = together.chat.completions.create(
            messages=[
                {"role": "system", "content": "The following is the name of a medicine. Your job it to find detailed information about the given medicine. Only answer in JSON"},
                {"role": "user", "content": str(medicine)}
            ],
            model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
            response_format={
                "type": "json_object",
                "schema": MedicineInfo.model_json_schema()
            }
        )

        output = json.loads(response.choices[0].message.content)
        return jsonify(output)

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/getimages', methods=['GET'])
def get_images():
    try:
        medicine_name = request.args.get('medicine')

        if not medicine_name:
            return jsonify({'error': 'Medicine name is required'}), 400

        url = f'https://www.googleapis.com/customsearch/v1?q={medicine_name}&searchType=image&key={API_KEY}&cx=033acfa57b5fe449a&num=2'
        response = requests.get(url)
        
        data = response.json()

        if 'items' in data:
            image_urls = [item['link'] for item in data['items']]
            return jsonify({'images': image_urls}), 200
        else:
            return jsonify({'error': 'No images found'}), 404

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == "__main__":
    app.run()
