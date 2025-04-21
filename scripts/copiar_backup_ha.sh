#!/bin/bash

# Directorio donde HA guarda los backups (dentro de su volumen mapeado)
SOURCE_DIR="/home/alejandro/agp/servicios/homeassistant/backups"
# Directorio en el host donde quieres copiar los backups
DEST_DIR="/home/alejandro/agp/backups_ha" # Cambia si prefieres otra ruta

# Asegurarse de que el directorio de destino existe
mkdir -p "$DEST_DIR"

echo "--- Iniciando copia de backup HA $(date) ---"

# Encontrar el último backup creado (archivo .tar)
LATEST_BACKUP=$(ls -t "$SOURCE_DIR"/*.tar 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "ERROR: No se encontró ningún archivo .tar en $SOURCE_DIR"
  exit 1
fi

BACKUP_FILENAME=$(basename "$LATEST_BACKUP")

# Comprobar si ya existe en el destino
if [ -f "$DEST_DIR/$BACKUP_FILENAME" ]; then
  echo "INFO: El último backup ($BACKUP_FILENAME) ya existe en $DEST_DIR. No se copia."
  exit 0
fi

# Copiar el último backup
echo "INFO: Copiando $LATEST_BACKUP a $DEST_DIR/"
cp "$LATEST_BACKUP" "$DEST_DIR/"

if [ $? -eq 0 ]; then
  echo "INFO: Copia completada con éxito."
else
  echo "ERROR: Falló la copia del backup."
  exit 1
fi

# Opcional: Limpiar backups antiguos en el destino (ej: mantener los últimos 7)
echo "INFO: Limpiando backups antiguos en $DEST_DIR (manteniendo los últimos 7)"
ls -t "$DEST_DIR"/*.tar | tail -n +8 | xargs -r rm --
echo "--- Fin copia de backup HA ---"

exit 0
