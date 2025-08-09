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

    // Tabla de usuarios registrados (expandida)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        position TEXT,
        website TEXT,
        country TEXT,
        city TEXT,
        address TEXT,
        avatar_url TEXT,
        bio TEXT,
        preferences TEXT,
        is_verified BOOLEAN DEFAULT 0,
        verification_token TEXT,
        reset_token TEXT,
        reset_expires DATETIME,
        last_login DATETIME,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        admin_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Tabla de notificaciones
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read BOOLEAN DEFAULT 0,
        related_id INTEGER,
        related_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Tabla de historial de servicios
    db.run(`CREATE TABLE IF NOT EXISTS service_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'completed',
        start_date DATETIME,
        end_date DATETIME,
        amount DECIMAL(10,2),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Tabla de archivos adjuntos
    db.run(`CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        request_id INTEGER,
        request_type TEXT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        file_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    const { 
        name, 
        email, 
        password, 
        confirm_password,
        phone, 
        company, 
        position, 
        website, 
        country, 
        city, 
        bio,
        terms,
        newsletter 
    } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password || !confirm_password || !terms) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos marcados con * son obligatorios' 
        });
    }

    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Las contraseñas no coinciden' 
        });
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 8 caracteres' 
        });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Formato de email inválido' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear token de verificación
        const verificationToken = require('crypto').randomBytes(32).toString('hex');
        
        // Preparar preferencias
        const preferences = JSON.stringify({
            newsletter: newsletter === 'on' || newsletter === true,
            notifications: true,
            theme: 'light'
        });
        
        const stmt = db.prepare(`
            INSERT INTO users (
                name, email, password, phone, company, position, website, 
                country, city, bio, preferences, verification_token
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            name, email, hashedPassword, phone || null, company || null,
            position || null, website || null, country || null, city || null,
            bio || null, preferences, verificationToken
        ], function(err) {
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

            // Crear notificación de bienvenida
            db.run(
                'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                [
                    this.lastID,
                    '¡Bienvenido a TechSupport Pro!',
                    'Tu cuenta ha sido creada exitosamente. Ya puedes comenzar a solicitar proyectos.',
                    'success'
                ]
            );

            const token = jwt.sign({ id: this.lastID, email, name }, JWT_SECRET);
            res.json({ 
                success: true, 
                message: 'Usuario registrado correctamente',
                user: { 
                    id: this.lastID, 
                    name, 
                    email, 
                    phone, 
                    company,
                    position,
                    website,
                    country,
                    city,
                    bio
                },
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

// Obtener estadísticas del dashboard del usuario
app.get('/api/user-dashboard', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    db.get('SELECT COUNT(*) as total FROM job_requests WHERE user_id = ?', [user_id], (err, totalResult) => {
        if (err) {
            console.error('Error fetching total requests:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        db.get('SELECT COUNT(*) as pending FROM job_requests WHERE user_id = ? AND status = "pending"', [user_id], (err, pendingResult) => {
            if (err) {
                console.error('Error fetching pending requests:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            db.get('SELECT COUNT(*) as completed FROM job_requests WHERE user_id = ? AND status = "completed"', [user_id], (err, completedResult) => {
                if (err) {
                    console.error('Error fetching completed requests:', err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                
                db.get('SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0', [user_id], (err, unreadResult) => {
                    if (err) {
                        console.error('Error fetching unread notifications:', err);
                        return res.status(500).json({ error: 'Error interno del servidor' });
                    }
                    
                    res.json({
                        total: totalResult.total,
                        pending: pendingResult.pending,
                        completed: completedResult.completed,
                        unread: unreadResult.unread
                    });
                });
            });
        });
    });
});

// Obtener perfil del usuario
app.get('/api/user-profile', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    db.get('SELECT id, name, email, phone, company, position, website, country, city, bio, avatar_url, preferences FROM users WHERE id = ?', [user_id], (err, user) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Parsear preferencias
        if (user.preferences) {
            user.preferences = JSON.parse(user.preferences);
        }
        
        res.json(user);
    });
});

// Actualizar perfil del usuario
app.put('/api/user-profile', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    const { name, phone, company, position, website, country, city, bio } = req.body;
    
    db.run(`
        UPDATE users 
        SET name = ?, phone = ?, company = ?, position = ?, website = ?, 
            country = ?, city = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [name, phone, company, position, website, country, city, bio, user_id], function(err) {
        if (err) {
            console.error('Error updating user profile:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ message: 'Perfil actualizado correctamente' });
    });
});

// Obtener notificaciones del usuario
app.get('/api/notifications', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [user_id], (err, notifications) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(notifications);
    });
});

// Marcar notificación como leída
app.put('/api/notifications/:id/read', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    const notification_id = req.params.id;
    
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notification_id, user_id], function(err) {
        if (err) {
            console.error('Error marking notification as read:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ message: 'Notificación marcada como leída' });
    });
});

// Marcar todas las notificaciones como leídas
app.put('/api/notifications/mark-all-read', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user_id], function(err) {
        if (err) {
            console.error('Error marking all notifications as read:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    });
});

// Obtener actividad reciente del usuario
app.get('/api/user-activity', authenticateUser, (req, res) => {
    const user_id = req.user.id;
    
    // Combinar actividad de solicitudes y notificaciones
    db.all(`
        SELECT 
            'request' as type,
            id,
            title as activity_title,
            created_at,
            status
        FROM job_requests 
        WHERE user_id = ?
        UNION ALL
        SELECT 
            'notification' as type,
            id,
            title as activity_title,
            created_at,
            type as status
        FROM notifications 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
    `, [user_id, user_id], (err, activity) => {
        if (err) {
            console.error('Error fetching user activity:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(activity);
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