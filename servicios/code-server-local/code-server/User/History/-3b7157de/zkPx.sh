#!/bin/bash

# 🎨 Colores
RED='\033[1;31m'; GREEN='\033[1;32m'; YELLOW='\033[1;33m'; CYAN='\033[1;36m'; NC='\033[0m'

# 🧱 Contenedores clave
containers=(
  "backend" "frontend" "n8n" "portainer" "vaultwarden"
  "mysql" "postgres" "code-server" "nodered" "mosquitto"
  "telegraf" "influxdb" "uptime-kuma" "homeassistant"
  "proxy" "cloudflared"
)

# ✅ Encabezado visual
header() {
  echo -e "\n${CYAN}============================================================"
  echo -e "${YELLOW}📦 Mostrando logs de: ${GREEN}$1${NC}"
  echo -e "${CYAN}============================================================${NC}"
}

# 🧠 Análisis de salud sin lookahead
health() {
  local logs=$(docker logs --tail 200 "$1" 2>/dev/null | tr '[:upper:]' '[:lower:]')

  if [[ "$1" == "influxdb" || "$1" == "telegraf" ]]; then
    echo -e "${GREEN}🟢 ok${NC}"
    return
  fi

  if echo "$logs" | grep -Eiq "panic|fatal|unrecoverable|crash"; then
    echo -e "${RED}🔴 grave${NC}"
  elif echo "$logs" | grep -Eiq "error|failed|exit code|connection refused"; then
    echo -e "${RED}🔴 error${NC}"
  elif echo "$logs" | grep -Eiq "warn|deprecated|timeout|reconnect|slow"; then
    echo -e "${YELLOW}🟡 advertencia${NC}"
  else
    echo -e "${GREEN}🟢 ok${NC}"
  fi
}

# 🚦 Estado actual del contenedor
status() {
  docker inspect -f '{{.State.Status}}' "$1" 2>/dev/null
}

# 📋 Menú interactivo
menu() {
  echo -e "${CYAN}=== AutogestiónPro - Visor de Logs Docker ===${NC}"
  echo -e "${YELLOW}Seleccione un contenedor:${NC}"

  for i in "${!containers[@]}"; do
    name="${containers[$i]}"
    if docker ps -a --format '{{.Names}}' | grep -qw "$name"; then
      state=$(status "$name")
      case $state in
        running) st="${GREEN}🟢 running" ;;
        restarting) st="${YELLOW}🟡 restarting" ;;
        exited) st="${RED}🔴 exited" ;;
        *) st="${CYAN}❓ $state" ;;
      esac
      h=$(health "$name")
    else
      st="${RED}⛔ missing"
      h="${RED}⛔"
    fi
    printf "%s %2d. %-15s [%b] [%b]\n" "$CYAN" $((i+1)) "$name" "$st" "$h"
  done

  echo -e "${CYAN} v.${NC} Verificar subdominios (Cloudflare)"
  echo -e "${CYAN} 0.${NC} Salir"
  echo -e "${CYAN} a.${NC} Ver todos los logs (últimas 10 líneas)"
  echo -e "${CYAN} [n].${NC} Ver logs del contenedor número n (ej. 1, 2, 5...)"
  echo -e "${CYAN} r.${NC} Seguir logs en vivo (tail -f)"
  echo -e "${CYAN} e.${NC} Exportar logs (últimos 100 por servicio)"
}

# 🔍 Mostrar logs de un contenedor
ver_logs() {
  header "$1"
  docker logs --tail 50 "$1" 2>/dev/null || echo -e "${RED}❌ No se puede mostrar logs${NC}"
}

# 📡 Logs en vivo
logs_en_vivo() {
  header "$1"
  echo -e "${YELLOW}⏳ Ctrl+C para salir...${NC}"
  docker logs -f --tail 20 "$1"
}

# 🧾 Todos los logs cortos
todos_logs() {
  for c in "${containers[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -qw "$c"; then
      header "$c"
      docker logs --tail 10 "$c"
    fi
  done
}

# 📁 Exportar logs a archivo
exportar_logs() {
  out="logs_export_$(date +%Y%m%d_%H%M%S).txt"
  for c in "${containers[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -qw "$c"; then
      echo "=== LOGS $c ===" >> "$out"
      docker logs --tail 100 "$c" >> "$out" 2>&1
      echo -e "\n" >> "$out"
    fi
  done
  echo -e "${GREEN}✅ Logs exportados a ${CYAN}${out}${NC}"
}

# 🚀 Loop principal
while true; do
  clear
  menu
  echo -ne "${YELLOW}Opción: ${NC}"
  read -r option

  case "$option" in
    0) echo -e "${GREEN}👋 ¡Hasta la próxima!${NC}"; exit 0 ;;
    a) todos_logs; read -rp "${YELLOW}Enter para continuar...${NC}" ;;
    r)
      echo -ne "${CYAN}Número para seguir logs: ${NC}"
      read -r idx
      if [[ "$idx" =~ ^[0-9]+$ ]] && ((idx >= 1 && idx <= ${#containers[@]})); then
        logs_en_vivo "${containers[$((idx-1))]}"
        read -rp "${YELLOW}Enter para continuar...${NC}"
      else
        echo -e "${RED}❌ Opción inválida${NC}"; sleep 2
      fi
      ;;
    e) exportar_logs; read -rp "${YELLOW}Enter para continuar...${NC}" ;;
    v) ./verificar-subdominios.sh; read -rp "${YELLOW}Enter para continuar...${NC}" ;;
    [1-9]*|1[0-9])
      if ((option >= 1 && option <= ${#containers[@]})); then
        ver_logs "${containers[$((option-1))]}"
        read -rp "${YELLOW}Enter para continuar...${NC}"
      else
        echo -e "${RED}❌ Número fuera de rango${NC}"; sleep 2
      fi
      ;;
    *)
      echo -e "${RED}❌ Opción inválida${NC}"; sleep 2
      ;;
  esac
done
