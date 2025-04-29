#!/bin/bash
# Script para configurar code-server en español y con extensiones útiles

# Crear directorios necesarios
mkdir -p config data extensions logs workspaces User

# Verificar si existe el archivo settings.json en User, si no, crearlo
if [ ! -f "./User/settings.json" ]; then
    cat > ./User/settings.json << EOF
{
    "workbench.colorTheme": "Default Dark+",
    "workbench.startupEditor": "none",
    "editor.fontSize": 14,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "explorer.confirmDelete": false,
    "explorer.confirmDragAndDrop": false,
    "editor.minimap.enabled": true,
    "window.menuBarVisibility": "visible",
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.defaultProfile.linux": "bash",
    "telemetry.telemetryLevel": "off",
    "update.mode": "none",
    "locale": "es",
    "extensions.autoUpdate": false
}
EOF
fi

# Crear archivo de configuración para code-server
if [ ! -f "./config/config.yaml" ]; then
    cat > ./config/config.yaml << EOF
bind-addr: 0.0.0.0:8080
auth: password
password: $(grep CODE_PASSWORD .env | cut -d= -f2)
cert: false
user-data-dir: /home/coder/.local/share/code-server/User
extensions-dir: /home/coder/.local/share/code-server/extensions
EOF
fi

# Comprobar si el archivo .env existe, si no, crearlo
if [ ! -f ".env" ]; then
    cat > .env << EOF
CODE_PASSWORD=tu_contraseña_segura
TZ=Europe/Madrid
LANG=es_ES.UTF-8
LC_ALL=es_ES.UTF-8
EOF
    echo "Archivo .env creado. Por favor, edita el archivo y cambia 'tu_contraseña_segura' por una contraseña segura."
fi

# Dar permisos de ejecución al script
chmod +x setup-code-server.sh

echo "Configuración completada. Para iniciar code-server, ejecuta: docker-compose up -d"
echo "Accede a tu code-server en: http://localhost:8080"