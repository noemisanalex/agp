#!/bin/bash

echo "🖥️ Iniciando frontend de AutogestiónPro..."
echo "=========================================="

PORT=3100
FRONTEND_DIR="$HOME/agp/frontend"

# 1. Verificar si el puerto está ocupado
if lsof -i tcp:$PORT | grep LISTEN; then
  PID=$(lsof -ti tcp:$PORT)
  echo "⚠️ El puerto $PORT está en uso por el proceso $PID. Terminando..."
  kill -9 $PID
  sleep 2
  echo "✅ Puerto liberado."
fi

# 2. Navegar al directorio del frontend
if [ -d "$FRONTEND_DIR" ]; then
  cd "$FRONTEND_DIR" || { echo "❌ No se pudo acceder a $FRONTEND_DIR"; exit 1; }
else
  echo "❌ Directorio $FRONTEND_DIR no encontrado."
  exit 1
fi

# 3. Iniciar servidor frontend
echo "🚀 Ejecutando: npm start"
npm start &

# 4. Verificar que el servidor responde después de unos segundos
sleep 5
if curl -s --fail http://localhost:$PORT > /dev/null; then
  echo "✅ Frontend disponible en http://localhost:$PORT"
else
  echo "❌ No se pudo verificar el estado del frontend en el puerto $PORT"
fi
