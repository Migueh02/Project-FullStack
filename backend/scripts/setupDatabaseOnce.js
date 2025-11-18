// Script para inicializar la base de datos con las migraciones
// Versión que no hace exit, para usar en scripts de inicio
const pool = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    let retries = 5;
    let connected = false;

    // Intentar conectar a la base de datos con reintentos
    while (retries > 0 && !connected) {
        try {
            await pool.query('SELECT NOW()');
            connected = true;
            console.log('✅ Conectado a la base de datos');
        } catch (error) {
            retries--;
            if (retries === 0) {
                console.error('❌ No se pudo conectar a la base de datos después de varios intentos');
                return false;
            }
            console.log(`⏳ Esperando conexión a la base de datos... (${retries} intentos restantes)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    try {
        console.log('Iniciando configuración de la base de datos...');

        // Leer el archivo de migraciones
        const migrationsPath = path.join(__dirname, '..', 'migrations.sql');
        if (!fs.existsSync(migrationsPath)) {
            console.error('❌ No se encontró el archivo migrations.sql');
            return false;
        }
        const migrationsSQL = fs.readFileSync(migrationsPath, 'utf8');

        // Ejecutar las migraciones
        await pool.query(migrationsSQL);
        console.log('✅ Migraciones ejecutadas correctamente');

        // Verificar que las tablas existen
        const tablesCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('tareas', 'categorias', 'usuarios')
        `);

        console.log('✅ Tablas verificadas:', tablesCheck.rows.map(r => r.table_name).join(', '));

        // Verificar categorías iniciales
        const categorias = await pool.query('SELECT * FROM categorias');
        console.log('✅ Categorías encontradas:', categorias.rows.length);

        // Crear usuario de prueba si no existe
        const existingUser = await pool.query(
            "SELECT id FROM usuarios WHERE email = $1",
            ['test@example.com']
        );

        if (existingUser.rows.length === 0) {
            await pool.query(
                "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email",
                ['test@example.com', 'password123']
            );
            console.log('✅ Usuario de prueba creado (test@example.com)');
        } else {
            console.log('✅ Usuario de prueba ya existe');
        }

        console.log('✅ Base de datos configurada correctamente');
        // NO cerrar el pool aquí - el servidor lo necesita
        // await pool.end();
        return true;
    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error.message);
        console.error('Stack:', error.stack);
        // NO cerrar el pool aquí tampoco
        // await pool.end();
        return false;
    }
}

// Si se ejecuta directamente, hacer setup y terminar el proceso
// El script shell esperará a que termine antes de continuar
if (require.main === module) {
    setupDatabase().then(success => {
        if (!success) {
            console.error('⚠️ Setup falló, pero continuando con el servidor...');
        }
        console.log('✅ Setup completado, continuando con el inicio del servidor...');
        // Terminar el proceso para que el siguiente comando se ejecute
        process.exit(success ? 0 : 1);
    }).catch(err => {
        console.error('⚠️ Error en setup:', err.message);
        // Incluso con error, intentar iniciar el servidor
        console.log('⚠️ Continuando con el inicio del servidor a pesar del error...');
        process.exit(1);
    });
} else {
    module.exports = setupDatabase;
}

