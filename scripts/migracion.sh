#!/bin/bash

# --- CONFIGURACIÓN ---
# ¡¡IMPORTANTE!! Revisa y ajusta esta ruta si tu directorio home no es /home/alejandro
USER_HOME="/home/alejandro"
AGP_DIR="${USER_HOME}/agp"
# --- FIN CONFIGURACIÓN ---

# -----------------------------------------------------------------------------
# ¡¡¡ ADVERTENCIA DE RIESGO !!!
# -----------------------------------------------------------------------------
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "!!! ADVERTENCIA: ESTE SCRIPT NO REALIZARÁ COPIA DE SEGURIDAD !!!"
echo "!!!                                                                !!!"
echo "!!! Si ocurre algún error durante el movimiento de archivos,       !!!"
echo "!!! podrías perder datos de forma permanente.                      !!!"
echo "!!!                                                                !!!"
echo "!!! Revisa los comandos y asegúrate de entender lo que hacen.      !!!"
echo "!!! SE RECOMIENDA HACER UNA COPIA MANUAL ANTES DE CONTINUAR.       !!!"
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Pulsa Enter si entiendes los riesgos y quieres continuar, o Ctrl+C para cancelar."
read -p ""

# -----------------------------------------------------------------------------
# PASO 0: VERIFICAR DIRECTORIO ACTUAL
# -----------------------------------------------------------------------------
echo "*** ATENCIÓN: El script debe ejecutarse DESDE ${AGP_DIR} ***"
echo "Directorio actual: $(pwd)"
if [ "$(pwd)" != "${AGP_DIR}" ]; then
  echo "ERROR: No estás en el directorio correcto (${AGP_DIR})."
  echo "Por favor, ejecuta: cd ${AGP_DIR}"
  echo "Y luego vuelve a lanzar el script."
  exit 1
fi
echo "Directorio correcto."
echo "-----------------------------------------------------"
sleep 1

# -----------------------------------------------------------------------------
# PASO 1: COPIA DE SEGURIDAD (¡¡¡ OMITIDO POR PETICIÓN DEL USUARIO !!!)
# -----------------------------------------------------------------------------
# echo "PASO 1: Creando copia de seguridad..."
# echo "### COPIA DE SEGURIDAD DESHABILITADA ###"
# echo "-----------------------------------------------------"
# sleep 1
# # BACKUP_DESTINATION="${USER_HOME}/agp_backup_$(date +%Y%m%d_%H%M%S)"
# # echo "PASO 1: Creando copia de seguridad de ${AGP_DIR} en ${BACKUP_DESTINATION}..."
# # cp -a "${AGP_DIR}" "${BACKUP_DESTINATION}"
# # if [ $? -eq 0 ]; then
# #     echo "Copia de seguridad creada con éxito en ${BACKUP_DESTINATION}"
# # else
# #     echo "ERROR: Falló la creación de la copia de seguridad. Revisa permisos o espacio."
# #     echo "Comando fallido: cp -a ${AGP_DIR} ${BACKUP_DESTINATION}"
# #     echo "¡NO CONTINÚES HASTA RESOLVER ESTO!"
# #     exit 1
# # fi
# # echo "-----------------------------------------------------"
# # sleep 2


# -----------------------------------------------------------------------------
# PASO 1 (Antes PASO 2): Mover Archivos desde agp/SUBCARPETA a servicios/SUBCARPETA
# (Sección 2.4 del informe) - Usando rutas absolutas
# -----------------------------------------------------------------------------
echo "PASO 1: Moviendo archivos de ${AGP_DIR}/SUBCARPETA a ${AGP_DIR}/servicios/SUBCARPETA..."
echo "*** SIN COPIA DE SEGURIDAD PREVIA - Moviendo archivos directamente ***"
# Itera sobre cada subdirectorio en servicios/
for target_dir_full in "${AGP_DIR}/servicios/"*; do
    # Verifica si es realmente un directorio
    if [ -d "$target_dir_full" ]; then
        # Obtiene el nombre base (ej: backend)
        base_dir=$(basename "$target_dir_full")
        # Construye la ruta absoluta del directorio fuente correspondiente en agp/
        source_dir_full="${AGP_DIR}/${base_dir}/"

        echo "--- Procesando $base_dir ---"
        # Verifica si el directorio fuente existe
        if [ -d "$source_dir_full" ]; then
            echo "Moviendo archivos desde $source_dir_full HACIA $target_dir_full"
            # Comando find para mover SOLO ARCHIVOS (-type f) recursivamente.
            # -v en mv muestra qué archivos se mueven.
            # {} es el archivo encontrado, + ejecuta mv con múltiples archivos a la vez (eficiente).
            # ¡¡¡ ESTE ES EL COMANDO QUE MUEVE LOS ARCHIVOS !!!
            find "$source_dir_full" -type f -exec mv -v {} "$target_dir_full/" +
            # Podrías necesitar 'sudo' si hay problemas de permisos al mover:
            # sudo find "$source_dir_full" -type f -exec mv -v {} "$target_dir_full/" +
            echo "Movimiento completado para $base_dir."
        else
            echo "AVISO: No se encontró el directorio fuente $source_dir_full. Saltando $base_dir."
        fi
        echo "-------------------------------"
    fi
