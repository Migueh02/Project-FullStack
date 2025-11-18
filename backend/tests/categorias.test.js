// Tests para endpoints de categorías
const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

describe('API de Categorías', () => {
    // Limpiar base de datos antes de cada test
    beforeEach(async () => {
        await pool.query('DELETE FROM categorias WHERE nombre NOT IN ($1, $2, $3)', 
            ['Estudio', 'Trabajo', 'Hobby']);
    });

    afterAll(async () => {
        await pool.end();
    });

    test('GET /api/categorias - Debe listar todas las categorías', async () => {
        const response = await request(app)
            .get('/api/categorias')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test('POST /api/categorias - Debe crear una nueva categoría', async () => {
        const nuevaCategoria = {
            nombre: 'Test Categoría'
        };

        const response = await request(app)
            .post('/api/categorias')
            .send(nuevaCategoria)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('nombre', 'Test Categoría');
    });

    test('POST /api/categorias - Debe rechazar categoría sin nombre', async () => {
        const response = await request(app)
            .post('/api/categorias')
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    test('POST /api/categorias - Debe rechazar categoría con nombre vacío', async () => {
        const response = await request(app)
            .post('/api/categorias')
            .send({ nombre: '' })
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });
});

