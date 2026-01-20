const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares básicos
app.use(cors({
  origin: ['https://022marco.github.io', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Ruta RAÍZ - OBLIGATORIA para Render
app.get('/', (req, res) => {
  res.json({
    message: '🚀 VexoRP Backend API v1.1',
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime()
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working correctly!' });
});

// Puerto dinámico (Render asigna uno automático)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
