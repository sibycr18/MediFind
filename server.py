from flask import Flask, jsonify, request
import requests
from meta_ai_api import MetaAI
from flask_cors import CORS
from dotenv import load_dotenv
import os


proxy = {
    "http": "188.166.229.121	:80",
    "https": "http://204.236.137.68	:80"
}

app = Flask(__name__)
ai = MetaAI(proxy=proxy)
CORS(app)


load_dotenv()
API_KEY = str(os.getenv("GOOGLE_API_KEY"))
CX_ID = str(os.getenv("GOOGLE_CX_ID"))

@app.route("/", methods=["GET"])
def hello_world():
    return {"status" : "Connected"}

@app.route("/getinfo/<medicine>", methods=["GET"])
def get_medicine_info(medicine):
    prompt = f"""
    You are a highly knowledgeable and precise assistant specializing in medicine analysis. Your task is to analyze a given medicine name and respond with accurate, concise, and user-friendly information formatted strictly as JSON. Follow these rules: 

    1. Respond only in the provided JSON structure. Do not include any text outside the JSON.
    2. Use placeholders only when necessary, replacing them with specific and reliable details whenever possible. If the medicine is not found, use "Medicine not found" in the `name` field.
    3. Ensure that all provided information is accurate, non-overwhelming, and easy to understand for general users. 
    4. Only include side effects, warnings, and alternatives that are well-established and important, avoiding speculation or exhaustive lists. 
    5. Assign a `confidence` score (0 to 1) based on the reliability of the response.

    ### JSON Format:
    {{
        "name": "Medicine name (without contents). Use 'Medicine not found' if the medicine cannot be identified.",
        "description": "Detailed explanation of the medicine's use, contents and how it works in easy to understand way.",
        "sideEffects": [
            "List of confirmed side effects. Include only significant side effects, exceed 3 only if necessary."
        ],
        "usage": "Concise instructions on how to use or take the medicine.",
        "warnings": [
            "List of critical warnings or precautions. Only include essential information."
        ],
        "alternatives": [
            "List of brand names of alternative medicines, if any. Provide generic names or equivalents that serve a similar purpose. Leave empty if no alternatives are found."
        ],
        "confidence": Confidence score between 0 and 1 indicating reliability of the information.
    }}

    ### Example Input:
    Medicine: {medicine}

    Respond strictly in this JSON format, replacing placeholders with accurate and relevant information. If the medicine is not found, ensure the `name` field contains "Medicine not found" and fill other fields with appropriate placeholders or leave them empty if necessary. Confidence should reflect the certainty of the response.
    """

    response = ai.prompt(message=prompt)
    return response["message"]

@app.route('/getimages', methods=['GET'])
def get_images():
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