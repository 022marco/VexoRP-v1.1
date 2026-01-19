// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, CheckCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Inicia sesión para ver el dashboard</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">VEXO RP</h1>
        <p className="text-gray-400">Sistema de Verificación</p>
      </div>

      {/* Panel Principal - COMO TU IMAGEN */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-400">Sistema de identificación VEXO</p>
        </div>

        {/* Tarjeta de Usuario */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-850 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`}
                  alt={user.username}
                  className="w-16 h-16 rounded-full border-4 border-blue-500"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">¡Bienvenido {user.username}!</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'whitelist' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                    <span className="flex items-center">
                      <Shield className="w-3 h-3 mr-2" />
                      Eres: {user.role === 'whitelist' ? 'Whitelist' : 'Pendiente'}
                    </span>
                  </div>
                  {user.whitelistStatus === 'approved' && (
                    <div className="px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full text-sm font-medium">
                      Verificado
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex space-x-4">
              {user.role === 'whitelist' ? (
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-bold transition-all transform hover:scale-105">
                  <User className="w-5 h-5" />
                  <span>Crear DNI</span>
                </button>
              ) : (
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-xl font-bold transition-all transform hover:scale-105">
                  <FileText className="w-5 h-5" />
                  <span>COMPLETAR VERIFICACIÓN</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h4 className="text-gray-400 text-sm font-medium mb-2">Estado de Verificación</h4>
            <p className="text-2xl font-bold text-white">
              {user.whitelistStatus === 'approved' ? 'Aprobado' : 
               user.whitelistStatus === 'pending' ? 'En Revisión' : 'Pendiente'}
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h4 className="text-gray-400 text-sm font-medium mb-2">Rol en VEXO</h4>
            <p className="text-2xl font-bold text-white capitalize">{user.role}</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h4 className="text-gray-400 text-sm font-medium mb-2">ID de Discord</h4>
            <p className="text-lg font-mono text-gray-300">{user.discordId}</p>
          </div>
        </div>
      </div>

      {/* Mensaje según estado */}
      <div className="mt-8 text-center">
        {user.role === 'pending' && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">⚠️ Verificación Pendiente</h3>
            <p className="text-gray-300">
              Para acceder a todas las funciones de VEXO RP, completa el proceso de verificación.
              Un administrador revisará tu solicitud pronto.
            </p>
          </div>
        )}
        
        {user.role === 'whitelist' && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-2">✅ Acceso Completo</h3>
            <p className="text-gray-300">
              Tienes acceso completo al sistema VEXO RP. Puedes crear tu DNI y acceder a todas las funciones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;