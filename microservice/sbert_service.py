# microservice/sbert_service.py
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

@app.route('/api/similarity', methods=['POST'])
def check_similarity():
    data = request.get_json()
    sent1 = data.get('sentence1')
    sent2 = data.get('sentence2')

    if not sent1 or not sent2:
        return jsonify({"error": "Both sentences are required"}), 400

    embeddings = model.encode([sent1, sent2], convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()

    return jsonify({"similarity": similarity})

if __name__ == '__main__':
    app.run(port=8000)
