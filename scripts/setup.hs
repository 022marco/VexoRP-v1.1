# scripts/setup.sh
#!/bin/bash

echo "🔐 INSTALADOR SEGURO VEXO RP"
echo "============================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Instala Node.js 18+ desde: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm $(npm -v)"

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB no encontrado"
    echo "Instala MongoDB o usa MongoDB Atlas"
    read -p "¿Usar MongoDB Atlas? (s/n): " useAtlas
    
    if [[ $useAtlas == "s" ]]; then
        echo "🌐 Ve a: https://www.mongodb.com/cloud/atlas"
        echo "Crea cluster gratuito y obtén connection string"
        read -p "Pega tu MongoDB URI: " mongoUri
        echo "MONGODB_URI=$mongoUri" >> backend/.env
    else
        echo "📦 Instala MongoDB desde: https://www.mongodb.com/try/download/community"
        exit 1
    fi
else
    echo "✅ MongoDB encontrado"
fi

# Instalar dependencias backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm ci --only=production
cd ..

# Instalar dependencias frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm ci --only=production
cd ..

# Generar claves seguras
echo "🔑 Generando claves de seguridad..."
cd backend
if [ ! -f .env ]; then
    echo "⚠️  Creando archivo .env desde ejemplo..."
    cp .env.example .env
    
    # Generar secrets
    echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
    echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env
    echo "REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)" >> .env
    
    echo "⚠️  EDITA .env CON TUS DATOS REALES DE DISCORD"
fi

echo ""
echo "🎉 INSTALACIÓN COMPLETADA"
echo "========================="
echo ""
echo "📝 PASOS FINALES:"
echo "1. Edita backend/.env con tu CLIENT_ID y CLIENT_SECRET de Discord"
echo "2. Añade tus dominios en ALLOWED_ORIGINS"
echo ""
echo "🚀 PARA INICIAR:"
echo "Backend: cd backend && npm run dev"
echo "Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3001"
echo "- Health Check: http://localhost:3001/api/health"