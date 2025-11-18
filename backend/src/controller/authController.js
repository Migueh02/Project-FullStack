// Controlador de autenticación
const pool = require("../config/db");

// Registro de usuario
const register = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        
        if (!email || typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({ 
                success: false,
                error: "El campo 'email' es requerido." 
            });
        }
        
        if (!password || typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ 
                success: false,
                error: "El campo 'password' es requerido." 
            });
        }

        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ 
                success: false,
                error: "El formato del email no es válido." 
            });
        }

        // Validar longitud de password (mínimo 6 caracteres)
        if (password.trim().length < 6) {
            return res.status(400).json({ 
                success: false,
                error: "La contraseña debe tener al menos 6 caracteres." 
            });
        }

        // Verificar si el email ya existe
        const existingUser = await pool.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [email.trim().toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                error: "El email ya está registrado." 
            });
        }

        // Crear nuevo usuario
        // Nota: En producción, el password debería estar hasheado (bcrypt)
        const result = await pool.query(
            "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email",
            [email.trim().toLowerCase(), password.trim()]
        );

        const newUser = result.rows[0];
        return res.status(201).json({ 
            success: true, 
            userId: newUser.id,
            email: newUser.email,
            message: "Usuario registrado exitosamente"
        });
    } catch (error) {
        // Manejar error de constraint único (por si acaso)
        if (error.code === '23505') {
            return res.status(400).json({ 
                success: false,
                error: "El email ya está registrado." 
            });
        }
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Login de usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        
        if (!email || typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({ 
                success: false,
                error: "El campo 'email' es requerido." 
            });
        }
        
        if (!password || typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ 
                success: false,
                error: "El campo 'password' es requerido." 
            });
        }

        // Buscar usuario por email y password
        // Nota: En producción, el password debería estar hasheado (bcrypt)
        const result = await pool.query(
            "SELECT id, email FROM usuarios WHERE email = $1 AND password = $2",
            [email.trim().toLowerCase(), password.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: "Credenciales inválidas." 
            });
        }

        const user = result.rows[0];
        return res.json({ 
            success: true, 
            userId: user.id,
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Export controlador de autenticación
module.exports = {
    register,
    login,
};

