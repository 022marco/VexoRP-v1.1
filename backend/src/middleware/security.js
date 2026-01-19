// backend/src/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ========================================
// 1. HELMET CONFIGURACIÓN AVANZADA
// ========================================
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://cdn.discordapp.com"],
      connectSrc: ["'self'", "https://discord.com", process.env.FRONTEND_URL],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'same-origin' },
  frameguard: { action: 'deny' }
});

// ========================================
// 2. CORS ESTRICTO
// ========================================
const corsStrict = cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `Origen no permitido por CORS: ${origin}`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

// ========================================
// 3. RATE LIMITING
// ========================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Demasiadas peticiones desde esta IP' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
  message: { error: 'Demasiados intentos de autenticación' },
  skipSuccessfulRequests: true
});

// ========================================
// 4. SANITIZACIÓN DE DATOS
// ========================================
const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitizado key: ${key} en request a ${req.path}`);
  }
});

// ========================================
// 5. BODY PARSERS SEGUROS
// ========================================
const bodyParsers = (req, res, next) => {
  express.json({
    limit: '10kb', // Limitar tamaño
    verify: (req, res, buf) => {
      // Verificar que es JSON válido
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        throw new Error('JSON inválido');
      }
    }
  })(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    next();
  });
};

// ========================================
// 6. VALIDACIÖN DE JWT
// ========================================
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId)
      .select('-__v -loginHistory')
      .lean();
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar si está bloqueado
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ 
        error: 'Cuenta bloqueada temporalmente' 
      });
    }
    
    // Añadir usuario al request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Error de autenticación' });
  }
};

// ========================================
// 7. VALIDACIÓN DE ADMIN
// ========================================
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

// ========================================
// 8. DETECCIÓN DE RAIDS POR IP
// ========================================
const raidDetection = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  try {
    // Contar registros recientes desde esta IP
    const recentRegistrations = await User.countDocuments({
      'loginHistory.ip': ip,
      'loginHistory.timestamp': { 
        $gt: new Date(Date.now() - 5 * 60 * 1000) // Últimos 5 minutos
      }
    });
    
    // Si hay más de X registros, posible raid
    const maxLogins = parseInt(process.env.MAX_LOGINS_PER_IP) || 5;
    
    if (recentRegistrations >= maxLogins) {
      console.warn(`🚨 POSIBLE RAID DETECTADO desde IP: ${ip}`);
      
      // Puedes tomar acciones:
      // 1. Bloquear IP temporalmente
      // 2. Notificar admin
      // 3. Requerir CAPTCHA
      
      // Por ahora solo logueamos
      req.isSuspicious = true;
    }
    
  } catch (error) {
    console.error('Error en detección de raid:', error);
  }
  
  next();
};

// ========================================
// 9. XSS PROTECTION
// ========================================
const xssClean = xss();

// ========================================
// 10. HPP PROTECTION
// ========================================
const hppProtection = hpp();

// ========================================
// 11. HEALTH CHECK
// ========================================
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV
  });
};

// ========================================
// 12. MANEJO DE ERRORES
// ========================================
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // No mostrar detalles en producción
  const isProduction = process.env.NODE_ENV === 'production';
  
  const response = {
    error: isProduction ? 'Algo salió mal' : err.message,
    stack: isProduction ? undefined : err.stack
  };
  
  res.status(err.status || 500).json(response);
};

module.exports = {
  helmetConfig,
  corsStrict,
  globalLimiter,
  authLimiter,
  sanitizeData,
  bodyParsers,
  requireAuth,
  requireAdmin,
  raidDetection,
  xssClean,
  hppProtection,
  healthCheck,
  errorHandler
};