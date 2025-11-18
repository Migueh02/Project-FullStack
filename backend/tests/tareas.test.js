// Tests para endpoints de tareas con nuevas funcionalidades
const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

describe('API de Tareas', () => {
    let testUserId;
    let testCategoriaId;
    let testTareaId;

    beforeAll(async () => {
        // Crear usuario de prueba
        const userResult = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id',
            ['testuser@example.com', 'password123']
        );
        testUserId = userResult.rows[0].id;

        // Obtener una categoría existente o crear una
        const categoriaResult = await pool.query(
            'SELECT id FROM categorias WHERE nombre = $1',
            ['Estudio']
        );
        if (categoriaResult.rows.length > 0) {
            testCategoriaId = categoriaResult.rows[0].id;
        } else {
            const newCategoria = await pool.query(
                'INSERT INTO categorias (nombre) VALUES ($1) RETURNING id',
                ['Estudio']
            );
            testCategoriaId = newCategoria.rows[0].id;
        }
    });

    afterAll(async () => {
        // Limpiar datos de prueba
        await pool.query('DELETE FROM tareas WHERE usuarios_id = $1', [testUserId]);
        await pool.query('DELETE FROM usuarios WHERE id = $1', [testUserId]);
        await pool.end();
    });

    test('POST /api/tasks - Debe crear una tarea con usuarios_id', async () => {
        const nuevaTarea = {
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            usuarios_id: testUserId
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(nuevaTarea)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('titulo', 'Tarea de prueba');
        expect(response.body).toHaveProperty('usuarios_id', testUserId);
        testTareaId = response.body.id;
    });

    test('POST /api/tasks - Debe crear una tarea con categoria_id', async () => {
        const nuevaTarea = {
            titulo: 'Tarea con categoría',
            descripcion: 'Descripción',
            usuarios_id: testUserId,
            categoria_id: testCategoriaId
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(nuevaTarea)
            .expect(201);

        expect(response.body).toHaveProperty('categoria_id', testCategoriaId);
        expect(response.body).toHaveProperty('categoria_nombre');
    });

    test('POST /api/tasks - Debe rechazar tarea sin usuarios_id', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .send({
                titulo: 'Tarea sin usuario',
                descripcion: 'Descripción'
            })
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    test('GET /api/tasks?usuario_id=X - Debe listar solo tareas del usuario', async () => {
        const response = await request(app)
            .get(`/api/tasks?usuario_id=${testUserId}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // Todas las tareas deben pertenecer al usuario
        response.body.forEach(tarea => {
            expect(tarea.usuarios_id).toBe(testUserId);
        });
    });

    test('GET /api/tasks?usuario_id=X&categoria_id=Y - Debe filtrar por categoría', async () => {
        const response = await request(app)
            .get(`/api/tasks?usuario_id=${testUserId}&categoria_id=${testCategoriaId}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(tarea => {
            if (tarea.categoria_id) {
                expect(tarea.categoria_id).toBe(testCategoriaId);
            }
        });
    });

    test('PUT /api/tasks/:id - Debe actualizar categoria_id de una tarea', async () => {
        if (!testTareaId) {
            // Crear una tarea si no existe
            const tarea = await pool.query(
                'INSERT INTO tareas (titulo, usuarios_id) VALUES ($1, $2) RETURNING id',
                ['Tarea para actualizar', testUserId]
            );
            testTareaId = tarea.rows[0].id;
        }

        const response = await request(app)
            .put(`/api/tasks/${testTareaId}`)
            .send({
                categoria_id: testCategoriaId
            })
            .expect(200);

        expect(response.body).toHaveProperty('categoria_id', testCategoriaId);
        expect(response.body).toHaveProperty('categoria_nombre');
    });

    test('GET /api/tasks - Debe incluir categoria_nombre en la respuesta', async () => {
        const response = await request(app)
            .get(`/api/tasks?usuario_id=${testUserId}`)
            .expect(200);

        // Si alguna tarea tiene categoria_id, debe tener categoria_nombre
        response.body.forEach(tarea => {
            if (tarea.categoria_id) {
                expect(tarea).toHaveProperty('categoria_nombre');
            }
        });
    });
});

