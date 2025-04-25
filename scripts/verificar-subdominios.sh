#!/bin/bash

# Lista de subdominios a verificar
DOMINIOS=(
  "https://www.autogestionpro.com"
  "https://n8n.autogestionpro.com"
  "https://vaultwarden.autogestionpro.com"
  "https://portainer.autogestionpro.com"
  "https://code.autogestionpro.com"
  "https://proxy.autogestionpro.com"
  "https://uptime.autogestionpro.com"
  "https://home.autogestionpro.com"
  "https://metrics.autogestionpro.com"
  "https://node.autogestionpro.com"
)

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "\nVerificando subdominios de AutogestiónPro...\n"

for URL in "${DOMINIOS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  case $STATUS in
    200)
      echo -e "${GREEN}✔ $URL → $STATUS OK${NC}"
      ;;
    301|302)
      echo -e "${YELLOW}↪ $URL → $STATUS Redirección${NC}"
      ;;
    403|404)
      echo -e "${YELLOW}⚠ $URL → $STATUS No encontrado o acceso prohibido${NC}"
      ;;
    502|503)
      echo -e "${RED}✖ $URL → $STATUS Backend no responde (Cloudflare)${NC}"
      ;;
    *)
      echo -e "${RED}✖ $URL → $STATUS Error desconocido${NC}"
      ;;
  esac
done

echo -e "\n${GREEN}✅ Verificación completada.${NC}"
