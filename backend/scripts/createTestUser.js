// Script para crear un usuario de prueba si no existe
const pool = require('../src/config/db');

async function createTestUser() {
    try {
        // Verificar si ya existe un usuario de prueba
        const existingUser = await pool.query(
            "SELECT id FROM usuarios WHERE email = $1",
            ['test@example.com']
        );

        if (existingUser.rows.length > 0) {
            console.log('✅ Usuario de prueba ya existe:', existingUser.rows[0].id);
            await pool.end();
            return;
        }

        // Crear usuario de prueba
        const result = await pool.query(
            "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email",
            ['test@example.com', 'password123']
        );

        console.log('✅ Usuario de prueba creado:', result.rows[0]);
        await pool.end();
    } catch (error) {
        console.error('❌ Error creando usuario de prueba:', error.message);
        await pool.end();
        process.exit(1);
    }
}

createTestUser();

