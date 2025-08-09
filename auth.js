// Authentication System
class AuthSystem {
    constructor() {
        this.currentForm = 'login';
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupPasswordStrength();
    }
    
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
        
        // Password strength checker
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }
        
        // Confirm password checker
        const confirmPasswordInput = document.getElementById('register-confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', (e) => this.checkPasswordMatch(e.target.value));
        }
        
        // Real-time validation
        this.setupRealTimeValidation();
    }
    
    setupRealTimeValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
            input.addEventListener('input', (e) => this.clearError(e.target));
        });
        
        // Password validation
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validatePassword(e.target));
            input.addEventListener('input', (e) => this.clearError(e.target));
        });
        
        // Text validation
        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateText(e.target));
            input.addEventListener('input', (e) => this.clearError(e.target));
        });
    }
    
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(input, 'El email es requerido');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(input, 'Ingresa un email válido');
            return false;
        }
        
        return true;
    }
    
    validatePassword(input) {
        const password = input.value;
        
        if (!password) {
            this.showError(input, 'La contraseña es requerida');
            return false;
        }
        
        if (password.length < 8) {
            this.showError(input, 'La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        
        return true;
    }
    
    validateText(input) {
        const text = input.value.trim();
        
        if (!text) {
            this.showError(input, 'Este campo es requerido');
            return false;
        }
        
        if (text.length < 2) {
            this.showError(input, 'Debe tener al menos 2 caracteres');
            return false;
        }
        
        return true;
    }
    
    showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.classList.add('error');
        }
    }
    
    clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            input.classList.remove('error');
        }
    }
    
    setupPasswordStrength() {
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }
    
    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthFill || !strengthText) return;
        
        let strength = 0;
        let feedback = '';
        
        // Length check
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        // Cap at 100%
        strength = Math.min(strength, 100);
        
        // Update UI
        strengthFill.style.width = `${strength}%`;
        
        // Set color and text based on strength
        if (strength < 25) {
            strengthFill.style.backgroundColor = '#e53e3e';
            feedback = 'Muy débil';
        } else if (strength < 50) {
            strengthFill.style.backgroundColor = '#dd6b20';
            feedback = 'Débil';
        } else if (strength < 75) {
            strengthFill.style.backgroundColor = '#d69e2e';
            feedback = 'Media';
        } else if (strength < 100) {
            strengthFill.style.backgroundColor = '#38a169';
            feedback = 'Fuerte';
        } else {
            strengthFill.style.backgroundColor = '#2f855a';
            feedback = 'Muy fuerte';
        }
        
        strengthText.textContent = feedback;
    }
    
    checkPasswordMatch(confirmPassword) {
        const password = document.getElementById('register-password').value;
        const errorElement = document.getElementById('register-confirm-password-error');
        
        if (confirmPassword !== password) {
            this.showError(document.getElementById('register-confirm-password'), 'Las contraseñas no coinciden');
            return false;
        }
        
        this.clearError(document.getElementById('register-confirm-password'));
        return true;
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Validate inputs
        if (!this.validateEmail(document.getElementById('login-email')) ||
            !this.validatePassword(document.getElementById('login-password'))) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(e.target, true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Find user
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login successful
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                this.showSuccess('¡Inicio de sesión exitoso!');
                
                // Redirect to dashboard or home
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                this.showError(document.getElementById('login-password'), 'Email o contraseña incorrectos');
            }
            
        } catch (error) {
            this.showError(document.getElementById('login-email'), 'Error de conexión. Intenta de nuevo.');
        } finally {
            this.setLoadingState(e.target, false);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            id: Date.now(),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            role: formData.get('role'),
            terms: formData.get('terms'),
            newsletter: formData.get('newsletter'),
            createdAt: new Date().toISOString()
        };
        
        // Validate all fields
        const isValid = this.validateRegisterForm(userData);
        if (!isValid) return;
        
        // Check if user already exists
        if (this.users.find(u => u.email === userData.email)) {
            this.showError(document.getElementById('register-email'), 'Este email ya está registrado');
            return;
        }
        
        // Show loading state
        this.setLoadingState(e.target, true);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Add user to storage
            this.users.push(userData);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.showSuccess('¡Cuenta creada exitosamente!');
            
            // Auto login
            this.currentUser = userData;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Redirect to home
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            this.showError(document.getElementById('register-email'), 'Error al crear la cuenta. Intenta de nuevo.');
        } finally {
            this.setLoadingState(e.target, false);
        }
    }
    
    validateRegisterForm(userData) {
        let isValid = true;
        
        // Validate each field
        if (!this.validateText(document.getElementById('register-firstname'))) isValid = false;
        if (!this.validateText(document.getElementById('register-lastname'))) isValid = false;
        if (!this.validateEmail(document.getElementById('register-email'))) isValid = false;
        if (!this.validatePassword(document.getElementById('register-password'))) isValid = false;
        if (!this.checkPasswordMatch(userData.confirmPassword)) isValid = false;
        
        // Check role selection
        if (!userData.role) {
            this.showError(document.getElementById('register-role'), 'Selecciona tu rol profesional');
            isValid = false;
        }
        
        // Check terms acceptance
        if (!userData.terms) {
            this.showError(document.getElementById('terms'), 'Debes aceptar los términos y condiciones');
            isValid = false;
        }
        
        return isValid;
    }
    
    async handleSocialLogin(e) {
        e.preventDefault();
        
        const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'GitHub';
        
        // Show loading state
        e.currentTarget.disabled = true;
        e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando con ${provider}...`;
        
        try {
            // Simulate social login
            await this.simulateApiCall(2000);
            
            this.showSuccess(`¡Inicio de sesión con ${provider} exitoso!`);
            
            // In a real app, you would handle OAuth here
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            this.showError(document.getElementById('login-email'), `Error al conectar con ${provider}`);
        } finally {
            e.currentTarget.disabled = false;
            e.currentTarget.innerHTML = `<i class="fab fa-${provider.toLowerCase()}"></i> ${provider}`;
        }
    }
    
    setLoadingState(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
    
    async simulateApiCall(delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, delay);
        });
    }
    
    showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    checkAuthStatus() {
        if (this.currentUser) {
            // User is logged in, show user menu
            this.showUserMenu();
        }
    }
    
    showUserMenu() {
        // This would show a user menu in the navigation
        // For now, we'll just log the user info
        console.log('User logged in:', this.currentUser);
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        window.location.reload();
    }
}

// Global functions for form switching and password toggle
function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (formType === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.querySelector('.registration-header h1').textContent = 'Crear Cuenta';
        document.querySelector('.registration-header p').textContent = 'Únete a nuestra comunidad de desarrolladores';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.querySelector('.registration-header h1').textContent = 'Únete a mi Comunidad';
        document.querySelector('.registration-header p').textContent = 'Regístrate para recibir contenido exclusivo, actualizaciones de proyectos y ofertas especiales';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});

// Add CSS for notifications and form enhancements
const authStyles = document.createElement('style');
authStyles.textContent = `
    .success-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(45deg, #48bb78, #38a169);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    }
    
    .success-notification.show {
        transform: translateX(0);
    }
    
    .success-notification i {
        font-size: 1.25rem;
    }
    
    .form-error {
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
    }
    
    .form-group.error input,
    .form-group.error select {
        border-color: #e53e3e;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
    
    .password-toggle {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: var(--text-light);
        transition: var(--transition);
    }
    
    .password-toggle:hover {
        color: var(--primary-color);
    }
    
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .strength-bar {
        width: 100%;
        height: 4px;
        background: var(--border-light);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        width: 0%;
        transition: all 0.3s ease;
        border-radius: 2px;
    }
    
    .strength-text {
        font-size: 0.75rem;
        color: var(--text-light);
        margin-top: 0.25rem;
        display: block;
    }
    
    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .checkbox-container input[type="checkbox"] {
        display: none;
    }
    
    .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid var(--border-light);
        border-radius: 3px;
        position: relative;
        transition: var(--transition);
    }
    
    .checkbox-container input[type="checkbox"]:checked + .checkmark {
        background: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .checkbox-container input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 0.75rem;
        font-weight: bold;
    }
    
    .forgot-password {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 0.875rem;
        transition: var(--transition);
    }
    
    .forgot-password:hover {
        text-decoration: underline;
    }
    
    .form-switch {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-light);
    }
    
    .form-switch a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        transition: var(--transition);
    }
    
    .form-switch a:hover {
        text-decoration: underline;
    }
    
    .social-login {
        margin-top: 2rem;
        text-align: center;
    }
    
    .social-login p {
        color: var(--text-light);
        margin-bottom: 1rem;
        position: relative;
    }
    
    .social-login p::before,
    .social-login p::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 30%;
        height: 1px;
        background: var(--border-light);
    }
    
    .social-login p::before {
        left: 0;
    }
    
    .social-login p::after {
        right: 0;
    }
    
    .social-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .social-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        background: var(--bg-white);
        color: var(--text-dark);
        text-decoration: none;
        font-weight: 500;
        transition: var(--transition);
        cursor: pointer;
    }
    
    .social-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .google-btn:hover {
        border-color: #ea4335;
        color: #ea4335;
    }
    
    .github-btn:hover {
        border-color: #333;
        color: #333;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .social-buttons {
            flex-direction: column;
        }
        
        .success-notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            transform: translateY(-100%);
        }
        
        .success-notification.show {
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(authStyles);