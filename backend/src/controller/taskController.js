// Controlador de tareas (CRUD)
const pool = require("../config/db");

// Listar tareas
const listarTarea = async (req, res) => {
    try {
        const { usuario_id, categoria_id } = req.query;
        
        let query = `
            SELECT 
                t.*,
                c.nombre as categoria_nombre,
                c.id as categoria_id
            FROM tareas t
            LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        // Filtrar por usuario_id (obligatorio para control de acceso)
        if (usuario_id) {
            query += ` AND t.usuarios_id = $${paramIndex}`;
            params.push(usuario_id);
            paramIndex++;
        }

        // Filtrar por categoria_id (opcional)
        if (categoria_id) {
            query += ` AND t.categoria_id = $${paramIndex}`;
            params.push(categoria_id);
            paramIndex++;
        }

        query += ` ORDER BY t.id DESC`;

        const result = await pool.query(query, params);
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Crear tarea
const crearTarea = async (req, res) => {
    try {
        console.log('POST /api/tasks body =>', req.body);
        const { titulo, descripcion, categoria_id, usuarios_id } = req.body || {};
        
        if (!titulo || typeof titulo !== "string") {
            return res.status(400).json({ error: "El campo 'titulo' es requerido y debe ser cadena." });
        }

        if (!usuarios_id) {
            return res.status(400).json({ error: "El campo 'usuarios_id' es requerido para crear una tarea." });
        }

        // Construir la consulta dinámicamente
        const fields = ['titulo', 'usuarios_id'];
        const values = [titulo, usuarios_id];
        let paramIndex = 3;

        if (descripcion !== undefined && descripcion !== null) {
            fields.push('descripcion');
            values.push(descripcion);
            paramIndex++;
        }

        if (categoria_id !== undefined && categoria_id !== null) {
            fields.push('categoria_id');
            values.push(categoria_id);
            paramIndex++;
        }

        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO tareas (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, values);

        // Obtener la categoría asociada si existe
        if (result.rows[0].categoria_id) {
            const categoriaResult = await pool.query(
                "SELECT id, nombre FROM categorias WHERE id = $1",
                [result.rows[0].categoria_id]
            );
            if (categoriaResult.rows.length > 0) {
                result.rows[0].categoria_nombre = categoriaResult.rows[0].nombre;
            }
        }

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        // Manejar errores de foreign key
        if (error.code === '23503') {
            return res.status(400).json({ error: "La categoría o usuario especificado no existe." });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Actualizar tarea por id
const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params || {};
        const { titulo, descripcion, categoria_id } = req.body || {};

        if (!id) {
            return res.status(400).json({ error: "El parámetro 'id' es requerido." });
        }

        // Construir dinámicamente la consulta según campos recibidos
        const fields = [];
        const values = [];
        let idx = 1;
        if (titulo !== undefined) {
            fields.push(`titulo = $${idx++}`);
            values.push(titulo);
        }
        if (descripcion !== undefined) {
            fields.push(`descripcion = $${idx++}`);
            values.push(descripcion);
        }
        if (categoria_id !== undefined) {
            fields.push(`categoria_id = $${idx++}`);
            values.push(categoria_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Se requiere al menos un campo para actualizar (titulo, descripcion o categoria_id)." });
        }

        // agregar id como último parámetro
        values.push(id);
        const query = `UPDATE tareas SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tarea no encontrada." });
        }

        // Obtener la categoría asociada si existe
        if (result.rows[0].categoria_id) {
            const categoriaResult = await pool.query(
                "SELECT id, nombre FROM categorias WHERE id = $1",
                [result.rows[0].categoria_id]
            );
            if (categoriaResult.rows.length > 0) {
                result.rows[0].categoria_nombre = categoriaResult.rows[0].nombre;
            }
        }

        return res.json(result.rows[0]);
    } catch (error) {
        // Manejar errores de foreign key
        if (error.code === '23503') {
            return res.status(400).json({ error: "La categoría especificada no existe." });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar tarea por id
const eliminarTarea = async (req, res) => {
    try {
        const { id } = req.params || {};
        if (!id) {
            return res.status(400).json({ error: "El parámetro 'id' es requerido." });
        }

        const result = await pool.query("DELETE FROM tareas WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tarea no encontrada." });
        }

        return res.json({ message: "Tarea eliminada.", tarea: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Export controlador de tareas
module.exports = {
    listarTarea,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
};

// Nota: SQL de creación de la tabla (ejecutar una vez en la BD si no existe):
/*
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT
);
*/

// Endpoints sugeridos para probar con Postman:
// GET    /api/tasks        -> listarTarea
// POST   /api/tasks        -> crearTarea (body: { titulo, descripcion })
// PUT    /api/tasks/:id    -> actualizarTarea (body: { titulo?, descripcion? })
// DELETE /api/tasks/:id    -> eliminarTarea