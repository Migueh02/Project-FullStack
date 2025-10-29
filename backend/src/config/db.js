
const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    
});

pool.connect()

    .then(() => console.log('Conectado a PostgresSQL'))
    .catch(() => console.log('Error al conectar con la base de datos', err));

module.exports = pool;