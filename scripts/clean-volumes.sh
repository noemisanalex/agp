#!/bin/bash

echo "🧹 Borrando volúmenes de bases de datos de AutogestiónPro..."

BASE="/home/alejandro/agp/bases-de-datos"

# Listado de servicios
SERVICES=("postgres/data" "mysql/data" "n8n" "nodered" "homeassistant" "code-server")

for service in "${SERVICES[@]}"; do
    FOLDER="$BASE/$service"
    if [ -d "$FOLDER" ]; then
        echo "🗑️  Eliminando contenido de $FOLDER..."
        rm -rf "$FOLDER"/*
    else
        echo "⚠️  Carpeta $FOLDER no encontrada, se omitirá."
    fi
done

echo "✅ Volúmenes limpiados. Puedes volver a iniciar los servicios con:"
echo "docker-compose --env-file .env -f docker-compose-servicios-completo.yml up -d --build"