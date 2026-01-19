// frontend/src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      handleCallback(token).then(() => {
        setTimeout(() => navigate('/dashboard'), 1500);
      });
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-6"></div>
        <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Verificando con VEXO</h2>
        <p className="text-gray-400">Autenticando con Discord...</p>
      </div>
    </div>
  );
};

export default AuthCallback;