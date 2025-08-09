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

    // Tabla de usuarios registrados
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de solicitudes de trabajo
    db.run(`CREATE TABLE IF NOT EXISTS job_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        budget_range TEXT,
        deadline TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
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

// Registro de usuarios
app.post('/api/register', async (req, res) => {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Nombre, email y contraseña son obligatorios' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const stmt = db.prepare(`INSERT INTO users (name, email, password, phone, company) VALUES (?, ?, ?, ?, ?)`);
        stmt.run([name, email, hashedPassword, phone || null, company || null], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ 
                        success: false, 
                        message: 'El email ya está registrado' 
                    });
                }
                console.error('Error registrando usuario:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error interno del servidor' 
                });
            }

            const token = jwt.sign({ id: this.lastID, email, name }, JWT_SECRET);
            res.json({ 
                success: true, 
                message: 'Usuario registrado correctamente',
                user: { id: this.lastID, name, email, phone, company },
                token
            });
        });
        stmt.finalize();
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Login de usuarios
app.post('/api/user-login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email y contraseña son obligatorios' 
        });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
        res.json({ 
            success: true, 
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                company: user.company 
            }
        });
    });
});

// Middleware para autenticar usuarios normales
function authenticateUser(req, res, next) {
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

// Crear solicitud de trabajo
app.post('/api/job-requests', authenticateUser, (req, res) => {
    const { project_type, title, description, budget_range, deadline } = req.body;
    const user_id = req.user.id;

    if (!project_type || !title || !description) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tipo de proyecto, título y descripción son obligatorios' 
        });
    }

    const stmt = db.prepare(`
        INSERT INTO job_requests (user_id, project_type, title, description, budget_range, deadline) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([user_id, project_type, title, description, budget_range || null, deadline || null], function(err) {
        if (err) {
            console.error('Error creando solicitud:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Solicitud de trabajo enviada correctamente',
            request_id: this.lastID
        });
    });
    stmt.finalize();
});

// Obtener solicitudes de trabajo del usuario
app.get('/api/my-requests', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    db.all(`
        SELECT jr.*, u.name as user_name, u.email as user_email 
        FROM job_requests jr 
        JOIN users u ON jr.user_id = u.id 
        WHERE jr.user_id = ? 
        ORDER BY jr.created_at DESC
    `, [user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        res.json({ success: true, requests: rows });
    });
});

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

// Obtener todas las solicitudes de trabajo (admin)
app.get('/api/job-requests', authenticateToken, (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
        SELECT jr.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.company as user_company
        FROM job_requests jr 
        JOIN users u ON jr.user_id = u.id
    `;
    let params = [];

    if (status) {
        query += ' WHERE jr.status = ?';
        params.push(status);
    }

    query += ' ORDER BY jr.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        res.json({ success: true, job_requests: rows });
    });
});

// Actualizar estado de solicitud de trabajo
app.put('/api/job-requests/:id', authenticateToken, (req, res) => {
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

    const query = `UPDATE job_requests SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }

        res.json({ success: true, message: 'Solicitud actualizada correctamente' });
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

        // Contar solicitudes de trabajo por estado
        db.all(`SELECT status, COUNT(*) as count FROM job_requests GROUP BY status`, (err, jobStatusCounts) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error del servidor' });
            }

            stats.jobsByStatus = jobStatusCounts.reduce((acc, row) => {
                acc[row.status] = row.count;
                return acc;
            }, {});

            // Contar mensajes de hoy
            db.get(`SELECT COUNT(*) as count FROM messages WHERE date(created_at) = date('now')`, (err, todayCount) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error del servidor' });
                }

                stats.today = todayCount.count;

                // Contar solicitudes de trabajo de hoy
                db.get(`SELECT COUNT(*) as count FROM job_requests WHERE date(created_at) = date('now')`, (err, todayJobsCount) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Error del servidor' });
                    }

                    stats.todayJobs = todayJobsCount.count;

                    // Total de mensajes
                    db.get(`SELECT COUNT(*) as count FROM messages`, (err, totalCount) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Error del servidor' });
                        }

                        stats.total = totalCount.count;

                        // Total de solicitudes de trabajo
                        db.get(`SELECT COUNT(*) as count FROM job_requests`, (err, totalJobsCount) => {
                            if (err) {
                                return res.status(500).json({ success: false, message: 'Error del servidor' });
                            }

                            stats.totalJobs = totalJobsCount.count;

                            // Total de usuarios registrados
                            db.get(`SELECT COUNT(*) as count FROM users`, (err, totalUsersCount) => {
                                if (err) {
                                    return res.status(500).json({ success: false, message: 'Error del servidor' });
                                }

                                stats.totalUsers = totalUsersCount.count;
                                res.json({ success: true, stats });
                            });
                        });
                    });
                });
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