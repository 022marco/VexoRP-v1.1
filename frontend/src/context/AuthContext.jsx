// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('vexo_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      localStorage.setItem('vexo_token', token);
    } catch (error) {
      localStorage.removeItem('vexo_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDiscord = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    
    window.location.href = discordAuthUrl;
  };

  const handleCallback = async (token) => {
    try {
      localStorage.setItem('vexo_token', token);
      
      const response = await axios.get(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      toast.success(`¡Bienvenido ${response.data.user.username}!`);
      return response.data.user;
    } catch (error) {
      toast.error('Error al verificar sesión');
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('vexo_token');
    setUser(null);
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithDiscord,
      handleCallback,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};