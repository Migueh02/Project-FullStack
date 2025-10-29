const express = require('express');
require('dontenv').config();
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Ruta Raiz
app.get("/", (req, res) => {
    res.send("Serviodr Node.js + Express + PostgresSQL");
});

// Importar y usar rutas de usuarios

// 1. importar el enrutador de usuarios
const rutas = require("./src/routes/index")
// 2. Usar el enrutadr de usuarios
app.use("/api", rutas);
// 3. App listen en el puerto definido
app.listen(PORT,() =>{
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})