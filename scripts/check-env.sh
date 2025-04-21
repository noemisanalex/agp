#!/bin/bash

ENV_FILE="/home/alejandro/agp/backend/.env"
REQUIRED_VARS=(
  "OPENAI_API_KEY"
  "DEEPSEEK_API_KEY"
  "HUGGINGFACE_TOKEN"
  "N8N_BASIC_AUTH_USER"
  "N8N_BASIC_AUTH_PASSWORD"
  "INFLUXDB_TOKEN"
)

echo "🔍 Verificando variables obligatorias en $ENV_FILE"
echo "----------------------------------------------"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ El archivo .env no existe en: $ENV_FILE"
  exit 1
fi

MISSING=0

for var in "${REQUIRED_VARS[@]}"; do
  if ! grep -q "^$var=" "$ENV_FILE"; then
    echo "⚠️ Falta la variable: $var"
    MISSING=1
  fi
done

if [ $MISSING -eq 0 ]; then
  echo "✅ Todas las variables obligatorias están presentes."
else
  echo "⚠️ Corrige las variables faltantes antes de iniciar los servicios."
fi
