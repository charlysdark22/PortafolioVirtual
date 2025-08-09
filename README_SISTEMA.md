# 🎯 TechSupport Pro - Sistema de Gestión de Ayuda Informática

## 📋 Descripción

Sistema completo de gestión de soporte técnico con página web pública para solicitar ayuda y panel de administración para gestionar tickets. Los mensajes se guardan automáticamente en una base de datos SQLite.

## ✨ Características

### 🌐 Página Pública (`/`)
- **Diseño Moderno**: Interfaz atractiva y profesional
- **Formulario de Soporte**: Los usuarios pueden crear tickets de ayuda técnica
- **Tipos de Problemas**: Categorías predefinidas (Hardware, Software, Red, etc.)
- **Modo Oscuro**: Toggle para cambiar entre tema claro y oscuro
- **Responsive**: Optimizado para móviles y tablets
- **Animaciones**: Efectos visuales suaves y profesionales

### 🔐 Panel de Administración (`/admin`)
- **Login Seguro**: Autenticación con JWT
- **Dashboard**: Estadísticas en tiempo real
- **Gestión de Tickets**: Ver, actualizar y eliminar tickets
- **Estados**: Pendiente, En Progreso, Resuelto
- **Filtros**: Por estado, fecha, etc.
- **Interfaz Intuitiva**: Fácil de usar y navegar

### 🗄️ Base de Datos
- **SQLite**: Base de datos ligera y eficiente
- **Tabla de Mensajes**: Almacena todos los tickets
- **Tabla de Admins**: Usuarios administradores
- **Timestamps**: Fechas de creación y actualización
- **Estados y Prioridades**: Sistema de clasificación

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
El archivo `.env` ya está configurado con valores por defecto:
```
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_12345
```

### 3. Iniciar el Servidor
```bash
npm start
```

### 4. Acceder al Sistema
- **Página Principal**: http://localhost:3000
- **Panel Admin**: http://localhost:3000/admin

### 5. Credenciales de Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 📂 Estructura de Archivos

```
/workspace/
├── server.js           # Servidor Express con API
├── package.json        # Dependencias del proyecto
├── .env               # Variables de entorno
├── index.html         # Página principal pública
├── admin.html         # Panel de administración
├── styles.css         # Estilos de la página principal
├── script.js          # JavaScript de la página principal
├── techsupport.db     # Base de datos SQLite (se crea automáticamente)
└── README_SISTEMA.md  # Este archivo
```

## 🛠️ API Endpoints

### Públicos
- `POST /api/messages` - Crear nuevo ticket de soporte

### Autenticación
- `POST /api/login` - Login de administrador

### Administración (requieren autenticación)
- `GET /api/messages` - Obtener todos los tickets
- `PUT /api/messages/:id` - Actualizar estado/prioridad de ticket
- `DELETE /api/messages/:id` - Eliminar ticket
- `GET /api/stats` - Estadísticas del dashboard

## 🎨 Características de Diseño

### Página Principal
- **Tema Dual**: Modo claro y oscuro
- **Navegación Fija**: Navbar que se adapta al scroll
- **Secciones**:
  - Hero con llamada a la acción
  - Servicios de soporte técnico
  - Portafolio de casos resueltos
  - Testimonios de clientes
  - Formulario de solicitud de ayuda
  - Footer con información de contacto

### Panel de Administración
- **Sidebar Navigation**: Navegación lateral intuitiva
- **Dashboard**: Métricas y tickets recientes
- **Gestión Completa**: CRUD de tickets
- **Estados Visuales**: Badges de colores para estados
- **Responsive**: Adaptado para móviles

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **SQLite3**: Base de datos
- **JWT**: Autenticación segura
- **bcrypt**: Encriptación de contraseñas
- **CORS**: Política de origen cruzado

### Frontend
- **HTML5 + CSS3**: Estructura y estilos
- **JavaScript ES6+**: Funcionalidad interactiva
- **Font Awesome**: Iconografía
- **Google Fonts (Inter)**: Tipografía moderna
- **CSS Grid/Flexbox**: Layout responsivo

## 📊 Funcionalidades del Sistema

### Para Usuarios (Clientes)
1. **Solicitar Ayuda**: Formulario categorizado por tipo de problema
2. **Seguimiento**: Reciben ID de ticket para seguimiento
3. **Información de Contacto**: Múltiples formas de comunicación

### Para Administradores
1. **Dashboard Completo**: Vista general del estado del soporte
2. **Gestión de Tickets**: 
   - Ver todos los tickets
   - Cambiar estados (Pendiente → En Progreso → Resuelto)
   - Asignar prioridades
   - Eliminar tickets obsoletos
3. **Estadísticas en Tiempo Real**:
   - Total de tickets
   - Tickets pendientes
   - Tickets en progreso
   - Tickets del día actual

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para el panel admin
- **Validación de Datos**: Sanitización en frontend y backend
- **Contraseñas Encriptadas**: bcrypt para hash de passwords
- **CORS Configurado**: Control de acceso de origen
- **Variables de Entorno**: Configuración segura

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Adaptación de grillas y espacios
- **Móvil**: 
  - Navegación adaptativa
  - Formularios touch-friendly
  - Tablas con scroll horizontal
  - Botones de tamaño adecuado

## 🎯 Casos de Uso

### Ejemplo de Flujo Completo:

1. **Cliente tiene problema**: PC no enciende
2. **Visita la web**: http://localhost:3000
3. **Completa formulario**: 
   - Nombre: Juan Pérez
   - Email: juan@email.com
   - Tipo: Hardware - PC no enciende
   - Descripción: Mi computadora no enciende desde ayer...
4. **Recibe confirmación**: "Ticket #123 creado exitosamente"
5. **Administrador revisa**: Panel admin → Tickets
6. **Cambia estado**: Pendiente → En Progreso → Resuelto
7. **Seguimiento**: Sistema mantiene historial completo

## 🚀 Próximas Mejoras Sugeridas

- [ ] Notificaciones por email automáticas
- [ ] Chat en vivo integrado
- [ ] Sistema de archivos adjuntos
- [ ] Reportes y analíticas avanzadas
- [ ] API para aplicaciones móviles
- [ ] Integración con sistemas de tickets externos
- [ ] Sistema de calificaciones post-resolución

## 🆘 Soporte

Para problemas técnicos o dudas sobre el sistema:
- **Email**: carlosaguilardark22@gmail.com
- **Teléfono**: +53 53932292

---

**¡Tu sistema de gestión de ayuda informática está listo para usar! 🎉**