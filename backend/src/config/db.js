
const { Pool } = require("pg");
require("dotenv").config();

// Support either a full DATABASE_URL (used in docker-compose) or individual DB_* vars
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
    ? new Pool({ connectionString })
    : new Pool({
            user: process.env.DB_USER || "postgres",
            host: process.env.DB_HOST || "localhost",
            database: process.env.DB_NAME || "taskhub_db",
            password: process.env.DB_PASSWORD || "postgres",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        });

pool.connect()
    .then(() => console.log("Conectado a PostgresSQL"))
    .catch((err) => console.error("Error al conectar con la base de datos", err.message));

module.exports = pool;