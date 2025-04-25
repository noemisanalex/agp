#!/bin/bash

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
NOW=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "[${NOW}] 🔁 ${YELLOW}Reiniciando servicios de AutogestiónPro...${NC}"
echo "-----------------------------------------------------"

# Lista de servicios
SERVICES=(
  "postgres" "mysql" "backend" "n8n" "portainer"
  "vaultwarden" "mosquitto" "homeassistant" "code-server"
  "phpmyadmin" "nodered" "proxy" "influxdb" "telegraf"
  "cloudflared" "uptime-kuma"
)

for service in "${SERVICES[@]}"; do
  echo -e "🔄 Reiniciando servicio: ${service}"
  docker restart "$service" >/dev/null 2>&1 && \
    echo -e "${GREEN}✅ ${service} reiniciado.${NC}" || \
    echo -e "${RED}❌ Error al reiniciar ${service}${NC}"
done

# Registro
mkdir -p ~/agp/logs
LOG_FILE="/home/alejandro/agp/logs/autogestionpro_restart.log"
echo "[${NOW}] Restart complete" >> "$LOG_FILE"

echo -e "🎉 ${GREEN}Todos los servicios fueron reiniciados correctamente.${NC}"
