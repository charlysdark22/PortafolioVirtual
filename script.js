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

// Add reveal class to elements that should animate
const revealElements = document.querySelectorAll('.service-card, .skill-item, .stat-item, .contact-item, .portfolio-item, .testimonial-content');
revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.currentIndex = 0;
        this.testimonials = document.querySelectorAll('.testimonial-item');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.testimonials.length === 0) return;
        
        // Add event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isCarouselInView()) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Auto-slide
        this.startAutoSlide();
        
        // Pause on hover
        const carousel = document.querySelector('.testimonials-carousel');
        carousel?.addEventListener('mouseenter', () => this.stopAutoSlide());
        carousel?.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Update on page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }
    
    goToSlide(index) {
        // Remove active classes
        this.testimonials[this.currentIndex]?.classList.remove('active');
        this.dots[this.currentIndex]?.classList.remove('active');
        
        // Update current index
        this.currentIndex = index;
        
        // Add active classes
        this.testimonials[this.currentIndex]?.classList.add('active');
        this.dots[this.currentIndex]?.classList.add('active');
        
        // Update navigation buttons
        this.updateNavButtons();
        
        // Announce for screen readers
        this.announceSlideChange();
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goToSlide(prevIndex);
    }
    
    updateNavButtons() {
        // For infinite carousel, buttons are always enabled
        // You could disable them at start/end for linear navigation
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    isCarouselInView() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return false;
        
        const rect = carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    announceSlideChange() {
        const currentTestimonial = this.testimonials[this.currentIndex];
        const authorName = currentTestimonial?.querySelector('.author-info h4')?.textContent;
        
        if (authorName) {
            // Create announcement for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Mostrando testimonio de ${authorName}`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }
    
    addTouchSupport() {
        const carousel = document.querySelector('.testimonials-carousel');
        if (!carousel) return;
        
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
                return;
            }
            
            if (!isScrolling && Math.abs(diffX) > 10) {
                e.preventDefault();
            }
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!startX || !startY || isScrolling) {
                startX = 0;
                startY = 0;
                return;
            }
            
            const currentX = e.changedTouches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
}

// Initialize testimonials carousel
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
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

// Form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
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
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(45deg, #f093fb, #f5576c)';
            contactForm.reset();
        }, 2000);
    }, 1500);
    
    // Here you would typically send the data to your server
    console.log('Form submitted:', data);
});

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

// Accessibility: Keyboard navigation for portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.querySelector('.portfolio-link')?.click();
        }
    });
    
    // Focus management
    item.addEventListener('focus', () => {
        item.style.outline = '2px solid var(--primary-color)';
        item.style.outlineOffset = '2px';
    });
    
    item.addEventListener('blur', () => {
        item.style.outline = 'none';
    });
});

// Enhanced form accessibility
document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('invalid', (e) => {
        e.target.setAttribute('aria-invalid', 'true');
        
        // Add error styling
        e.target.style.borderColor = '#e53e3e';
        e.target.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
    });
    
    field.addEventListener('input', (e) => {
        if (e.target.validity.valid) {
            e.target.removeAttribute('aria-invalid');
            e.target.style.borderColor = 'var(--border-light)';
            e.target.style.boxShadow = 'none';
        }
    });
});

// Animated counters for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (element.textContent.includes('/')) {
            element.textContent = Math.floor(current) + '/7';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                animateCounter(stat, number, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('#sobre-mi');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Dark mode toggle functionality
function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Alternar modo oscuro');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    
    // Add toggle styles
    const toggleStyles = document.createElement('style');
    toggleStyles.textContent = `
        .dark-mode-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            z-index: 1000;
        }
        
        .dark-mode-toggle:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-xl);
        }
        
        .dark-mode-toggle:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
            .dark-mode-toggle {
                width: 50px;
                height: 50px;
                bottom: 1rem;
                right: 1rem;
                font-size: 1.25rem;
            }
        }
        
        .dark-theme {
            --text-dark: #f7fafc;
            --text-light: #a0aec0;
            --bg-light: #1a202c;
            --bg-white: #2d3748;
            --border-light: #4a5568;
        }
        
        .dark-theme .navbar {
            background: rgba(26, 32, 44, 0.95);
            border-bottom-color: #4a5568;
        }
        
        .dark-theme .service-card,
        .dark-theme .contact-item,
        .dark-theme .portfolio-item {
            background: #2d3748;
            border: 1px solid #4a5568;
        }
        
        .dark-theme .form-group input,
        .dark-theme .form-group textarea {
            background: #2d3748;
            border-color: #4a5568;
            color: #f7fafc;
        }
    `;
    document.head.appendChild(toggleStyles);
    
    // Toggle functionality
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        toggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Alternar modo oscuro');
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
    });
    
    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-theme');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        toggle.setAttribute('aria-label', 'Activar modo claro');
    }
    
    document.body.appendChild(toggle);
}

// Initialize dark mode toggle
createDarkModeToggle();

// Enhanced scroll to top functionality
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    const scrollStyles = document.createElement('style');
    scrollStyles.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.9);
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
            z-index: 999;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            background: rgba(102, 126, 234, 1);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 6rem;
                left: 1rem;
                width: 45px;
                height: 45px;
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(scrollStyles);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    document.body.appendChild(scrollBtn);
}

createScrollToTop();

// Progressive Web App service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registered successfully');
        })
        .catch(error => {
            console.log('SW registration failed');
        });
}

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
        }
    }
});

perfObserver.observe({ entryTypes: ['navigation'] });

// Reduce motion for users who prefer it
const respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (respectsReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

animateCursorTrail();