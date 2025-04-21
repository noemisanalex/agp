const os = require('os');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ram = {
    used: `${Math.round((usedMem / totalMem) * 100)}%`,
    free: `${Math.round((freeMem / totalMem) * 100)}%`
  };

  const uptime = `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`;

  const disk = {
    used: 'N/A' // Requiere usar una lib como `diskusage` para datos reales
  };

  const temperature = 'N/A'; // Requiere sensores (ej: `systeminformation`)

  const backend = '🟢 Activo';

  res.json({ ram, disk, temperature, uptime, backend });
});

module.exports = router;