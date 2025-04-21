# 📦 Scripts de AutogestiónPro

Este directorio contiene utilidades y scripts de mantenimiento para la infraestructura de AutogestiónPro.

## ▶️ Scripts disponibles

| Script                   | Descripción                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `start-all.sh`           | Inicia todos los servicios Docker definidos en el compose principal.        |
| `stop-all.sh`            | Detiene todos los servicios Docker (con logs y control).                    |
| `restart-agp.sh`         | Realiza reinicio completo: stop + start de servicios.                       |
| `start-frontend.sh`      | Inicia solo el frontend (Webpack/Vite).                                     |
| `backup_agp_all.sh`      | Realiza backups completos del sistema (base de datos y configuraciones).    |
| `backup.sh`              | Script auxiliar de backup (versión ligera/parcial).                         |
| `clean-volumes.sh`       | Limpia los volúmenes de datos en `bases-de-datos/` sin borrar contenedores. |
| `clean-obsolete.sh`      | Elimina archivos `docker-compose.yml` duplicados y carpetas obsoletas.      |
| `check-env.sh`           | Verifica que existan todas las variables necesarias en `.env`.              |
| `control.sh`             | Menú interactivo de control de servicios y scripts.                         |
| `ver_logs.sh`            | Muestra los logs de todos los contenedores (últimas líneas).                |
| `orquestador.sh`         | Script maestro que coordina tareas automatizadas o de mantenimiento.        |
| `setup-estructura.sh`    | Crea la estructura básica del sistema AGP.                                  |
| `setup_ai_services.sh`   | Instala e inicializa servicios de IA personalizados.                        |
| `fix-env-paths.sh`       | Corrige rutas o referencias rotas en `.env` u otros scripts.                |
| `estructura.log`         | Archivo de log de creación de estructura inicial.                           |

## 📂 Otros

- `env-backups/`: Backups antiguos de archivos `.env` y composiciones descartadas.

---

**Recuerda ejecutar siempre los scripts con permisos:**

```bash
chmod +x nombre.sh
./nombre.sh
```