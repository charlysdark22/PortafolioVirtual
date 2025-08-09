// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Add reveal classes to elements that should animate with staggered timing
const revealElements = document.querySelectorAll('.service-card, .skill-item, .stat-item, .contact-item, .portfolio-item, .testimonial-card');
revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    if (index % 4 === 0) el.classList.add('stagger-1');
    else if (index % 4 === 1) el.classList.add('stagger-2');
    else if (index % 4 === 2) el.classList.add('stagger-3');
    else el.classList.add('stagger-4');
    observer.observe(el);
});

// Enhanced animations for different elements
const leftRevealElements = document.querySelectorAll('.about-text');
leftRevealElements.forEach(el => {
    el.classList.add('reveal-left');
    observer.observe(el);
});

const rightRevealElements = document.querySelectorAll('.about-stats');
rightRevealElements.forEach(el => {
    el.classList.add('reveal-right');
    observer.observe(el);
});

const scaleRevealElements = document.querySelectorAll('.section-header');
scaleRevealElements.forEach(el => {
    el.classList.add('reveal-scale');
    observer.observe(el);
});

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.style.width;
            skillBar.style.width = '0%';
            setTimeout(() => {
                skillBar.style.width = width;
            }, 200);
            skillObserver.unobserve(skillBar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Enhanced Form handling with API integration
const supportForm = document.getElementById('support-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(supportForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
        showFormStatus('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Show loading state
    setFormLoading(true);
    
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormStatus(`¡Ticket creado exitosamente! ID: #${result.ticket_id}. Te contactaremos pronto.`, 'success');
            supportForm.reset();
        } else {
            showFormStatus(result.message || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormStatus('Error de conexión. Por favor, intenta de nuevo.', 'error');
    } finally {
        setFormLoading(false);
    }
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

function setFormLoading(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    if (loading) {
        btnText.textContent = 'Enviando...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;
    } else {
        btnText.textContent = 'Crear Ticket de Soporte';
        btnIcon.className = 'fas fa-headset';
        submitBtn.disabled = false;
}

// Floating animation for hero card
const floatingCard = document.querySelector('.floating-card');
if (floatingCard) {
    let mouseX = 0;
    let mouseY = 0;
    let cardX = 0;
    let cardY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCard() {
        const distX = mouseX - cardX;
        const distY = mouseY - cardY;
        
        cardX += distX * 0.1;
        cardY += distY * 0.1;
        
        if (floatingCard.getBoundingClientRect().top < window.innerHeight && 
            floatingCard.getBoundingClientRect().bottom > 0) {
            floatingCard.style.transform = `translate(${distX * 0.01}px, ${distY * 0.01}px)`;
        }
        
        requestAnimationFrame(animateCard);
    }
    
    animateCard();
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const parallax = scrolled * 0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${parallax}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroImage.style.transition = 'all 0.8s ease-out';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 600);
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    body.loaded {
        overflow-x: hidden;
    }
`;
document.head.appendChild(style);

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in effect to page elements
    const elements = document.querySelectorAll('.hero-content, .hero-image, .section-header, .service-card, .about-content, .contact-content');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add cursor trail effect
const cursorTrail = [];
const trailLength = 20;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY });
    
    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// Create trailing dots
for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.cssText = `
        position: fixed;
        width: ${4 - i * 0.1}px;
        height: ${4 - i * 0.1}px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - i * 0.05};
        transition: all 0.1s ease-out;
    `;
    document.body.appendChild(dot);
}

// Animate cursor trail
function animateCursorTrail() {
    const dots = document.querySelectorAll('.cursor-dot');
    
    dots.forEach((dot, index) => {
        if (cursorTrail[cursorTrail.length - 1 - index]) {
            const pos = cursorTrail[cursorTrail.length - 1 - index];
            dot.style.left = pos.x + 'px';
            dot.style.top = pos.y + 'px';
        }
    });
    
    requestAnimationFrame(animateCursorTrail);
}

animateCursorTrail();

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Update icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Initialize icon
updateThemeIcon(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add a nice animation effect
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
});

// Lazy Loading for Images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Performance optimizations
// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll listener
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

// Replace the existing scroll listener
window.removeEventListener('scroll', () => {});
window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
preloadCriticalResources();

// User Authentication System
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let userToken = localStorage.getItem('userToken');

// Initialize user interface
updateUserInterface();

// Auth tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;
        switchAuthTab(tabType);
    });
});

function switchAuthTab(tabType) {
    // Update active tab
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabType);
    });
    
    // Show/hide forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tabType === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// User authentication handlers
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    
    try {
        setFormLoading('login', true);
        const response = await fetch('/api/user-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            userToken = result.token;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('userToken', userToken);
            
            showFormStatus('login-status', '¡Bienvenido! Redirigiendo...', 'success');
            updateUserInterface();
            setTimeout(() => showProjectForm(), 1000);
        } else {
            showFormStatus('login-status', result.message, 'error');
        }
    } catch (error) {
        showFormStatus('login-status', 'Error de conexión', 'error');
    } finally {
        setFormLoading('login', false);
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    try {
        setFormLoading('register', true);
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            userToken = result.token;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('userToken', userToken);
            
            showFormStatus('register-status', '¡Cuenta creada! Bienvenido...', 'success');
            updateUserInterface();
            setTimeout(() => showProjectForm(), 1000);
        } else {
            showFormStatus('register-status', result.message, 'error');
        }
    } catch (error) {
        showFormStatus('register-status', 'Error de conexión', 'error');
    } finally {
        setFormLoading('register', false);
    }
});

// Project form handler
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const projectData = Object.fromEntries(formData);
    
    try {
        setFormLoading('project', true);
        const response = await fetch('/api/job-requests', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(projectData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormStatus('project-status', `¡Solicitud enviada! ID: #${result.request_id}`, 'success');
            document.getElementById('project-form').reset();
            setTimeout(() => showMyProjects(), 2000);
        } else {
            showFormStatus('project-status', result.message, 'error');
        }
    } catch (error) {
        showFormStatus('project-status', 'Error de conexión', 'error');
    } finally {
        setFormLoading('project', false);
    }
});

