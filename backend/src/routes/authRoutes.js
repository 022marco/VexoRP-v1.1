// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Iniciar autenticación con Discord
router.get('/discord', passport.authenticate('discord'));

// 2. Callback de Discord
router.get('/discord/callback',
  passport.authenticate('discord', { 
    failureRedirect: process.env.FRONTEND_URL,
    session: false 
  }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Crear JWT token para VEXO
      const token = jwt.sign(
        { 
          userId: user._id,
          discordId: user.discordId,
          username: user.username,
          role: user.role,
          avatar: user.avatar
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Redirigir al frontend con token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&username=${encodeURIComponent(user.username)}&role=${user.role}`);
    } catch (error) {
      console.error('Error en callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/?error=auth_failed`);
    }
  }
);

// 3. Verificar token (para frontend)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        discordId: user.discordId,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        role: user.role,
        whitelistStatus: user.whitelistStatus
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 4. Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;