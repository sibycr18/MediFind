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

# Allow only 'https://medi-find.vercel.app/' to access your Flask app
# CORS(app, resources={r"/*": {"origins": "https://medi-find.vercel.app/"}})
# Allow all origins to access the app temporarily (including localhost)
# CORS(app, resources={r"/*": {"origins": "*"}})

# Allow localhost:5173 to access the server
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


API_KEY = str(os.getenv("GOOGLE_API_KEY"))

# Define the schema for the medicine information
class MedicineInfo(BaseModel):
    name: str = Field(description="Name of the medicine")
    useAndWorking: str = Field(description="Medicine's use and working")
    sideEffects: list[str] = Field(description="List of confirmed side effects.")
    howToUse: str = Field(description="Instructions on how to use or take the medicine.")
    warnings: list[str] = Field(description="List of possible warnings")
    alternatives: list[str] = Field(description="List of brand names of alternative medicines, if any.")
    confidence: float = Field(description="Value between 0 and 1 depending on the confidence of the result")

@app.route("/", methods=["GET"])
def hello_world():
    return {"status": "Connected"}

@app.route("/getinfo/<medicine>", methods=["GET"])
def get_medicine_info(medicine):
    try:
        response = together.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a highly knowledgeable and precise assistant specializing in medicine analysis. Your task is to analyze a given medicine name and respond with detailed, accurate and user-friendly information formatted strictly as JSON."},
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
