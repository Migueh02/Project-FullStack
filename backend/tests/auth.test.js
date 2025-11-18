// Tests para endpoints de autenticación
const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

describe('API de Autenticación', () => {
    let testUserId;

    beforeAll(async () => {
        // Crear un usuario de prueba
        const result = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id',
            ['test@example.com', 'password123']
        );
        testUserId = result.rows[0].id;
    });

    afterAll(async () => {
        // Limpiar usuario de prueba
        await pool.query('DELETE FROM usuarios WHERE email = $1', ['test@example.com']);
        await pool.end();
    });

    test('POST /api/auth/login - Debe hacer login con credenciales válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('userId');
        expect(response.body.userId).toBe(testUserId);
    });

    test('POST /api/auth/login - Debe rechazar credenciales inválidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
            .expect(401);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
    });

    test('POST /api/auth/login - Debe rechazar email inexistente', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            })
            .expect(401);

        expect(response.body).toHaveProperty('success', false);
    });

    test('POST /api/auth/login - Debe rechazar request sin email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password: 'password123'
            })
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    test('POST /api/auth/login - Debe rechazar request sin password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com'
            })
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });
});

