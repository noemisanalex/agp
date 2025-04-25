#!/bin/bash
echo "🛑 Deteniendo servicios..."
docker compose down

echo "⬇️ Descargando últimas imágenes..."
docker compose pull

echo "🚀 Iniciando servicios actualizados..."
docker compose up -d

echo "✅ Todo listo. Usa 'docker ps' para verificar."
