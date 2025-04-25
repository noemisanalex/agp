const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

const servicios = [
  'vaultwarden',
  'n8n',
  'portainer',
  'homeassistant',
  'influxdb',
  'code-server',
  'postgres',
  'mysql',
  'mosquitto',
];

router.get('/system-status', async (req, res) => {
  try {
    const status = {};
    
    // Usar Promise.all para ejecutar todas las consultas en paralelo
    await Promise.all(
      servicios.map((name) => {
        return new Promise((resolve) => {
          // Usar una consulta Docker más completa para obtener estado y salud
          exec(`docker inspect --format '{{.State.Status}}|{{.State.Health.Status}}' ${name}`, (err, stdout) => {
            if (err) {
              // Si hay error, el contenedor probablemente no existe o no es accesible
              status[name] = { 
                status: 'down', 
                health: 'unknown',
                error: err.message 
              };
            } else {
              const [containerStatus, healthStatus] = stdout.trim().split('|');
              
              // Determinar el estado general
              let statusValue = 'down';
              if (containerStatus === 'running') {
                if (healthStatus === 'healthy' || !healthStatus) {
                  statusValue = 'up';
                } else if (healthStatus === 'starting' || healthStatus === 'unhealthy') {
                  statusValue = 'warning';
                }
              } else if (containerStatus === 'restarting') {
                statusValue = 'warning';
              }
              
              status[name] = { 
                status: statusValue,
                containerState: containerStatus,
                health: healthStatus || 'N/A' 
              };
            }
            resolve();
          });
        });
      })
    );
    
    // Añadir timestamp a la respuesta
    res.json({ 
      timestamp: new Date().toISOString(),
      services: status 
    });
  } catch (error) {
    console.error('Error al verificar el estado del sistema:', error);
    res.status(500).json({ 
      error: 'Error interno al consultar el estado',
      message: error.message 
    });
  }
});

module.exports = router;