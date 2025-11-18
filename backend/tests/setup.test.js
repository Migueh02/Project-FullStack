// Tests de configuración y conexión
const pool = require('../src/config/db');

describe('Configuración de Base de Datos', () => {
    test('Debe conectarse a la base de datos', async () => {
        const result = await pool.query('SELECT NOW()');
        expect(result.rows).toBeDefined();
        expect(result.rows.length).toBeGreaterThan(0);
    });

    test('Debe tener la tabla tareas', async () => {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'tareas'
        `);
        expect(result.rows.length).toBe(1);
    });

    test('Debe tener la tabla categorias', async () => {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'categorias'
        `);
        expect(result.rows.length).toBe(1);
    });

    test('Debe tener la tabla usuarios', async () => {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'usuarios'
        `);
        expect(result.rows.length).toBe(1);
    });

    test('La tabla tareas debe tener las columnas categoria_id y usuarios_id', async () => {
        const result = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tareas' 
            AND column_name IN ('categoria_id', 'usuarios_id')
        `);
        expect(result.rows.length).toBe(2);
    });
});

