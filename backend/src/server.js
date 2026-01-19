// backend/src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Importar configuración de passport
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vexo_secure')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Importar rutas 
const authRoutes = require('./routes/authRoutes'); // Cambia si tu archivo se llama diferente

// Usar rutas
app.use('/api/auth', authRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VEXO API funcionando',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
    🔐 VEXO BACKEND SEGURO
    ======================
    ✅ Puerto: ${PORT}
    ✅ Modo: ${process.env.NODE_ENV || 'development'}
    📍 API: http://localhost:${PORT}/api
    📍 Health: http://localhost:${PORT}/api/health
    📍 Discord Auth: http://localhost:${PORT}/api/auth/discord
  `);
});