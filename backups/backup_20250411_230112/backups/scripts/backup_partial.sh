#!/bin/bash
set -e

# Cargar variables
source "$(dirname "$0")/../.env"

# Definir nuevo directorio de backup en el USB
USB_BACKUP_DIR="/media/alejandro/drive/agp_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT="$USB_BACKUP_DIR/partial/partial_backup_$TIMESTAMP.tar.gz"
LOG="$LOG_FILE"

# Crear directorios si no existen
mkdir -p "$USB_BACKUP_DIR/partial"

echo "[$(date)] ⏳ Iniciando backup parcial..." | tee -a "$LOG"
cd "$AGP_ROOT"

# Crear archivo temporal de backup
tar -czpf "$OUTPUT" $PARTIAL_DIRS

# Cifrar si se indica
if [ "$USE_GPG" = "true" ]; then
  gpg --output "$OUTPUT.gpg" --encrypt --recipient "$GPG_RECIPIENT" "$OUTPUT"
  rm "$OUTPUT"
  OUTPUT="$OUTPUT.gpg"
  echo "[$(date)] 🔐 Backup parcial cifrado con GPG." | tee -a "$LOG"
fi

echo "[$(date)] ✅ Backup parcial guardado en $OUTPUT" | tee -a "$LOG"

# Notificar por correo
if [ "$SEND_EMAIL" = "true" ]; then
  echo "Backup parcial exitoso: $OUTPUT" | mail -s "Backup PARCIAL OK" "$NOTIFY_EMAIL"
fi

# Mantenimiento: eliminar backups antiguos si hay más de MAX_PARTIAL_BACKUPS
if [ -n "$MAX_PARTIAL_BACKUPS" ] && [ "$MAX_PARTIAL_BACKUPS" -gt 0 ]; then
  cd "$USB_BACKUP_DIR/partial"
  NUM_BACKUPS=$(ls -1 | wc -l)
  if [ "$NUM_BACKUPS" -gt "$MAX_PARTIAL_BACKUPS" ]; then
    NUM_TO_DELETE=$((NUM_BACKUPS - MAX_PARTIAL_BACKUPS))
    FILES_TO_DELETE=$(ls -1t | tail -n "$NUM_TO_DELETE")
    echo "[$(date)] 🧹 Eliminando $NUM_TO_DELETE backups parciales antiguos..." | tee -a "$LOG"
    echo "$FILES_TO_DELETE" | xargs rm -f
  fi
fi

echo "[$(date)] 🏁 Proceso de backup parcial completado." | tee -a "$LOG"
