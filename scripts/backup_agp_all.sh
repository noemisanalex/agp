#!/bin/bash

FECHA=$(date +"%F")
BASE_DIR="$HOME/agp"
BACKUP_DIR="$BASE_DIR/backups"
mkdir -p "$BACKUP_DIR"

log_info() {
  echo "[$(date +'%F %T')] $1"
}

# === NGINX Proxy Manager ===
log_info "Backup: NGINX Proxy Manager"
mkdir -p "$BACKUP_DIR/nginx-proxy-manager"
tar -czf "$BACKUP_DIR/nginx-proxy-manager/npm-backup-$FECHA.tar.gz" \
    -C "$BASE_DIR/nginx-proxy-manager" data letsencrypt

# === Vaultwarden ===
log_info "Backup: Vaultwarden"
mkdir -p "$BACKUP_DIR/vaultwarden"
tar -czf "$BACKUP_DIR/vaultwarden/vaultwarden-backup-$FECHA.tar.gz" \
    -C "$BASE_DIR/vaultwarden" .

# === Grafana ===
log_info "Backup: Grafana"
mkdir -p "$BACKUP_DIR/grafana"
tar -czf "$BACKUP_DIR/grafana/grafana-backup-$FECHA.tar.gz" \
    -C "$BASE_DIR/grafana" .

# === IA Services ===
log_info "Backup: IA Services"
mkdir -p "$BACKUP_DIR/ia-services"
tar -czf "$BACKUP_DIR/ia-services/ia-services-backup-$FECHA.tar.gz" \
    -C "$BASE_DIR/ia-services" .

# === PostgreSQL ===
log_info "Backup: PostgreSQL (agp-postgres)"
mkdir -p "$BACKUP_DIR/postgres"
docker exec agp-postgres pg_dump -U agp_user agp_database > "$BACKUP_DIR/postgres/agp_database-$FECHA.sql"

# === MySQL ===
log_info "Backup: MySQL (agp-mysql)"
mkdir -p "$BACKUP_DIR/mysql"
docker exec agp-mysql /usr/bin/mysqldump -u agp_user --password=agp_password agp_database > "$BACKUP_DIR/mysql/agp_database-$FECHA.sql"

log_info "✅ Backups completados en $BACKUP_DIR"
