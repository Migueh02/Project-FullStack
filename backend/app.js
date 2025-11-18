const express = require('express');
require('dotenv').config();
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Ruta Raiz
app.get("/", (req, res) => {
    res.send("Servidor Node.js + Express + PostgreSQL");
});

// Importar y usar rutas de usuarios

// 1. importar el enrutador de usuarios
const rutas = require("./src/routes/index")
// 2. Usar el enrutador de usuarios
app.use("/api", rutas);

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
    });
}

// Exportar app para tests
module.exports = app;