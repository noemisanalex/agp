#!/bin/bash
set -e

source "$(dirname "$0")/../.env"
LOG="$LOG_FILE"

# Verifica si rclone está habilitado
if [ "$USE_RCLONE" != "true" ]; then
  echo "[$(date)] ❌ Rclone está deshabilitado en .env" | tee -a "$LOG"
  exit 1
fi

# Comprobar si hay backups nuevos para subir
echo "[$(date)] ⏫ Buscando backups para subir con rclone..." | tee -a "$LOG"

BACKUPS_DIRS=("full" "partial")

for DIR in "${BACKUPS_DIRS[@]}"; do
  FILES=$(find "$BACKUP_DIR/$DIR" -type f -name "*.tar.gz" -o -name "*.gpg")
  for FILE in $FILES; do
    DEST="$RCLONE_REMOTE:$RCLONE_PATH/$DIR/"
    echo "[$(date)] ⬆️ Subiendo $FILE a $DEST" | tee -a "$LOG"
    rclone copy "$FILE" "$DEST" --progress
  done
done

echo "[$(date)] ✅ Subida completada correctamente." | tee -a "$LOG"

# Notificación por correo si está activado
if [ "$SEND_EMAIL" = "true" ]; then
  echo "Backups subidos con éxito a $RCLONE_REMOTE" | mail -s "Subida de Backups OK" "$NOTIFY_EMAIL"
fi
