# Servicio: mosquitto

Esta carpeta contiene la configuración profesional para el servicio `mosquitto` de AutogestiónPro.

## Estructura

- `entrypoint.sh`: Script de arranque personalizado.
- `config/`: Archivos de configuración del servicio.
- `logs/`: Registro y trazas del contenedor.
- `setup/`: Archivos opcionales para setup inicial (instalación o ajustes).

## Montaje recomendado en docker-compose.yml

```yaml
  mosquitto:
    volumes:
      - ./servicios/mosquitto/config:/config
      - ./servicios/mosquitto/logs:/logs
      - ./servicios/mosquitto/entrypoint.sh:/entrypoint.sh
```