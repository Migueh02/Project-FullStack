const express = require('express');
const router = express.Router();
const { listarTarea, crearTarea, actualizarTarea, eliminarTarea } = require("../controller/taskController");

// Definir rutas para las tareas (plural: /tasks)
router.get('/tasks', listarTarea);
router.post('/tasks', crearTarea);
router.put('/tasks/:id', actualizarTarea);
router.delete('/tasks/:id', eliminarTarea);

module.exports = router;