#!/bin/bash

echo "📁 Creando estructura de carpetas para AutogestiónPro..."

BASE="/home/alejandro/agp"

mkdir -p $BASE/bases-de-datos/{postgres/data,mysql/data,n8n,nodered,homeassistant,code-server}
mkdir -p $BASE/ia-services
mkdir -p $BASE/backend
mkdir -p $BASE/nginx-proxy-manager/{data,letsencrypt}
mkdir -p $BASE/cloudflared
mkdir -p $BASE/vaultwarden

echo "✅ Estructura creada:"
tree -L 3 $BASE | tee $BASE/scripts/estructura.log

echo "📦 Listo para iniciar servicios con:"
echo "docker-compose --env-file .env -f docker-compose-servicios-completo.yml up -d --build"