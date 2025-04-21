#!/bin/bash
set -e

# Configuraciones personalizadas para code-server
CODE_SERVER_CONFIG="/home/coder/.config/code-server/config.yaml"

# Crear directorio de configuración si no existe
mkdir -p "$(dirname "$CODE_SERVER_CONFIG")"

# Configuración básica
cat > "$CODE_SERVER_CONFIG" <<INNEREOF
bind-addr: 0.0.0.0:8080
auth: password
password: ${CODE_PASSWORD}
cert: false
INNEREOF

# Ejecutar code-server
exec code-server --config "$CODE_SERVER_CONFIG"
