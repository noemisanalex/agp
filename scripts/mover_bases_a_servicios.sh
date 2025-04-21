#!/bin/bash

BASE="$HOME/agp"
ORIGEN="$BASE/bases-de-datos"
DESTINO="$BASE/servicios"

echo "🚀 Moviendo todo el contenido de bases-de-datos a servicios..."

if [ ! -d "$ORIGEN" ]; then
  echo "✅ La carpeta bases-de-datos ya no existe. Nada que mover."
  exit 0
fi

mkdir -p "$DESTINO"

for item in "$ORIGEN"/*; do
  nombre=$(basename "$item")
  destino_final="$DESTINO/$nombre"
  
  if [ -e "$destino_final" ]; then
    echo "⚠️  $nombre ya existe en servicios/. No se moverá."
  else
    mv "$item" "$destino_final"
    echo "✅ $nombre movido a servicios/"
  fi
done

echo "🧹 Eliminando carpeta vacía bases-de-datos..."
rmdir "$ORIGEN" 2>/dev/null && echo "✅ Carpeta bases-de-datos eliminada."

echo "🎉 Organización finalizada: todo está en ~/agp/servicios/"
