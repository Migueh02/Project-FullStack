const express = require('express');
const routes = express.Router();
const {listarTarea, crearTarea, actualizarTarea, eliminarTarea} = require("../controller/taskController")

// Definir rutas para las tareas
// Rutas para el GET
router.get("/task", listarTarea);
// Rutas para el POST
router.post("/task", crearTarea);

router.put("/task/:id", actualizarTarea);

router.delete("/task/:id", eliminarTarea)

module.exports = router;