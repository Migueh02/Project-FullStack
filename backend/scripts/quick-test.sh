#!/bin/bash
# Script rápido para verificar que el backend funciona correctamente

echo "🧪 Ejecutando tests rápidos del backend..."
echo ""

# Verificar que Docker está corriendo
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

# Verificar que los contenedores están corriendo
if ! docker ps | grep -q "pg_taskhub"; then
    echo "⚠️  Los contenedores no están corriendo. Iniciando..."
    cd "$(dirname "$0")/.."
    docker-compose up -d db
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 5
fi

# Ejecutar setup de base de datos
echo "📦 Configurando base de datos..."
npm run setup-db

if [ $? -ne 0 ]; then
    echo "❌ Error al configurar la base de datos"
    exit 1
fi

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Todos los tests pasaron correctamente!"
else
    echo ""
    echo "❌ Algunos tests fallaron"
    exit 1
fi

