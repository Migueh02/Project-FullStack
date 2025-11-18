#!/bin/sh
# Script de inicialización de base de datos para Docker
# Este script espera a que PostgreSQL esté listo y ejecuta las migraciones

set -e

echo "Esperando a que PostgreSQL esté listo..."

# Esperar hasta que PostgreSQL esté disponible
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  >&2 echo "PostgreSQL no está disponible aún - esperando..."
  sleep 1
done

echo "PostgreSQL está listo!"

# Ejecutar migraciones
echo "Ejecutando migraciones..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /usr/src/app/migrations.sql

echo "Migraciones completadas!"

