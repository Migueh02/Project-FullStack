#!/bin/sh
# Script de inicio que ejecuta setup y luego inicia el servidor

echo "🔧 Ejecutando setup de base de datos..."
node scripts/setupDatabase.js

echo "🚀 Iniciando servidor..."
npm start

