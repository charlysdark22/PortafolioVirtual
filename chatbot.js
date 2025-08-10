// Chatbot System
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentUser = null;
        this.typing = false;
        
        this.responses = {
            greeting: [
                "¡Hola! Soy el asistente virtual de Carlos Aguiar. ¿En qué puedo ayudarte?",
                "¡Bienvenido! Soy el bot de ayuda de Carlos. ¿Tienes alguna pregunta?",
                "¡Hola! Estoy aquí para ayudarte con cualquier consulta sobre los servicios de Carlos."
            ],
            services: [
                "Carlos ofrece los siguientes servicios:\n\n• 🎨 Diseño UI/UX\n• 💻 Desarrollo Frontend\n• 📱 Desarrollo Mobile\n• 🔧 Consultoría Técnica\n\n¿Te interesa alguno en particular?",
                "Los servicios principales incluyen:\n\n• Desarrollo web con React y Node.js\n• Aplicaciones móviles\n• Optimización SEO\n• Mantenimiento web\n\n¿Cuál te gustaría conocer más?"
            ],
            portfolio: [
                "Carlos ha completado más de 15 proyectos exitosos. Puedes ver su portafolio en la sección correspondiente de la página. ¿Te gustaría que te cuente sobre algún proyecto específico?",
                "El portafolio incluye proyectos de e-commerce, aplicaciones educativas, APIs REST y más. Todos con tecnologías modernas como React, Node.js y React Native."
            ],
            contact: [
                "Puedes contactar a Carlos de varias formas:\n\n📧 Email: carlosaguilardark22@gmail.com\n📞 Teléfono: +53 53932292\n💬 WhatsApp: +53 53932292\n\n¿Te gustaría que te ayude con algo específico?",
                "Para contactar directamente:\n\n• Email: carlosaguilardark22@gmail.com\n• Teléfono: +53 53932292\n• Ubicación: Cuba\n\n¿Prefieres algún método en particular?"
            ],
            pricing: [
                "Los precios varían según el proyecto y complejidad. Carlos ofrece:\n\n• Consulta gratuita inicial\n• Presupuestos personalizados\n• Diferentes paquetes de servicios\n\n¿Te gustaría agendar una consulta?",
                "Cada proyecto es único, por eso Carlos ofrece presupuestos personalizados. ¿Te gustaría que te ayude a contactarlo para una consulta gratuita?"
            ],
            technology: [
                "Carlos trabaja con las tecnologías más modernas:\n\n• Frontend: React, Vue.js, JavaScript/TypeScript\n• Backend: Node.js, Express, Python\n• Mobile: React Native, Flutter\n• Base de datos: MongoDB, PostgreSQL, MySQL\n\n¿Te interesa alguna tecnología específica?",
                "Tecnologías principales:\n\n• JavaScript/TypeScript (95%)\n• React/Vue.js (90%)\n• CSS/Sass (88%)\n• Node.js/Python (85%)\n\n¿Quieres saber más sobre alguna?"
            ],
            experience: [
                "Carlos tiene más de 5 años de experiencia en desarrollo web y ha completado más de 150 proyectos exitosos. Trabaja con clientes de diferentes industrias y tamaños.",
                "Experiencia destacada:\n\n• 5+ años en desarrollo web\n• 150+ proyectos completados\n• 50+ clientes satisfechos\n• Especialización en soluciones personalizadas"
            ],
            default: [
                "No estoy seguro de entender tu pregunta. ¿Podrías reformularla? O puedes preguntarme sobre:\n\n• Servicios\n• Portafolio\n• Contacto\n• Tecnologías\n• Experiencia",
                "No tengo esa información específica. ¿Te ayudo con algo sobre los servicios, portafolio o contacto de Carlos?"
            ]
        };
        
        this.keywords = {
            greeting: ['hola', 'buenos dias', 'buenas', 'hey', 'hi', 'hello'],
            services: ['servicios', 'servicio', 'que haces', 'que ofreces', 'trabajos', 'desarrollo', 'diseño'],
            portfolio: ['portafolio', 'proyectos', 'trabajos', 'ejemplos', 'casos'],
            contact: ['contacto', 'contactar', 'email', 'telefono', 'whatsapp', 'numero'],
            pricing: ['precio', 'costo', 'tarifa', 'presupuesto', 'cuanto cuesta', 'valor'],
            technology: ['tecnologia', 'tecnologias', 'react', 'node', 'javascript', 'python', 'stack'],
            experience: ['experiencia', 'años', 'tiempo', 'proyectos', 'clientes']
        };
        
        this.init();
    }
    
    init() {
        this.createChatbot();
        this.loadMessages();
        this.addEventListeners();
        this.showWelcomeMessage();
    }
    
    createChatbot() {
        // Create chatbot container
        const chatbot = document.createElement('div');
        chatbot.className = 'chatbot-container';
        chatbot.innerHTML = `
            <div class="chatbot-toggle" id="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="notification-badge" id="notification-badge" style="display: none;">1</span>
            </div>
            
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-info">
                        <h4>Asistente Virtual</h4>
                        <span class="status">En línea</span>
                    </div>
                    <button class="chatbot-close" id="chatbot-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="chatbot-input-container">
                    <div class="quick-actions">
                        <button class="quick-action" data-action="services">Servicios</button>
                        <button class="quick-action" data-action="portfolio">Portafolio</button>
                        <button class="quick-action" data-action="contact">Contacto</button>
                        <button class="quick-action" data-action="pricing">Precios</button>
                    </div>
                    
                    <div class="input-group">
                        <input type="text" id="chatbot-input" placeholder="Escribe tu mensaje..." maxlength="500">
                        <button id="chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatbot);
    }
    
    addEventListeners() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        // Close chatbot
        document.getElementById('chatbot-close').addEventListener('click', () => {
            this.closeChatbot();
        });
        
        // Send message
        document.getElementById('chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter key to send
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Auto-open on page load after 10 seconds
        setTimeout(() => {
            if (!this.isOpen && !localStorage.getItem('chatbotOpened')) {
                this.showNotification();
            }
        }, 10000);
    }
    
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.isOpen = true;
        document.getElementById('chatbot-window').classList.add('open');
        document.getElementById('chatbot-input').focus();
        localStorage.setItem('chatbotOpened', 'true');
        this.hideNotification();
    }
    
    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbot-window').classList.remove('open');
    }
    
    showNotification() {
        const badge = document.getElementById('notification-badge');
        badge.style.display = 'block';
        badge.style.animation = 'pulse 2s infinite';
    }
    
    hideNotification() {
        document.getElementById('notification-badge').style.display = 'none';
    }
    
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Simulate typing
        this.showTyping();
        
        // Generate response
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    }
    
    handleQuickAction(action) {
        const responses = {
            services: this.responses.services[0],
            portfolio: this.responses.portfolio[0],
            contact: this.responses.contact[0],
            pricing: this.responses.pricing[0]
        };
        
        this.addMessage(responses[action], 'bot');
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords
        for (const [category, keywords] of Object.entries(this.keywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                const responses = this.responses[category];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Default response
        const defaultResponses = this.responses.default;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save message
        this.messages.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
        this.saveMessages();
    }
    
    formatMessage(text) {
        // Convert line breaks to <br>
        return text.replace(/\n/g, '<br>');
    }
    
    showTyping() {
        this.typing = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        this.typing = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessage = this.responses.greeting[Math.floor(Math.random() * this.responses.greeting.length)];
            this.addMessage(welcomeMessage, 'bot');
        }, 500);
    }
    
    saveMessages() {
        localStorage.setItem('chatbotMessages', JSON.stringify(this.messages));
    }
    
    loadMessages() {
        const saved = localStorage.getItem('chatbotMessages');
        if (saved) {
            this.messages = JSON.parse(saved);
            // Only show last 10 messages to avoid clutter
            const recentMessages = this.messages.slice(-10);
            recentMessages.forEach(msg => {
                this.addMessage(msg.text, msg.sender);
            });
        }
    }
}

// WhatsApp Button
class WhatsAppButton {
    constructor() {
        this.phoneNumber = '+53 53932292';
        this.defaultMessage = 'Hola Carlos, me interesa conocer más sobre tus servicios de desarrollo web.';
        this.init();
    }
    
    init() {
        this.createWhatsAppButton();
        this.addEventListeners();
    }
    
    createWhatsAppButton() {
        const whatsappBtn = document.createElement('div');
        whatsappBtn.className = 'whatsapp-button';
        whatsappBtn.innerHTML = `
            <div class="whatsapp-icon">
                <i class="fab fa-whatsapp"></i>
            </div>
            <div class="whatsapp-tooltip">
                ¡Chatea con Carlos en WhatsApp!
            </div>
        `;
        
        document.body.appendChild(whatsappBtn);
    }
    
    addEventListeners() {
        const whatsappBtn = document.querySelector('.whatsapp-button');
        
        whatsappBtn.addEventListener('click', () => {
            this.openWhatsApp();
        });
        
        // Show tooltip on hover
        whatsappBtn.addEventListener('mouseenter', () => {
            const tooltip = whatsappBtn.querySelector('.whatsapp-tooltip');
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        whatsappBtn.addEventListener('mouseleave', () => {
            const tooltip = whatsappBtn.querySelector('.whatsapp-tooltip');
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    }
    
    openWhatsApp() {
        const encodedMessage = encodeURIComponent(this.defaultMessage);
        const whatsappUrl = `https://wa.me/${this.phoneNumber.replace(/\s/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
    new WhatsAppButton();
});

