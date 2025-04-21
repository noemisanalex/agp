#!/bin/bash
set -e

# Cargar variables de entorno
source "$(dirname "$0")/../.env"

# Definir nuevo directorio de backup en el USB
USB_BACKUP_DIR="/media/alejandro/drive/agp_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT="$USB_BACKUP_DIR/full/full_backup_$TIMESTAMP.tar.gz"
LOG="$LOG_FILE"

# Crear directorios si no existen
mkdir -p "$USB_BACKUP_DIR/full"

echo "[$(date)] ⏳ Iniciando backup completo..." | tee -a "$LOG"

# Crear backup completo
tar --exclude="$BACKUP_DIR" \
    --exclude="$USB_BACKUP_DIR" \
    --exclude="$AGP_ROOT/node_modules" \
    --exclude="$AGP_ROOT/frontend/node_modules" \
    -czpf "$OUTPUT" -C "$AGP_ROOT" .

# Cifrado con GPG si está activado
if [ "$USE_GPG" = "true" ]; then
  gpg --output "$OUTPUT.gpg" --encrypt --recipient "$GPG_RECIPIENT" "$OUTPUT"
  rm "$OUTPUT"
  OUTPUT="$OUTPUT.gpg"
  echo "[$(date)] 🔐 Backup cifrado con GPG." | tee -a "$LOG"
fi

echo "[$(date)] ✅ Backup completo guardado en $OUTPUT" | tee -a "$LOG"

# Notificación por correo si está habilitado
if [ "$SEND_EMAIL" = "true" ]; then
  echo "Backup completo exitoso: $OUTPUT" | mail -s "Backup COMPLETO OK" "$NOTIFY_EMAIL"
fi

# Mantenimiento: eliminar backups antiguos si hay más de MAX_FULL_BACKUPS
if [ -n "$MAX_FULL_BACKUPS" ] && [ "$MAX_FULL_BACKUPS" -gt 0 ]; then
  cd "$USB_BACKUP_DIR/full"
  NUM_BACKUPS=$(ls -1 | wc -l)
  if [ "$NUM_BACKUPS" -gt "$MAX_FULL_BACKUPS" ]; then
    NUM_TO_DELETE=$((NUM_BACKUPS - MAX_FULL_BACKUPS))
    FILES_TO_DELETE=$(ls -1t | tail -n "$NUM_TO_DELETE")
    echo "[$(date)] 🧹 Eliminando $NUM_TO_DELETE backups completos antiguos..." | tee -a "$LOG"
    echo "$FILES_TO_DELETE" | xargs rm -f
  fi
fi

echo "[$(date)] 🏁 Proceso de backup completo finalizado." | tee -a "$LOG"
