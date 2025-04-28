const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const os = require('os');
const { exec } = require('child_process');
const { Pool } = require('pg');
const mysql = require('mysql2/promise');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración PostgreSQL
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'agp_user',
  password: process.env.POSTGRES_PASSWORD || 'agp_password',
  database: process.env.POSTGRES_DB || 'agp_database',
});

// Configuración MySQL
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'agp_user',
  password: process.env.MYSQL_PASSWORD || 'agp_password',
  database: process.env.MYSQL_DATABASE || 'agp_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de AutogestiónPro funcionando correctamente',
    version: '1.0.0',
  });
});

// 🔍 Endpoint: Estado general del sistema
app.get('/api/system-status', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ram = {
    used: `${Math.round((usedMem / totalMem) * 100)}%`,
    free: `${Math.round((freeMem / totalMem) * 100)}%`,
    total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
  };

  const uptimeSec = os.uptime();
  const uptime = `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m`;

  const disk = {
    used: 'N/A',
  };

  const temperature = 'N/A';

  const backend = '🟢 Activo';

  res.json({ ram, disk, temperature, uptime, backend });
});

// 🔍 Estado de bases de datos
app.get('/api/status', async (req, res) => {
  const status = {
    postgres: false,
    mysql: false,
  };

  try {
    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT NOW()');
    pgClient.release();
    status.postgres = true;
  } catch (pgError) {
    console.error('Error PostgreSQL:', pgError.message);
  }

  try {
    await mysqlPool.query('SELECT NOW()');
    status.mysql = true;
  } catch (mysqlError) {
    console.error('Error MySQL:', mysqlError.message);
  }

  res.json({
    status,
    timestamp: new Date().toISOString(),
  });
});

// 🔍 Estado de contenedores Docker
app.get('/api/containers', (req, res) => {
  exec('docker ps --format "{{.Names}}|{{.Status}}"', (err, stdout) => {
    if (err) {
      console.error('Error ejecutando docker ps:', err.message);
      return res.status(500).json({ error: 'Error al ejecutar docker ps' });
    }

    const containers = stdout.trim().split('\n').map(line => {
      const [name, status] = line.split('|');
      return { name, status };
    });

    res.json({
      count: containers.length,
      containers,
      timestamp: new Date().toISOString(),
    });
  });
});

// 🔐 Autenticación simulada
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '8374') {
    res.json({
      success: true,
      token: 'jwt-token-simulado',
      user: {
        id: 1,
        username: 'admin',
        name: 'Administrador',
        role: 'admin',
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas',
    });
  }
});

// ❌ 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ⚠️ Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[Error interno]:', err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {}),
  });
});
// 🔊 Iniciar servidor
const PORT = process.env.PORT || 4000; // <-- CAMBIADO 3000 ➔ 4000
app.listen(PORT, () => {
  console.log(`✅ Backend ejecutándose en http://localhost:${PORT}`);
});
