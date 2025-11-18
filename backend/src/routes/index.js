const express = require('express');
const router = express.Router();
const { listarTarea, crearTarea, actualizarTarea, eliminarTarea } = require("../controller/taskController");
const categoriaRoutes = require("./categoriaRoutes");
const authRoutes = require("./authRoutes");

// Definir rutas para las tareas (plural: /tasks)
router.get('/tasks', listarTarea);
router.post('/tasks', crearTarea);
router.put('/tasks/:id', actualizarTarea);
router.delete('/tasks/:id', eliminarTarea);

// Usar rutas de categorías
router.use(categoriaRoutes);

// Usar rutas de autenticación
router.use(authRoutes);

module.exports = router;