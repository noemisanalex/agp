#!/bin/bash
set -e

# Cargar configuración
source "$(dirname "$0")/../.env"

echo "🔁 Restaurador de Backups para AutogestiónPro"
echo "============================================="
echo "1. Restaurar backup COMPLETO"
echo "2. Restaurar backup PARCIAL"
echo -n "Elige una opción [1-2]: "
read OPCION

case $OPCION in
  1)
    echo "📁 Buscando backups completos en $BACKUP_DIR/full/"
    ls -1t "$BACKUP_DIR/full/" | grep -E '\.tar\.gz|\.gpg' | nl
    echo -n "Selecciona número de archivo: "
    read N
    ARCHIVO=$(ls -1t "$BACKUP_DIR/full/" | grep -E '\.tar\.gz|\.gpg' | sed -n "${N}p")
    RESTORE_PATH="$BACKUP_DIR/restore/full"
    ;;

  2)
    echo "📁 Buscando backups parciales en $BACKUP_DIR/partial/"
    ls -1t "$BACKUP_DIR/partial/" | grep -E '\.tar\.gz|\.gpg' | nl
    echo -n "Selecciona número de archivo: "
    read N
    ARCHIVO=$(ls -1t "$BACKUP_DIR/partial/" | grep -E '\.tar\.gz|\.gpg' | sed -n "${N}p")
    RESTORE_PATH="$BACKUP_DIR/restore/partial"
    ;;

  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac

# Crear ruta de restauración
mkdir -p "$RESTORE_PATH"

# Desencriptar si es necesario
if [[ "$ARCHIVO" == *.gpg ]]; then
  echo "🔐 Desencriptando $ARCHIVO..."
  gpg --output "$RESTORE_PATH/backup_restaurado.tar.gz" --decrypt "$BACKUP_DIR/${OPCION==1 ? full : partial}/$ARCHIVO"
  TARFILE="$RESTORE_PATH/backup_restaurado.tar.gz"
else
  cp "$BACKUP_DIR/${OPCION==1 ? full : partial}/$ARCHIVO" "$RESTORE_PATH/"
  TARFILE="$RESTORE_PATH/$ARCHIVO"
fi

# Extraer
echo "📦 Extrayendo backup en $RESTORE_PATH/unpacked/"
mkdir -p "$RESTORE_PATH/unpacked"
tar -xzf "$TARFILE" -C "$RESTORE_PATH/unpacked"

echo "✅ Restauración completa en: $RESTORE_PATH/unpacked/"
echo "ℹ️ Desde ahí puedes mover manualmente lo que necesites."
