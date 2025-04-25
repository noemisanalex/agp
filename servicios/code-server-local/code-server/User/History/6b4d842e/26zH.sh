#!/bin/bash

# === Colores e iconos ===
RED='\033[0;31m'     # 🔴
GREEN='\033[0;32m'   # 🟢
YELLOW='\033[0;33m'  # 🟡
BLUE='\033[0;34m'
NC='\033[0m'         # Reset

COMPOSE_PATH="$HOME/agp"
COMPOSE_FILE="$COMPOSE_PATH/docker-compose.yml"

# === Verifica docker-compose ===
check_compose_file() {
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ No se encontró docker-compose.yml en $COMPOSE_PATH${NC}"
    exit 1
  fi
}

# === Estado de servicios ===
list_services_status() {
  echo -e "${BLUE}📦 Estado de los contenedores AutogestiónPro:${NC}"
  docker compose -f "$COMPOSE_FILE" ps --format '{{.Name}} {{.State}}' | while read -r name state; do
    case "$state" in
      running) echo -e "  - ${GREEN}🟢 $name${NC}" ;;
      exited) echo -e "  - ${RED}🔴 $name${NC}" ;;
      *) echo -e "  - ${YELLOW}🟡 $name ($state)${NC}" ;;
    esac
  done
}

# === Iniciar servicios ===
start_services() {
  echo -e "${BLUE}🔼 Iniciando servicios...${NC}"
  docker compose -f "$COMPOSE_FILE" up -d
}

# === Detener servicios ===
stop_services() {
  echo -e "${BLUE}🔽 Deteniendo servicios...${NC}"
  docker compose -f "$COMPOSE_FILE" down
}

# === Reiniciar servicios ===
restart_services() {
  echo -e "${YELLOW}🔁 Reiniciando servicios...${NC}"
  docker compose -f "$COMPOSE_FILE" down
  docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
}

# === Ver logs ===
view_logs() {
  echo -e "${BLUE}📝 Logs de todos los servicios:${NC}"
  docker compose -f "$COMPOSE_FILE" logs -f --tail=100
}

# === Verificar subdominios ===
verify_subdomains() {
  echo -e "\n${BLUE}🌐 Verificando subdominios de AutogestiónPro...${NC}\n"
  DOMINIOS=(
    "https://www.autogestionpro.com"
    "https://n8n.autogestionpro.com"
    "https://vault.autogestionpro.com"
    "https://portainer.autogestionpro.com"
    "https://code.autogestionpro.com"
    "https://proxy.autogestionpro.com"
    "https://uptime.autogestionpro.com"
    "https://home.autogestionpro.com"
    "https://metrics.autogestionpro.com"
    "https://node.autogestionpro.com"
  )

  for URL in "${DOMINIOS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    case $STATUS in
      200)
        echo -e "${GREEN}✔ $URL → $STATUS OK${NC}" ;;
      301|302)
        echo -e "${YELLOW}↪ $URL → $STATUS Redirección${NC}" ;;
      403|404)
        echo -e "${YELLOW}⚠ $URL → $STATUS No encontrado o acceso prohibido${NC}" ;;
      502|503)
        echo -e "${RED}✖ $URL → $STATUS Backend no responde (Cloudflare)${NC}" ;;
      *)
        echo -e "${RED}✖ $URL → $STATUS Error desconocido${NC}" ;;
    esac
  done

  echo -e "\n${GREEN}✅ Verificación completada.${NC}"
}

# === Menú principal ===
main_menu() {
  check_compose_file
  while true; do
    echo -e "\n${BLUE}==== GESTOR GENERAL AUTOGESTIÓNPRO ====${NC}"
    echo "1. Estado de los servicios"
    echo "2. Iniciar servicios"
    echo "3. Detener servicios"
    echo "4. Reiniciar servicios"
    echo "5. Ver logs"
    echo "6. Verificar subdominios"
    echo "7. Salir"
    read -p "Selecciona una opción: " op

    case "$op" in
      1) list_services_status ;;
      2) start_services ;;
      3) stop_services ;;
      4) restart_services ;;
      5) view_logs ;;
      6) verify_subdomains ;;
      7) echo -e "${YELLOW}👋 Saliendo...${NC}"; exit 0 ;;
      *) echo -e "${RED}❌ Opción no válida.${NC}" ;;
    esac
  done
}

main_menu
