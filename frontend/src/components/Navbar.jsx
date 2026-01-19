// frontend/src/components/Navbar.jsx
import React from 'react';
import { LogIn, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, loginWithDiscord, logout } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo VEXO */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VEXO RP
              </h1>
              <p className="text-xs text-gray-400">Sistema de Verificación</p>
            </div>
          </div>

          {/* Enlaces */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://discord.gg/tu-invitacion-vexo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-400 transition"
            >
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/discord.svg" 
                className="w-5 h-5" 
                alt="Discord" 
              />
              <span>Discord</span>
            </a>
            
            <a 
              href="https://www.roblox.com/groups/tu-grupo-vexo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-red-400 transition"
            >
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/roblox.svg" 
                className="w-5 h-5" 
                alt="Roblox" 
              />
              <span>Roblox</span>
            </a>
          </div>

          {/* Botón de Auth */}
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden sm:inline">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithDiscord}
                className="flex items-center space-x-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] rounded-lg font-medium transition"
              >
                <LogIn className="w-5 h-5" />
                <span>Iniciar con Discord</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;