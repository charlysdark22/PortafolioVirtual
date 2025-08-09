# ScholarHub 📚

**ScholarHub** es una plataforma web moderna y completa para la gestión de publicaciones académicas, diseñada para investigadores, autores y administradores de instituciones educativas.

## 🚀 Características Principales

### 📝 **Gestión de Artículos**
- **Editor Avanzado**: Editor de texto enriquecido con Quill.js que soporta formato completo, imágenes, tablas y fórmulas
- **Vista Previa en Tiempo Real**: Visualización inmediata del artículo mientras se edita
- **Auto-guardado**: Guardado automático cada 30 segundos para evitar pérdida de datos
- **Gestión de Co-autores**: Soporte para múltiples autores y colaboradores
- **Metadatos Completos**: DOI, revista, conferencia, palabras clave y categorías

### 🔍 **Búsqueda Avanzada**
- **Filtros Múltiples**: Por autor, institución, rango temporal, categorías y palabras clave
- **Ordenamiento Flexible**: Por relevancia, fecha, vistas o descargas
- **Vistas Adaptables**: Lista detallada o grilla de tarjetas
- **Búsqueda en Tiempo Real**: Resultados instantáneos mientras escribes

### 👥 **Sistema de Usuarios**
- **Autenticación Segura**: Login con validación JWT y roles diferenciados
- **Perfiles Completos**: Biografía, institución, redes sociales y estadísticas
- **Roles y Permisos**: Autores, administradores con funcionalidades específicas
- **Configuración de Privacidad**: Control total sobre la visibilidad del perfil

### 📊 **Dashboard de Administración**
- **Gestión de Usuarios**: Activar, suspender, promover usuarios
- **Moderación de Contenido**: Aprobar o rechazar artículos pendientes
- **Analíticas Avanzadas**: Gráficos de crecimiento, distribución por categorías
- **Estadísticas en Tiempo Real**: Métricas de usuarios, artículos y engagement

### 📤 **Exportación y Compartir**
- **Exportación a PDF**: Formato académico profesional con metadatos
- **Exportación a Word**: Documentos .docx editables manteniendo formato
- **Citas Académicas**: Generación automática en formato APA y BibTeX
- **Compartir en Redes**: Integración con Twitter, LinkedIn, Facebook y email

### 💬 **Sistema de Comentarios**
- **Discusión por Pares**: Comentarios anidados con respuestas
- **Sistema de Reacciones**: Like/dislike en comentarios
- **Moderación**: Reportar contenido inapropiado
- **Notificaciones**: Alertas en tiempo real para nuevos comentarios

### ⭐ **Funcionalidades Adicionales**
- **Sistema de Favoritos**: Guardar artículos para leer más tarde
- **Notificaciones**: Configurables por email y push
- **Tema Oscuro/Claro**: Modo de lectura personalizable
- **Responsive Design**: Optimizado para desktop, tablet y móvil

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** con TypeScript para type safety
- **Redux Toolkit** para gestión de estado global
- **React Router v6** para navegación SPA
- **Tailwind CSS** para styling responsive y moderno
- **React Hook Form + Yup** para formularios con validación
- **Quill.js** para editor de texto enriquecido
- **Recharts** para gráficos y analíticas
- **Lucide React** para iconografía consistente

### **Herramientas de Desarrollo**
- **Create React App** como base del proyecto
- **TypeScript** para tipado estático
- **ESLint + Prettier** para calidad de código
- **Headless UI** para componentes accesibles

### **Librerías de Exportación**
- **jsPDF** para generación de documentos PDF
- **docx** para creación de documentos Word
- **file-saver** para descarga de archivos
- **date-fns** para manejo de fechas

## 📁 Estructura del Proyecto

