# 📚 Documentación General – AutogestiónPro

Este directorio centraliza toda la documentación técnica del proyecto.

---

## 📄 Contenidos generales

- **README.md**: Introducción general al proyecto.
- **REGISTRO_AGP.md**: Registro de cambios y actualizaciones técnicas.
- **backup_agp_all.sh**: Script principal de backups. (ver sección Backups)
- **docker-compose.yml**: Definición de servicios Docker principales.
- **Subdominios y Proxy**: NGINX Proxy Manager – ver `DOCS/nginx-proxy-manager.md`

---

## 🛠️ Guías técnicas y en desarrollo

- Configuración de Cloudflare DNS Challenge (SSL automático)
- Flujo de despliegue automatizado
- Backup incremental y cifrado
- Documentación por servicio (ver abajo)

---

## 📂 Documentación técnica por servicio

- [NGINX Proxy Manager](DOCS/nginx-proxy-manager.md)
- [Grafana](DOCS/grafana.md)
- [n8n](DOCS/n8n.md)
- [IA Services](DOCS/ia-services.md)
- [PostgreSQL](DOCS/postgres.md)
- [MySQL](DOCS/mysql.md)
- [Rasa](DOCS/rasa.md)
- [Vaultwarden](DOCS/vaultwarden.md)
- [Code Server](DOCS/code-server.md)
- [Home Assistant](DOCS/homeassistant.md)
- [Mosquitto](DOCS/mosquitto.md)

---

## 🧠 Organización del proyecto

```plaintext
agp/
├── README/                 ← Documentación general y técnica
│   ├── README.md
│   ├── REGISTRO_AGP.md
│   ├── README_INDEX.md
│   └── DOCS/
├── docker-compose.yml      ← Infraestructura centralizada
├── backup_agp_all.sh       ← Script profesional de backups
├── backups/                ← Backups organizados por servicio
