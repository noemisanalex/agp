#!/bin/bash

# 🎨 Colores
RED='\033[1;31m'
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
NC='\033[0m'

# 🗂️ Lista de contenedores
containers=(
  "backend"
  "cloudflared"
  "homeassistant"
  "n8n"
  "proxy"
  "code-server"
  "vaultwarden"
  "mysql"
  "nodered"
  "postgres"
  "phpmyadmin"
  "mosquitto"
  "influxdb"
  "telegraf"
  "portainer"
)

# ✅ Muestra el encabezado del log
show_header() {
  echo -e "\n${CYAN}============================================================"
  echo -e "${YELLOW}📦 Mostrando logs de: ${GREEN}$1${NC}"
  echo -e "${CYAN}============================================================${NC}"
}

# 💡 Evalúa salud básica del log
get_health_status() {
  local logs=$(docker logs --tail 100 "$1" 2>/dev/null | tr '[:upper:]' '[:lower:]')

  if echo "$logs" | grep -qE "error|fatal|panic"; then
    echo -e "${RED}🔴"
  elif echo "$logs" | grep -qE "warn|deprecated|fail"; then
    echo -e "${YELLOW}🟡"
  else
    echo -e "${GREEN}🟢"
  fi
}

# 📋 Muestra menú principal
show_menu() {
  echo -e "${CYAN}=== AutogestiónPro - Menú de Logs ===${NC}"
  echo -e "${YELLOW}Seleccione un contenedor para ver sus logs:${NC}"

  for i in "${!containers[@]}"; do
    name="${containers[$i]}"
    if docker ps -a --format '{{.Names}}' | grep -qw "$name"; then
      status=$(docker ps --format '{{.Names}}' | grep -qw "$name" && echo -e "${GREEN}🟢" || echo -e "${RED}🔴")
      health=$(get_health_status "$name")
    else
      status="${RED}⛔"
      health="${RED}⛔"
    fi
    echo -e "${CYAN}$((i+1)).${NC} ${name} $status $health"
  done

  echo -e "${CYAN}0.${NC} Salir"
  echo -e "${CYAN}a.${NC} Ver todos los logs (últimas 10 líneas)"
  echo -e "${CYAN}r.${NC} Ver logs en tiempo real (seguimiento)"
  echo
}

# 🔍 Muestra logs de un contenedor
show_logs() {
  show_header "$1"
  docker logs --tail 50 "$1" 2>/dev/null || echo -e "${RED}❌ Contenedor no encontrado${NC}"
}

# 📡 Sigue logs en vivo
follow_logs() {
  show_header "$1"
  echo -e "${YELLOW}⏳ Mostrando logs en tiempo real (Ctrl+C para salir)...${NC}"
  docker logs -f --tail 20 "$1"
}

# 🧾 Muestra últimos logs de todos
show_all_logs() {
  for c in "${containers[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -qw "$c"; then
      show_header "$c"
      docker logs --tail 10 "$c"
      echo
    fi
  done
}

# 🚀 Interfaz
while true; do
  clear
  show_menu
  echo -ne "${YELLOW}Ingrese opción: ${NC}"
  read -r option

  case "$option" in
    0)
      echo -e "${GREEN}👋 Saliendo del visor de logs. Hasta pronto.${NC}"
      exit 0
      ;;
    a)
      show_all_logs
      read -rp "${YELLOW}Presione Enter para continuar...${NC}" ;;
    r)
      echo -ne "${CYAN}Número del contenedor para seguir logs: ${NC}"
      read -r idx
      if [[ "$idx" =~ ^[0-9]+$ ]] && ((idx >= 1 && idx <= ${#containers[@]})); then
        follow_logs "${containers[$((idx-1))]}"
        read -rp "${YELLOW}Presione Enter para continuar...${NC}"
      else
        echo -e "${RED}❌ Opción inválida${NC}"
        sleep 2
      fi
      ;;
    *)
      if [[ "$option" =~ ^[0-9]+$ ]] && ((option >= 1 && option <= ${#containers[@]})); then
        show_logs "${containers[$((option-1))]}"
        read -rp "${YELLOW}Presione Enter para continuar...${NC}"
      else
        echo -e "${RED}❌ Opción inválida${NC}"
        sleep 2
      fi
      ;;
  esac
done