```
scholarhub/
├── public/                 # Archivos públicos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Auth/          # Componentes de autenticación
│   │   ├── Layout/        # Layouts principales
│   │   └── UI/            # Componentes de interfaz
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas principales
│   │   ├── Admin/         # Páginas de administración
│   │   ├── Articles/      # Gestión de artículos
│   │   └── Auth/          # Autenticación
│   ├── store/             # Redux store y slices
│   │   └── slices/        # Redux slices
│   ├── types/             # Definiciones de tipos TypeScript
│   └── utils/             # Utilidades y helpers
├── package.json           # Dependencias y scripts
└── tailwind.config.js     # Configuración de Tailwind
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js (versión 16 o superior)
- npm o yarn
- Git

### **Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/scholarhub.git
cd scholarhub
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```
*Nota: Se usa `--legacy-peer-deps` para resolver conflictos de peer dependencies con React 19.*

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Iniciar servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### **Scripts Disponibles**

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar pruebas
npm run lint       # Análisis de código con ESLint
npm run format     # Formatear código con Prettier
```

## 👤 Usuarios de Demostración

La aplicación incluye usuarios de demostración para testing:

### **Demo Autor**
- **Email**: `autor@scholarhub.com`
- **Contraseña**: `password123`
- **Rol**: Autor/Investigador

### **Demo Admin**
- **Email**: `admin@scholarhub.com`
- **Contraseña**: `admin123`
- **Rol**: Administrador

## 📊 Funcionalidades por Rol

### **👨‍🎓 Autores/Investigadores**
- ✅ Crear y editar artículos
- ✅ Buscar y leer publicaciones
- ✅ Gestionar perfil personal
- ✅ Comentar en artículos
- ✅ Exportar contenido
- ✅ Gestionar favoritos
- ✅ Configurar notificaciones

### **👨‍💼 Administradores**
- ✅ Todas las funcionalidades de autor
- ✅ Panel de administración completo
- ✅ Gestión de usuarios (activar/suspender/promover)
- ✅ Moderación de contenido
- ✅ Analíticas y estadísticas
- ✅ Configuración de la plataforma

## 🎨 Características de UI/UX

### **Diseño Moderno**
- Interfaz limpia y profesional
- Paleta de colores académica (azules y acentos)
- Tipografía legible (Inter + JetBrains Mono)
- Animaciones suaves y feedback visual

### **Responsive Design**
- Optimizado para desktop (1024px+)
- Tablet-friendly (768px-1023px)
- Mobile-first approach (320px+)

### **Accesibilidad**
- Navegación por teclado
- Alto contraste para legibilidad
- Etiquetas ARIA para screen readers
- Focus indicators visibles

## 🔧 Configuración Avanzada

### **Personalización de Tema**
Edita `tailwind.config.js` para personalizar colores, fuentes y breakpoints:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* tus colores primarios */ },
        secondary: { /* tus colores secundarios */ }
      }
    }
  }
}
```

### **Variables de Entorno**
```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=ScholarHub
REACT_APP_VERSION=1.0.0
```

## 📝 Estado de Desarrollo

### **✅ Completado**
- [x] Autenticación y autorización
- [x] Editor de artículos con Quill.js
- [x] Sistema de búsqueda avanzada
- [x] Dashboard de administración
- [x] Exportación PDF/Word
- [x] Sistema de comentarios
- [x] Gestión de favoritos
- [x] Perfiles de usuario
- [x] Notificaciones
- [x] Responsive design

### **🚧 Roadmap Futuro**
- [ ] API Backend con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación OAuth (Google, ORCID)
- [ ] Integración con APIs académicas
- [ ] Sistema de revisión por pares
- [ ] Chat en tiempo real
- [ ] PWA capabilities
- [ ] Tests automatizados

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu.email@ejemplo.com
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- Comunidad React por las excelentes herramientas
- Tailwind CSS por el framework de styling
- Lucide por los iconos de alta calidad
- Quill.js por el editor de texto robusto

---

**ScholarHub** - *Transformando la forma en que compartimos conocimiento académico* 🎓✨
