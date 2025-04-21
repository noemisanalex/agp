#!/bin/bash

LOGFILE="/home/alejandro/agp/logs/autogestionpro_restart.log"
ERROR=0

mkdir -p /home/alejandro/agp/logs
rm -f "$LOGFILE" 2>/dev/null

log() {
  echo "$1" | tee -a "$LOGFILE"
}

log ""
log "🔁 Reiniciando todos los servicios de AutogestiónPro..."
log "--------------------------------------------"

# Detener todos los servicios
/home/alejandro/agp/scripts/stop-all.sh

# IMPORTANTE: Los volúmenes no se eliminan aquí para mantener persistencia
# Puedes limpiar manualmente con ./clean-volumes.sh si lo deseas

# Esperar un poco para liberar recursos
sleep 5

# Iniciar servicios nuevamente
/home/alejandro/agp/scripts/start-all.sh

if [ $? -eq 0 ]; then
    log "✅ Reinicio completado correctamente."
else
    log "⚠️ Algunos servicios podrían haber fallado al reiniciar. Revisa el log."
    ERROR=1
fi

exit $ERROR