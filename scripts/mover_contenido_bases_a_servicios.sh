#!/bin/bash

ORIGEN="$HOME/agp/bases-de-datos"
DESTINO="$HOME/agp/servicios"

echo "🚀 Iniciando migración de contenido..."

for carpeta in "$ORIGEN"/*; do
  nombre=$(basename "$carpeta")
  destino_final="$DESTINO/$nombre"

  if [ -d "$carpeta" ]; then
    echo "📦 Procesando $nombre..."

    mkdir -p "$destino_final"

    # Mover contenido interno al destino
    find "$carpeta" -mindepth 1 -exec mv -t "$destino_final" {} + 2>/dev/null

    # Si queda vacía, la eliminamos
    rmdir "$carpeta" 2>/dev/null && echo "🧹 Carpeta $nombre vacía eliminada."
  fi
done

# Eliminar carpeta bases-de-datos si está completamente vacía
rmdir "$ORIGEN" 2>/dev/null && echo "✅ Carpeta bases-de-datos eliminada."

echo "🎉 Migración completada. Todo está en ~/agp/servicios/"
