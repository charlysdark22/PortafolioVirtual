// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
    mobileMenu.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
}

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

// Optimized navbar background on scroll with throttling
let ticking = false;
const navbar = document.querySelector('.navbar');

function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Optimized Scroll reveal animation with debouncing
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Unobserve element after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add reveal class to elements that should animate with staggered delays
const revealElements = document.querySelectorAll('.service-card, .skill-item, .stat-item, .contact-item, .project-card, .testimonial-card');
revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--animation-order', index);
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

// Form handling with improved validation
const contactForm = document.querySelector('.contact-form');

// Add real-time validation
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearErrorState);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Validate based on field type
    switch(field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                showError(field, 'Por favor ingresa un email válido');
            }
            break;
        case 'text':
            if (field.name === 'nombre' && value.length < 2) {
                isValid = false;
                showError(field, 'El nombre debe tener al menos 2 caracteres');
            }
            if (field.name === 'asunto' && value.length < 5) {
                isValid = false;
                showError(field, 'El asunto debe tener al menos 5 caracteres');
            }
            break;
        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                showError(field, 'El mensaje debe tener al menos 10 caracteres');
            }
            break;
    }
    
    return isValid;
}

function clearErrorState(e) {
    const field = e.target;
    field.classList.remove('error');
    removeErrorMessage(field);
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isFormValid = true;
    formInputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    // Check if all required fields are filled
    formInputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isFormValid = false;
            showError(input, 'Este campo es obligatorio');
        }
    });
    
    if (!isFormValid) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
        submitBtn.style.background = 'linear-gradient(45deg, #48bb78, #38a169)';
        
        // Show success message
        showSuccessMessage();
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(45deg, #f093fb, #f5576c)';
            contactForm.reset();
            hideSuccessMessage();
        }, 3000);
    }, 1500);
    
    // Here you would typically send the data to your server
    console.log('Form submitted:', data);
});

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>¡Gracias por contactarme! Te responderé pronto.</span>
    `;
    contactForm.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);
}

function hideSuccessMessage() {
    const successMsg = contactForm.querySelector('.success-message');
    if (successMsg) {
        successMsg.remove();
    }
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