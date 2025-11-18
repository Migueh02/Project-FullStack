// Controlador de categorías (CRUD)
const pool = require("../config/db");

// Listar categorías
const listarCategorias = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categorias ORDER BY id ASC");
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Crear categoría
const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body || {};
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ error: "El campo 'nombre' es requerido y debe ser una cadena no vacía." });
        }

        const result = await pool.query(
            "INSERT INTO categorias (nombre) VALUES ($1) RETURNING *",
            [nombre.trim()]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        // Manejar error de duplicado si hay constraint unique
        if (error.code === '23505') {
            return res.status(400).json({ error: "Ya existe una categoría con ese nombre." });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Actualizar categoría por id
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params || {};
        const { nombre } = req.body || {};

        if (!id) {
            return res.status(400).json({ error: "El parámetro 'id' es requerido." });
        }

        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ error: "El campo 'nombre' es requerido y debe ser una cadena no vacía." });
        }

        const result = await pool.query(
            "UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *",
            [nombre.trim(), id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Categoría no encontrada." });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        // Manejar error de duplicado si hay constraint unique
        if (error.code === '23505') {
            return res.status(400).json({ error: "Ya existe una categoría con ese nombre." });
        }
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar categoría por id
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params || {};
        if (!id) {
            return res.status(400).json({ error: "El parámetro 'id' es requerido." });
        }

        // Verificar si hay tareas usando esta categoría
        const tareasConCategoria = await pool.query(
            "SELECT COUNT(*) as count FROM tareas WHERE categoria_id = $1",
            [id]
        );

        if (parseInt(tareasConCategoria.rows[0].count) > 0) {
            return res.status(400).json({ 
                error: "No se puede eliminar la categoría porque hay tareas que la están usando." 
            });
        }

        const result = await pool.query("DELETE FROM categorias WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Categoría no encontrada." });
        }

        return res.json({ message: "Categoría eliminada.", categoria: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Export controlador de categorías
module.exports = {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
};

