#!/bin/bash

LOGFILE="/home/alejandro/agp/logs/clean-obsolete.log"
ERROR=0

mkdir -p /home/alejandro/agp/logs
rm -f "$LOGFILE" 2>/dev/null

log() {
  echo "$1" | tee -a "$LOGFILE"
}

log "🧹 Iniciando limpieza de archivos obsoletos..."
log "---------------------------------------------"

# Lista de carpetas con docker-compose.yml antiguos
SERVICES=("cloudflared" "code-server" "homeassistant" "ia-services" "influxdb" "mosquitto" "mysql" "n8n" "nginx-proxy-manager" "nodered" "phpmyadmin" "portainer" "telegraf" "vaultwarden")

for service in "${SERVICES[@]}"; do
  path="/home/alejandro/agp/$service/docker-compose.yml"
  if [ -f "$path" ]; then
    log "🗑️ Eliminando $path"
    rm -f "$path"
  fi
done

# Carpetas específicas a eliminar si están vacías o duplicadas
REMOVE_DIRS=(
  "/home/alejandro/agp/code-server/data"
  "/home/alejandro/agp/postgres"
  "/home/alejandro/agp/backend/env"
  "/home/alejandro/agp/*/docker"
)

for dir in "${REMOVE_DIRS[@]}"; do
  for sub in $(find $dir -type d 2>/dev/null); do
    if [ -d "$sub" ] && [ -z "$(ls -A "$sub")" ]; then
      log "🧺 Eliminando carpeta vacía $sub"
      rm -rf "$sub"
    fi
  done
done

log "✅ Limpieza completada. Log guardado en $LOGFILE"
exit 0