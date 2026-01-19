// frontend/src/pages/Home.jsx
import React from 'react';
import { Shield, CheckCircle, Users, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loginWithDiscord } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          VEXO RP Verification System
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Sistema seguro de verificación para la comunidad VEXO Roleplay. 
          Accede con Discord y obtén tu credencial oficial.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition">
          <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
            <CheckCircle className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Verificación Segura</h3>
          <p className="text-gray-400">
            Autenticación mediante Discord OAuth2 con protección anti-raid y validación en tiempo real.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition">
          <div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Gestión de Whitelist</h3>
          <p className="text-gray-400">
            Sistema de aprobación manual para control de acceso a la comunidad VEXO RP.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition">
          <div className="w-14 h-14 bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
            <Key className="w-7 h-7 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">DNI Digital</h3>
          <p className="text-gray-400">
            Genera tu identificación oficial de VEXO RP con datos verificados y diseño seguro.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          {user ? `¡Bienvenido de vuelta, ${user.username}!` : 'Únete a VEXO RP'}
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          {user
            ? 'Accede a tu dashboard para ver tu estado de verificación y crear tu DNI.'
            : 'Inicia sesión con Discord para comenzar el proceso de verificación y acceder a la comunidad.'}
        </p>
        
        {user ? (
          <a
            href="/dashboard"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition transform hover:scale-105"
          >
            <Shield className="w-6 h-6" />
            <span>Ir al Dashboard</span>
          </a>
        ) : (
          <button
            onClick={loginWithDiscord}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752c4] rounded-xl font-bold text-lg transition transform hover:scale-105"
          >
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/discord.svg" 
              className="w-6 h-6" 
              alt="Discord" 
            />
            <span>Iniciar Sesión con Discord</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;