// Navigation event handlers
document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('solicitar-trabajo').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('register-btn').addEventListener('click', () => {
    switchAuthTab('register');
    document.getElementById('solicitar-trabajo').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
});

document.getElementById('my-projects-btn').addEventListener('click', () => {
    showMyProjects();
    document.getElementById('solicitar-trabajo').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('new-project-btn').addEventListener('click', () => {
    showProjectForm();
    document.getElementById('solicitar-trabajo').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('new-project-btn-main').addEventListener('click', () => {
    showProjectForm();
});

// Utility functions
function updateUserInterface() {
    const userActions = document.getElementById('user-actions');
    const userMenu = document.getElementById('user-menu');
    
    if (currentUser) {
        userActions.classList.add('hidden');
        userMenu.classList.remove('hidden');
        
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        
        showProjectForm();
    } else {
        userActions.classList.remove('hidden');
        userMenu.classList.add('hidden');
        
        showAuthSection();
    }
}

function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('project-form-section').classList.add('hidden');
    document.getElementById('my-projects-section').classList.add('hidden');
}

function showProjectForm() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('project-form-section').classList.remove('hidden');
    document.getElementById('my-projects-section').classList.add('hidden');
}

async function showMyProjects() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('project-form-section').classList.add('hidden');
    document.getElementById('my-projects-section').classList.remove('hidden');
    
    await loadUserProjects();
}

async function loadUserProjects() {
    try {
        document.getElementById('projects-loading').style.display = 'flex';
        const response = await fetch('/api/my-requests', {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayUserProjects(result.requests);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    } finally {
        document.getElementById('projects-loading').style.display = 'none';
    }
}

function displayUserProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    const loading = document.getElementById('projects-loading');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No tienes proyectos aún. ¡Crea tu primer proyecto!</p>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => {
        const createdAt = new Date(project.created_at).toLocaleDateString('es-ES');
        const deadline = project.deadline ? new Date(project.deadline).toLocaleDateString('es-ES') : 'No especificada';
        
        return `
            <div class="project-card-user">
                <div class="project-header">
                    <div>
                        <div class="project-title">${project.title}</div>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <span class="project-type">${getProjectTypeText(project.project_type)}</span>
                            <span class="project-status ${project.status}">${getStatusText(project.status)}</span>
                        </div>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> Creado: ${createdAt}</span>
                    <span><i class="fas fa-clock"></i> Entrega: ${deadline}</span>
                    ${project.budget_range ? `<span><i class="fas fa-dollar-sign"></i> ${getBudgetText(project.budget_range)}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getProjectTypeText(type) {
    const types = {
        'website': 'Sitio Web',
        'ecommerce': 'E-commerce',
        'webapp': 'App Web',
        'mobile': 'App Móvil',
        'desktop': 'Software',
        'api': 'API/Backend',
        'maintenance': 'Mantenimiento',
        'consultation': 'Consultoría',
        'other': 'Otro'
    };
    return types[type] || type;
}

function getBudgetText(budget) {
    const budgets = {
        'under-500': 'Menos de $500',
        '500-1000': '$500 - $1,000',
        '1000-2500': '$1,000 - $2,500',
        '2500-5000': '$2,500 - $5,000',
        'over-5000': 'Más de $5,000',
        'to-discuss': 'A discutir'
    };
    return budgets[budget] || budget;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'in-progress': 'En Progreso',
        'completed': 'Completado'
    };
    return statusMap[status] || status;
}

function setFormLoading(formType, loading) {
    const forms = {
        'login': document.getElementById('login-form'),
        'register': document.getElementById('register-form'),
        'project': document.getElementById('project-form')
    };
    
    const form = forms[formType];
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('i');
    
    if (loading) {
        btn.disabled = true;
        btnText.textContent = 'Procesando...';
        btnIcon.className = 'fas fa-spinner fa-spin';
    } else {
        btn.disabled = false;
        if (formType === 'login') {
            btnText.textContent = 'Iniciar Sesión';
            btnIcon.className = 'fas fa-sign-in-alt';
        } else if (formType === 'register') {
            btnText.textContent = 'Crear Cuenta';
            btnIcon.className = 'fas fa-user-plus';
        } else if (formType === 'project') {
            btnText.textContent = 'Enviar Solicitud';
            btnIcon.className = 'fas fa-paper-plane';
        }
    }
}

function logout() {
    currentUser = null;
    userToken = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken');
    updateUserInterface();
}