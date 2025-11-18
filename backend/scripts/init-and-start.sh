#!/bin/sh
# Script simple que ejecuta setup y luego inicia el servidor

echo "🔧 Ejecutando setup de base de datos..."
node scripts/setupDatabaseOnce.js

echo "🚀 Iniciando servidor..."
exec npm start

