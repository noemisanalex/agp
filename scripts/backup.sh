#!/bin/bash
# Script de respaldo para AutogestiónPro
# Uso: backup.sh [full|partial]

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/alejandro/agp/backups"
LOG_DIR="/home/alejandro/agp/logs"
BACKUP_LOG="${LOG_DIR}/backup_${TIMESTAMP}.log"

# Crear directorios si no existen
mkdir -p "${BACKUP_DIR}/full"
mkdir -p "${BACKUP_DIR}/partial"
mkdir -p "${LOG_DIR}"

# Función para registrar mensajes
log_message() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "${BACKUP_LOG}"
}

# Respaldo de las bases de datos
backup_databases() {
    log_message "Iniciando respaldo de bases de datos..."
    
    # Crear directorio temporal para las bases de datos
    DB_BACKUP_DIR="${BACKUP_DIR}/temp_db"
    mkdir -p "${DB_BACKUP_DIR}"
    
    # Respaldar PostgreSQL
    log_message "Respaldando PostgreSQL..."
    docker exec agp-postgres pg_dump -U agp_user -d agp_database > "${DB_BACKUP_DIR}/postgres_${TIMESTAMP}.sql"
    
    # Respaldar MySQL
    log_message "Respaldando MySQL..."
    docker exec agp-mysql mysqldump -u agp_user -pagp_password agp_database > "${DB_BACKUP_DIR}/mysql_${TIMESTAMP}.sql"
    
    log_message "Respaldo de bases de datos completado."
    return "${DB_BACKUP_DIR}"
}

# Respaldo completo
do_full_backup() {
    log_message "Iniciando respaldo completo..."
    
    # Detener los contenedores para evitar inconsistencias
    log_message "Deteniendo contenedores..."
    cd ~/agp && docker-compose stop
    
    # Respaldar bases de datos
    backup_databases
    DB_BACKUP_DIR=$?
    
    # Respaldar todo el proyecto
    log_message "Respaldando archivos del proyecto..."
    BACKUP_FILE="${BACKUP_DIR}/full/agp_full_${TIMESTAMP}.tar.gz"
    tar -czf "${BACKUP_FILE}" -C /home/alejandro agp
    
    # Reiniciar los contenedores
    log_message "Reiniciando contenedores..."
    cd ~/agp && docker-compose start
    
    # Limpiar directorio temporal
    rm -rf "${DB_BACKUP_DIR}"
    
    # Eliminar respaldos completos antiguos (mantener los últimos 4)
    log_message "Limpiando respaldos completos antiguos..."
    ls -t "${BACKUP_DIR}/full/"*.tar.gz | tail -n +5 | xargs -r rm
    
    log_message "Respaldo completo finalizado: ${BACKUP_FILE}"
}

# Respaldo parcial (solo bases de datos y configuraciones)
do_partial_backup() {
    log_message "Iniciando respaldo parcial..."
    
    # Respaldar bases de datos
    backup_databases
    DB_BACKUP_DIR=$?
    
    # Respaldar archivos de configuración
    log_message "Respaldando archivos de configuración..."
    BACKUP_FILE="${BACKUP_DIR}/partial/agp_partial_${TIMESTAMP}.tar.gz"
    tar -czf "${BACKUP_FILE}" \
        -C /home/alejandro agp/docker-compose.yml \
        -C /home/alejandro agp/backend/.env \
        -C /home/alejandro agp/n8n/docker \
        -C /home/alejandro agp/homeassistant/config
    
    # Añadir los respaldos de bases de datos al archivo
    tar -rf "${BACKUP_FILE}" -C "${DB_BACKUP_DIR}" .
    
    # Limpiar directorio temporal
    rm -rf "${DB_BACKUP_DIR}"
    
    # Eliminar respaldos parciales antiguos (mantener los últimos 7)
    log_message "Limpiando respaldos parciales antiguos..."
    ls -t "${BACKUP_DIR}/partial/"*.tar.gz | tail -n +8 | xargs -r rm
    
    log_message "Respaldo parcial finalizado: ${BACKUP_FILE}"
}

# Script principal
case "$1" in
    full)
        do_full_backup
        ;;
    partial)
        do_partial_backup
        ;;
    *)
        log_message "Uso: $0 [full|partial]"
        exit 1
        ;;
esac

# Enviar notificación por correo (opcional)
# mail -s "AutogestiónPro Backup - $1 completado" tu@email.com < "${BACKUP_LOG}"

exit 0
