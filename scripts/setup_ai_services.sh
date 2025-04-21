#!/bin/bash
mkdir -p \
  ia-services \
  rasa \
  vaultwarden \
  grafana \
  mosquitto/config \
  mosquitto/data \
  mosquitto/log \
  nodered

# Archivos base IA Services
cat <<EOF > ia-services/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install flask transformers
CMD ["python", "main.py"]
EOF

cat <<EOF > ia-services/main.py
from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
summarizer = pipeline(\"summarization\")

@app.route(\"/summarize\", methods=[\"POST\"])
def summarize():
    text = request.json.get(\"text\", \"\")
    summary = summarizer(text, max_length=60, min_length=20, do_sample=False)
    return jsonify(summary)

if __name__ == \"__main__\":
    app.run(host=\"0.0.0.0\", port=9000)
EOF

cat <<EOF > ia-services/.env
FLASK_ENV=production
EOF

# Archivos base Rasa
cat <<EOF > rasa/credentials.yml
rest:
EOF

cat <<EOF > rasa/domain.yml
version: \"3.1\"
intents:
  - saludo
responses:
  utter_saludo:
    - text: \"¡Hola! ¿En qué puedo ayudarte?\"
EOF

cat <<EOF > rasa/config.yml
language: es
pipeline:
  - name: WhitespaceTokenizer
  - name: CountVectorsFeaturizer
  - name: DIETClassifier
  - name: EntitySynonymMapper
  - name: ResponseSelector
  - name: FallbackClassifier
EOF

cat <<EOF > rasa/actions.py
# Aquí puedes definir acciones personalizadas si las necesitas
def custom_action():
    pass
EOF

# Configuración base Mosquitto
cat <<EOF > mosquitto/config/mosquitto.conf
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
listener 1883
allow_anonymous true
EOF

echo \"✅ Estructura base creada con éxito.\"