// Add CSS for chatbot and WhatsApp button
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
    /* Chatbot Styles */
    .chatbot-container {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        font-family: 'Inter', sans-serif;
    }
    
    .chatbot-toggle {
        width: 60px;
        height: 60px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        position: relative;
    }
    
    .chatbot-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    }
    
    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #e53e3e;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.9);
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .chatbot-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
    }
    
    .chatbot-header {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .chatbot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
    
    .chatbot-info h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .chatbot-info .status {
        font-size: 0.875rem;
        opacity: 0.8;
    }
    
    .chatbot-close {
        margin-left: auto;
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .chatbot-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .chatbot-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .chatbot-message {
        max-width: 80%;
        animation: messageSlide 0.3s ease;
    }
    
    .user-message {
        align-self: flex-end;
    }
    
    .bot-message {
        align-self: flex-start;
    }
    
    .message-content {
        background: #f7fafc;
        padding: 0.75rem 1rem;
        border-radius: 18px;
        position: relative;
    }
    
    .user-message .message-content {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }
    
    .message-time {
        font-size: 0.75rem;
        opacity: 0.6;
        margin-top: 0.25rem;
    }
    
    .typing-indicator {
        display: flex;
        gap: 0.25rem;
        padding: 0.5rem;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #667eea;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    
    .chatbot-input-container {
        padding: 1rem;
        border-top: 1px solid #e2e8f0;
    }
    
    .quick-actions {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .quick-action {
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #4a5568;
    }
    
    .quick-action:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .input-group {
        display: flex;
        gap: 0.5rem;
    }
    
    .input-group input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 25px;
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.3s ease;
    }
    
    .input-group input:focus {
        border-color: #667eea;
    }
    
    .input-group button {
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .input-group button:hover {
        transform: scale(1.1);
    }
    
    /* WhatsApp Button Styles */
    .whatsapp-button {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        z-index: 999;
        cursor: pointer;
    }
    
    .whatsapp-icon {
        width: 60px;
        height: 60px;
        background: #25d366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.75rem;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
        transition: all 0.3s ease;
    }
    
    .whatsapp-icon:hover {
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 6px 25px rgba(37, 211, 102, 0.4);
    }
    
    .whatsapp-tooltip {
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: #2d3748;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .whatsapp-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #2d3748;
    }
    
    /* Animations */
    @keyframes messageSlide {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Dark theme support */
    .dark-theme .chatbot-window {
        background: #2d3748;
        color: #f7fafc;
    }
    
    .dark-theme .message-content {
        background: #4a5568;
        color: #f7fafc;
    }
    
    .dark-theme .quick-action {
        background: #4a5568;
        border-color: #718096;
        color: #f7fafc;
    }
    
    .dark-theme .input-group input {
        background: #4a5568;
        border-color: #718096;
        color: #f7fafc;
    }
    
    .dark-theme .input-group input::placeholder {
        color: #a0aec0;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .chatbot-window {
            width: calc(100vw - 2rem);
            height: 60vh;
            right: -1rem;
        }
        
        .chatbot-toggle,
        .whatsapp-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
        }
        
        .chatbot-container {
            bottom: 1rem;
            right: 1rem;
        }
        
        .whatsapp-button {
            bottom: 1rem;
            left: 1rem;
        }
        
        .quick-actions {
            justify-content: center;
        }
        
        .quick-action {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
        }
    }
    
    @media (max-width: 480px) {
        .chatbot-window {
            width: calc(100vw - 1rem);
            height: 70vh;
            right: -0.5rem;
        }
        
        .chatbot-container {
            bottom: 0.5rem;
            right: 0.5rem;
        }
        
        .whatsapp-button {
            bottom: 0.5rem;
            left: 0.5rem;
        }
    }
`;

document.head.appendChild(chatbotStyles);