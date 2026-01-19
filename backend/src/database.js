// backend/src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vexo_secure')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VEXO API funcionando',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`
    🔐 VEXO BACKEND SEGURO
    ======================
    ✅ Puerto: ${PORT}
    ✅ Modo: ${process.env.NODE_ENV || 'development'}
    📍 URL: http://localhost:${PORT}
  `);
});