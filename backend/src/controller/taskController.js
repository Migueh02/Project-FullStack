// Controlador de tareas (CRUD)
const pool = require("../config/db");

// Listar tareas
const listarTarea = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tareas ORDER BY id DESC");
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Crear tarea
const crearTarea = async (req, res) => {
    try {
        console.log('POST /api/tasks body =>', req.body);
        const { titulo, descripcion } = req.body || {};
        if (!titulo || typeof titulo !== "string") {
            return res.status(400).json({ error: "El campo 'titulo' es requerido y debe ser cadena." });
        }

        const result = await pool.query(
            "INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *",
            [titulo, descripcion || null]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Actualizar tarea por id
const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params || {};
        const { titulo, descripcion } = req.body || {};

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

        if (fields.length === 0) {
            return res.status(400).json({ error: "Se requiere al menos un campo para actualizar (titulo o descripcion)." });
        }

        // agregar id como último parámetro
        values.push(id);
        const query = `UPDATE tareas SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Tarea no encontrada." });
        }

        return res.json(result.rows[0]);
    } catch (error) {
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