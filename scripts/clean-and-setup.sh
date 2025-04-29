#!/bin/bash
# Script para limpiar configuraciones antiguas y configurar un único code-server

# Detener contenedores existentes
echo "Deteniendo contenedores existentes..."
docker-compose down
docker stop code-server code-server-local 2>/dev/null || true
docker rm code-server code-server-local 2>/dev/null || true

# Obtener UID y GID del usuario actual
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

# Crear directorio para la nueva configuración
echo "Preparando directorios..."
mkdir -p code-server-unified
cd code-server-unified

# Guardar UID y GID en .env
echo "Configurando variables de entorno..."
cat > .env << EOF
CODE_PASSWORD=opencode
TZ=Europe/Madrid
LANG=es_ES.UTF-8
LC_ALL=es_ES.UTF-8
UID=$CURRENT_UID
GID=$CURRENT_GID
EOF

# Crear docker-compose.yml con la configuración actualizada
echo "Creando archivo docker-compose.yml..."
cat > docker-compose.yml << EOF
version: '3'

services:
  code-server:
    container_name: code-server
    image: ghcr.io/coder/code-server:latest
    user: "\${UID:-1000}:\${GID:-1000}"
    ports:
      - "8080:8080"
    volumes:
      - ./config:/home/coder/.config/code-server
      - ./data:/home/coder/project
      - ./extensions:/home/coder/.local/share/code-server/extensions
      - ./logs:/home/coder/.local/share/code-server/logs
      - ./workspaces:/home/coder/.local/share/code-server/workspaces
      - ./User:/home/coder/.local/share/code-server/User
    environment:
      - PASSWORD=\${CODE_PASSWORD:-opencode}
      - TZ=Europe/Madrid
      - LANG=es_ES.UTF-8
      - LC_ALL=es_ES.UTF-8
    restart: unless-stopped
    env_file:
      - .env
    networks:
      - agp-net
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
    command: --locale=es --user-data-dir=/home/coder/.local/share/code-server/User

networks:
  agp-net:
    external: true
EOF

# Crear estructura de directorios
echo "Creando estructura de directorios..."
mkdir -p config data extensions logs workspaces User

# Crear archivo de configuración básico
echo "Creando archivo de configuración básico..."
mkdir -p config
cat > ./config/config.yaml << EOF
bind-addr: 0.0.0.0:8080
auth: password
password: opencode
cert: false
user-data-dir: /home/coder/.local/share/code-server/User
extensions-dir: /home/coder/.local/share/code-server/extensions
EOF

# Crear archivo de configuración de usuario
echo "Creando archivo de configuración de usuario..."
mkdir -p User
cat > ./User/settings.json << EOF
{
    "workbench.colorTheme": "Default Dark+",
    "editor.fontSize": 14,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "explorer.confirmDelete": false,
    "explorer.confirmDragAndDrop": false,
    "telemetry.telemetryLevel": "off",
    "update.mode": "none",
    "locale": "es",
    "extensions.autoUpdate": false
}
EOF

# Asignar permisos adecuados
echo "Asignando permisos adecuados..."
chmod -R 755 .
chmod 644 config/config.yaml User/settings.json .env docker-compose.yml

# Iniciar el contenedor
echo "Iniciando el contenedor..."
docker-compose up -d

echo "Esperando 5 segundos para que el contenedor se inicie..."
sleep 5

echo "Verificando estado del contenedor:"
docker ps | grep code-server

echo "============================================================"
echo "INSTALACIÓN COMPLETADA"
echo "============================================================"
echo "Tu code-server unificado está ahora disponible en: http://localhost:8080"
echo "Credenciales por defecto:"
echo "  - Usuario: Sin usuario (solo contraseña)"
echo "  - Contraseña: opencode"
echo ""
echo "IMPORTANTE: Cambia la contraseña por defecto editando el archivo .env"
echo "y reiniciando el contenedor con 'docker-compose restart'"
echo "============================================================"
