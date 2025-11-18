-- Script de migración para agregar nuevas funcionalidades
-- Ejecutar este script en la base de datos PostgreSQL

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL
);

-- 3. Crear tabla de tareas si no existe
CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 4. Agregar columna categoria_id a la tabla tareas
-- Nota: Si la tabla tareas ya tiene datos, primero verificar que no haya conflictos
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS categoria_id INT REFERENCES categorias(id);

-- 5. Agregar columna usuarios_id a la tabla tareas
ALTER TABLE tareas 
ADD COLUMN IF NOT EXISTS usuarios_id INT REFERENCES usuarios(id);

-- 6. Insertar categorías iniciales
INSERT INTO categorias (nombre) VALUES 
    ('Estudio'),
    ('Trabajo'),
    ('Hobby')
ON CONFLICT DO NOTHING;

-- 7. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tareas_usuarios_id ON tareas(usuarios_id);
CREATE INDEX IF NOT EXISTS idx_tareas_categoria_id ON tareas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

