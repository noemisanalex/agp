#!/bin/bash

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
NOW=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "🚀 ${YELLOW}Iniciando servicios de AutogestiónPro...${NC}"
echo "-----------------------------------------------------"

# Verificar red Docker
docker network inspect agp-net >/dev/null 2>&1 || docker network create agp-net
echo -e "🌐 ${GREEN}Red Docker 'agp-net' verificada.${NC}"

# Matar procesos en puertos críticos (excepto frontend ahora)
PUERTOS=(3000)
for puerto in "${PUERTOS[@]}"; do
  PID=$(lsof -ti :$puerto)
  if [ ! -z "$PID" ]; then
    echo -e "⚠️  Puerto $puerto ocupado. Matando proceso PID ${PID}..."
    kill -9 $PID
  fi
done

# Servicios Docker
SERVICES=(
  "postgres" "mysql" "backend" "n8n" "portainer"
  "vaultwarden" "mosquitto" "homeassistant" "code-server"
  "phpmyadmin" "nodered" "proxy" "influxdb" "telegraf"
  "cloudflared"
)

cd ~/agp

for service in "${SERVICES[@]}"; do
  echo -e "🔄 Iniciando servicio: ${service}"
  docker compose up -d "$service" && \
    echo -e "${GREEN}✅ ${service} iniciado.${NC}" || \
    echo -e "${RED}❌ Error al iniciar ${service}${NC}"
done

# Registro
mkdir -p ~/agp/logs
LOG_FILE="/home/alejandro/agp/logs/autogestionpro_startup.log"
echo "[${NOW}] Startup complete" >> "$LOG_FILE"

echo -e "🎉 ${GREEN}Todos los servicios están activos. Usa 'docker ps' para verificar.${NC}"
