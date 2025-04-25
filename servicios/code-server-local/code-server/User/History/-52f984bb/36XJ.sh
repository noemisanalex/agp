#!/bin/bash

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
NOW=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "[${NOW}] 🚫 ${YELLOW}Deteniendo AutogestiónPro...${NC}"
echo "-------------------------------------------"

# Ya no detenemos frontend ni matamos puerto 3100

# Servicios Docker
SERVICES=(
  "cloudflared" "proxy" "phpmyadmin" "nodered" "mosquitto"
  "code-server" "vaultwarden" "portainer" "homeassistant"
  "n8n" "backend" "mysql" "postgres" "influxdb" "telegraf"
  "uptime-kuma"
)


for service in "${SERVICES[@]}"; do
  echo -e "🛑 Deteniendo ${service}..."
  docker stop "$service" >/dev/null 2>&1 && \
    echo -e "${GREEN}✅ ${service} detenido.${NC}" || \
    echo -e "${YELLOW}⚠️ ${service} no estaba corriendo.${NC}"
done

# Registro
mkdir -p ~/agp/logs
LOG_FILE="/home/alejandro/agp/logs/autogestionpro_shutdown.log"
echo "[${NOW}] Shutdown complete" >> "$LOG_FILE"

echo -e "🧯 ${GREEN}Todos los servicios fueron apagados correctamente.${NC}"