done
echo "Proceso de movimiento de archivos finalizado."
echo "-----------------------------------------------------"
sleep 2

# -----------------------------------------------------------------------------
# PASO 2 (Antes PASO 3): Eliminar Directorios Vacíos Resultantes en Origen
# (Sección 3.2 del informe) - Usando rutas absolutas
# -----------------------------------------------------------------------------
echo "PASO 2: Eliminando directorios vacíos que quedaron en ${AGP_DIR}/ (excluyendo ./servicios)..."

# Eliminar directorios vacíos DENTRO de los directorios originales en agp/ (los que quedaron vacíos)
find "${AGP_DIR}/" -mindepth 1 -not -path "${AGP_DIR}/servicios/*" -type d -empty -delete
echo "Directorios fuente vacíos eliminados."

# Eliminar directorios vacíos DENTRO de servicios/ (menos probable, pero por si acaso)
# find "${AGP_DIR}/servicios/" -depth -type d -empty -delete
# echo "Directorios vacíos dentro de servicios eliminados (si los había)."
echo "-----------------------------------------------------"
sleep 2

# -----------------------------------------------------------------------------
# PASO 3 (Antes PASO 4): Investigar Autoregeneración - Comandos Iniciales
# -----------------------------------------------------------------------------
echo "PASO 3: Comandos para investigar la autoregeneración..."
echo "(Puede que necesites ejecutar 'sudo' para lsof)"

echo "--- Buscando procesos relacionados (ps):"
ps aux | grep -E 'agp|servicios|docker'

echo "--- Buscando archivos/directorios abiertos en ${AGP_DIR}/servicios/ (lsof):"
sudo lsof +D "${AGP_DIR}/servicios/"

echo "Analiza la salida de estos comandos buscando procesos sospechosos."
echo "-----------------------------------------------------"
sleep 2

# -----------------------------------------------------------------------------
# PASO 4 (Antes PASO 5): Investigar Autoregeneración - Docker Compose (Acción Manual)
# -----------------------------------------------------------------------------
echo "PASO 4: EXAMINAR MANUALMENTE 'docker-compose.yml'"
echo "Este es el paso MÁS IMPORTANTE para la autoregeneración."
echo "1. Localiza tu archivo 'docker-compose.yml' (probablemente en ${AGP_DIR}/)."
echo "2. Ábrelo con un editor de texto (ej: nano docker-compose.yml)."
echo "3. Para CADA servicio:"
echo "   - Busca la sección 'volumes:'."
echo "   - Asegúrate de que las rutas de host apuntan a los directorios correctos DENTRO de '${AGP_DIR}/servicios/'."
echo "   - Ejemplo: '- ${AGP_DIR}/servicios/mysql:/var/lib/mysql'"
echo "4. Guarda los cambios y REINICIA los servicios:"
echo "   cd ${AGP_DIR}"
echo "   docker-compose down && docker-compose up -d"
echo "-----------------------------------------------------"
sleep 2

# -----------------------------------------------------------------------------
# PASO 5 (Antes PASO 6): Investigar Archivos Comprimidos (Acción Manual)
# -----------------------------------------------------------------------------
echo "PASO 5: EXAMINAR MANUALMENTE archivos .zip si existen"
ZIP1_PATH="${AGP_DIR}/servicios_autogestionpro.zip"
ZIP2_PATH="${AGP_DIR}/servicios_fix_entrypoints.zip"
TEMP1_DIR="${AGP_DIR}/temp_zip_autogestionpro"
TEMP2_DIR="${AGP_DIR}/temp_zip_fix_entrypoints"

# (Comandos de ejemplo, ejecútalos manualmente si necesitas revisar los zips)
echo "Ejemplo para revisar:"
if [ -f "$ZIP1_PATH" ]; then echo "unzip ${ZIP1_PATH} -d ${TEMP1_DIR}"; fi
if [ -f "$ZIP2_PATH" ]; then echo "unzip ${ZIP2_PATH} -d ${TEMP2_DIR}"; fi
echo "rm -rf ${TEMP1_DIR} ${TEMP2_DIR}" # Para limpiar después
echo "Busca scripts (.sh) con comandos 'mkdir' apuntando a 'servicios/'."
echo "-----------------------------------------------------"
sleep 2

# -----------------------------------------------------------------------------
# PASO 6 (Antes PASO 7): Monitorear Servicios Después de Cambios (Acción Manual)
# -----------------------------------------------------------------------------
echo "PASO 6: MONITOREAR LOGS de Docker"
echo "Después de ajustar 'docker-compose.yml' y reiniciar,"
echo "vigila los logs para ver errores y si los directorios dejan de crearse."
echo "1. Listar contenedores: docker ps"
echo "2. Ver logs: docker logs <nombre_contenedor>"
echo "   (Usa -f para ver en tiempo real: docker logs -f <nombre_contenedor>)"
echo "-----------------------------------------------------"

echo "******** PROCESO FINALIZADO ********"
echo "Archivos movidos (SIN copia de seguridad previa)."
echo "Recuerda investigar y corregir la causa de la autoregeneración,"
echo "probablemente ajustando los volúmenes en 'docker-compose.yml'."
