#!/bin/bash

cd "$(dirname "$0")" || exit 1

echo "🚀 Iniciando AutogestiónPro Stack..."

SERVICIOS=(
  postgres
  mysql
  backend
  ia-services
  n8n
  portainer
  vaultwarden
  mosquitto
  homeassistant
  code-server
  nodered
  phpmyadmin
)

for servicio in "${SERVICIOS[@]}"; do
  echo "🔄 Iniciando servicio: $servicio"
  (
    cd "$servicio" || exit
    docker compose --env-file ../.env.global up -d --build
  )
done

# InfluxDB + Telegraf (definidos en compose.influxdb.yml)
echo "🔄 Iniciando módulo de métricas: influxdb + telegraf"
docker compose -f docker-compose.influxdb.yml --env-file .env.global up -d --build

echo "✅ Todos los servicios están levantados correctamente."
