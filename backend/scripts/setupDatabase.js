// Script para inicializar la base de datos con las migraciones
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
                process.exit(1);
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
            process.exit(1);
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

        console.log('✅ Base de datos configurada correctamente');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error.message);
        console.error('Stack:', error.stack);
        await pool.end();
        process.exit(1);
    }
}

setupDatabase();

