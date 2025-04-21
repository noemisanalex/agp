const express = require('express');
const os = require('os');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.get('/api/system-status', async (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const uptime = os.uptime();

    exec("df -h --output=pcent / | tail -1", (err, stdout) => {
      const diskUsage = stdout.trim().replace('%', '');

      exec("sensors | grep 'Package id 0:' || echo 'N/A'", (err2, tempOutput) => {
        const temp = tempOutput.includes("°C")
          ? tempOutput.trim().match(/[\d.]+(?=°C)/)?.[0] + "°C"
          : "N/A";

        return res.json({
          ram: {
            total: (totalMem / 1024 / 1024).toFixed(0) + ' MB',
            free: (freeMem / 1024 / 1024).toFixed(0) + ' MB',
            used: (((totalMem - freeMem) / totalMem) * 100).toFixed(1) + '%',
          },
          disk: {
            used: diskUsage + '%'
          },
          uptime: Math.floor(uptime / 60) + ' min',
          temperature: temp,
          backend: '🟢 OK',
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado del sistema' });
  }
});

app.listen(port, () => {
  console.log(`✅ Estado del sistema activo en http://localhost:${port}/api/system-status`);
});
