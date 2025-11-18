const express = require('express');
const router = express.Router();
const { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = require("../controller/categoriaController");

// Definir rutas para las categorías
router.get('/categorias', listarCategorias);
router.post('/categorias', crearCategoria);
router.put('/categorias/:id', actualizarCategoria);
router.delete('/categorias/:id', eliminarCategoria);

module.exports = router;

