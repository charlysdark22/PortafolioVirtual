const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Inicializar base de datos SQLite
const db = new sqlite3.Database('./techsupport.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        initializeDatabase();
    }
});

// Crear tablas si no existen
function initializeDatabase() {
    // Tabla de mensajes/tickets
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de usuarios admin (para panel de administración)
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Crear usuario admin por defecto
    createDefaultAdmin();
}

// Crear usuario admin por defecto
async function createDefaultAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, 
        ['admin', hashedPassword], 
        function(err) {
            if (err) {
                console.error('Error creando admin:', err.message);
            } else {
                console.log('👤 Usuario admin creado (username: admin, password: admin123)');
            }
        }
    );
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// RUTAS API

// Enviar mensaje/ticket
app.post('/api/messages', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son obligatorios' 
        });
    }

    const stmt = db.prepare(`INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`);
    stmt.run([name, email, subject, message], function(err) {
        if (err) {
            console.error('Error guardando mensaje:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Mensaje enviado correctamente',
            ticket_id: this.lastID
        });
    });
    stmt.finalize();
});

// Login admin
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ success: true, token });
    });
});

// Obtener todos los mensajes (requiere autenticación)
app.get('/api/messages', authenticateToken, (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM messages';
    let params = [];

    if (status) {
        query += ' WHERE status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        res.json({ success: true, messages: rows });
    });
});

// Actualizar estado de mensaje
app.put('/api/messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body;

    const updates = [];
    const params = [];

    if (status) {
        updates.push('status = ?');
        params.push(status);
    }
    if (priority) {
        updates.push('priority = ?');
        params.push(priority);
    }

    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE messages SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
        }

        res.json({ success: true, message: 'Mensaje actualizado correctamente' });
    });
});

// Eliminar mensaje
app.delete('/api/messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
        }

        res.json({ success: true, message: 'Mensaje eliminado correctamente' });
    });
});

// Estadísticas del dashboard
app.get('/api/stats', authenticateToken, (req, res) => {
    const stats = {};

    // Contar mensajes por estado
    db.all(`SELECT status, COUNT(*) as count FROM messages GROUP BY status`, (err, statusCounts) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }

        stats.byStatus = statusCounts.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
        }, {});

        // Contar mensajes de hoy
        db.get(`SELECT COUNT(*) as count FROM messages WHERE date(created_at) = date('now')`, (err, todayCount) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error del servidor' });
            }

            stats.today = todayCount.count;

            // Total de mensajes
            db.get(`SELECT COUNT(*) as count FROM messages`, (err, totalCount) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error del servidor' });
                }

                stats.total = totalCount.count;
                res.json({ success: true, stats });
            });
        });
    });
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Panel de administración: http://localhost:${PORT}/admin`);
});