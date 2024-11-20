from flask import Flask, jsonify, request
import requests
from together import Together
from pydantic import BaseModel, Field
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

app = Flask(__name__)
together = Together()
CORS(app)

load_dotenv()
API_KEY = str(os.getenv("GOOGLE_API_KEY"))
CX_ID = str(os.getenv("GOOGLE_CX_ID"))
# print(f"{API_KEY=} {CX_ID=}")

# Define the schema for the medicine information
class MedicineInfo(BaseModel):
    name: str = Field(description="Medicine name (without contents). Use 'Medicine not found' if the medicine cannot be identified.")
    description: str = Field(description="Detailed explanation of the medicine's use, contents, and how it works in an easy-to-understand way.")
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
                {"role": "system", "content": "The following is a name of a medicine or its content Your job it to generate the medicine information. Only answer in JSON"},
                {"role": "user", "content": str(medicine)}
            ],
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
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
    print(f"{API_KEY=} {CX_ID=}")
    try:
        medicine_name = request.args.get('medicine')

        if not medicine_name:
            return jsonify({'error': 'Medicine name is required'}), 400

        url = f'https://www.googleapis.com/customsearch/v1?q={medicine_name}&searchType=image&key={API_KEY}&cx={CX_ID}&num=2'
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
