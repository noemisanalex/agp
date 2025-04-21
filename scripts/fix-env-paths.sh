#!/bin/bash

BASE="/home/alejandro/agp"
BACKUP_DIR="$BASE/scripts/env-backups"
mkdir -p "$BACKUP_DIR"

echo "🔍 Buscando archivos docker-compose.yml que usen '../.env.global'..."
FOUND=0

# Buscar todos los docker-compose.yml
find "$BASE" -type f -name "docker-compose.yml" | while read -r file; do
    if grep -q "\.\./\.env\.global" "$file"; then
        FOUND=1
        echo "🔧 Corrigiendo: $file"
        
        # Copia de seguridad
        cp "$file" "$BACKUP_DIR/$(basename "$(dirname "$file")")_docker-compose.yml.bak"
        
        # Reemplazo
        sed -i 's|\.\./\.env\.global|../../backend/.env|g' "$file"
        echo "✅ Reemplazado en: $file"
    fi
done

if [ $FOUND -eq 0 ]; then
    echo "✅ No se encontraron referencias a '../.env.global'. Todo está bien."
else
    echo "🗂️ Copias de seguridad guardadas en: $BACKUP_DIR"
fi
