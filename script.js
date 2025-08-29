document.addEventListener('DOMContentLoaded', () => {

    // 1. Simulación de una App centralizada (Mejorada)
    // Se extraen los productos, que no necesitan ser parte del objeto global App.
    const products = [
      { id: 1, name: 'Gaming PC RTX 4070 Super', price: 45000, category: 'gaming', img: 'https://images.unsplash.com/photo-1587202377897-e0657748b15d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', discount: '-10%', featured: true },
      { id: 2, name: 'MacBook Air M2 13"', price: 65000, category: 'laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', featured: true },
      { id: 3, name: 'Gaming Laptop RTX 4060', price: 55000, category: 'gaming', img: 'https://images.unsplash.com/photo-1595824470512-dff708601d91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', discount: 'Nuevo', featured: true },
      { id: 4, name: 'iPhone 15 Pro 128GB', price: 85000, category: 'phones', img: 'https://images.unsplash.com/photo-1695645040755-f74909d0656c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80', discount: 'Nuevo' },
      { id: 5, name: 'Samsung Galaxy S24 Ultra', price: 75000, category: 'phones', img: 'https://images.unsplash.com/photo-1610945265077-9392388e57f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
      { id: 6, name: 'Apple Watch Series 8', price: 25000, category: 'accessories', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80' }
    ];

    window.App = {
      theme: localStorage.getItem('theme') || 'light',
      user: JSON.parse(localStorage.getItem('user')),
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      users: JSON.parse(localStorage.getItem('users')) || [],
      setTheme: function(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      },
      addToCart: function(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          this.cart.push({ ...product, quantity: 1, cartId: Date.now() });
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        updateCartCount();
        alert(`${product.name} añadido al carrito`);
      },
      removeFromCart: function(cartId) {
          this.cart = this.cart.filter(item => item.cartId !== cartId);
          localStorage.setItem('cart', JSON.stringify(this.cart));
          updateCartCount();
          renderCartItems();
      },
      updateCartQuantity: function(cartId, quantity) {
          const item = this.cart.find(i => i.cartId === cartId);
          if (item) {
              item.quantity = parseInt(quantity, 10);
              localStorage.setItem('cart', JSON.stringify(this.cart));
              renderCartItems();
          }
      },
      login: function(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
          alert('¡Inicio de sesión exitoso!');
          window.location.href = 'index.html';
        } else {
          alert('Correo o contraseña incorrectos.');
        }
        updateHeaderView(); // Llama a esta función después de intentar el login
      },
      register: function(name, email, password) {
        if (this.users.find(u => u.email === email)) {
          alert('Este correo ya está registrado.');
          return;
        }
        const newUser = { id: this.users.length + 1, name, email, password };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
      },
      logout: function() {
        localStorage.removeItem('user');
        this.user = null;
        updateHeaderView(); // Llama a esta función después de cerrar sesión
        window.location.href = 'index.html';
      }
    };
  
    // 2. Referencias a elementos del DOM (Agrupadas para mayor claridad)
    const dom = {
      hamburger: document.querySelector('.hamburger'),
      nav: document.querySelector('nav'),
      themeToggle: document.getElementById('themeToggle'),
      themeIcon: document.getElementById('themeToggle')?.querySelector('i'),
      cartCount: document.getElementById('cartCount'),
      authLinks: document.getElementById('auth-links'), // Nueva referencia
      loginLink: document.getElementById('loginLink'),
      registerLink: document.getElementById('registerLink'),
      profileLink: document.getElementById('profileLink'),
      logoutBtn: document.getElementById('logoutBtn'),
      userMenu: document.getElementById('user-menu'), // Nueva referencia
      userToggle: document.getElementById('userToggle'),
      productsContainer: document.getElementById('products'),
      featuredProductsContainer: document.getElementById('featured-products'),
      categoryCards: document.querySelectorAll('.category-card'),
      filteredProductsContainer: document.getElementById('filtered-products'),
      loginForm: document.getElementById('loginForm'),
      registerForm: document.getElementById('registerForm'),
      chatbotToggle: document.getElementById('chatbot-toggle'),
      chatbotClose: document.getElementById('chatbot-close'),
      chatbotWindow: document.getElementById('chatbot-window'),
      chatbotBody: document.getElementById('chatbot-body'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      cartItemsContainer: document.getElementById('cartItems'),
      cartSubtotal: document.getElementById('cartSubtotal'),
      cartTotal: document.getElementById('cartTotal'),
      checkoutBtn: document.getElementById('checkoutBtn'),
      checkoutAmountElements: document.querySelectorAll('#checkoutAmount, #checkoutAmount2'),
      currencySelect: document.getElementById('currency-select'),
      transfermovilInfoContainer: document.getElementById('transfermovil-info'),
      categoryFilter: document.getElementById('category-filter'),
      minPrice: document.getElementById('min-price'),
      maxPrice: document.getElementById('max-price'),
    };
  
    const conversionRate = 250;
  
    // 3. Funciones de Utilidad (Refactorizadas y más robustas)
    function updateCartCount() {
      const count = App.cart.reduce((sum, item) => sum + item.quantity, 0);
      if (dom.cartCount) {
        dom.cartCount.textContent = count;
      }
    }
  
    function updateThemeIcon() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      if (dom.themeIcon) {
        dom.themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    // Función para mostrar/ocultar los enlaces de autenticación/usuario
    function updateHeaderView() {
      if (!dom.authLinks || !dom.userMenu) return;
      if (App.user) {
        dom.authLinks.style.display = 'none';
        dom.userMenu.style.display = 'block';
      } else {
        dom.authLinks.style.display = 'flex'; // Usar flex para que los botones se muestren en fila
        dom.userMenu.style.display = 'none';
      }
    }

    function renderCartItems() {
      if (!dom.cartItemsContainer) return;
  
      dom.cartItemsContainer.innerHTML = '';
      if (App.cart.length === 0) {
        dom.cartItemsContainer.innerHTML = `<p class="empty-cart-message">Tu carrito está vacío.</p>`;
      } else {
        App.cart.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.className = 'cart-item';
          cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <span class="cart-item-price">$${item.price.toLocaleString()} CUP</span>
              <div class="cart-item-quantity">
                <label for="quantity-${item.cartId}">Cantidad:</label>
                <input type="number" id="quantity-${item.cartId}" value="${item.quantity}" min="1" data-cart-id="${item.cartId}">
              </div>
            </div>
            <button class="btn-remove" data-cart-id="${item.cartId}" aria-label="Eliminar ${item.name} del carrito">
              <i class="fas fa-trash-alt"></i>
            </button>
          `;
          dom.cartItemsContainer.appendChild(cartItem);
        });
      }
      updateCartSummary();
    }
    
    function updateCartSummary() {
      if (!dom.cartSubtotal || !dom.cartTotal) return;
  
      const subtotal = App.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      dom.cartSubtotal.textContent = `$${subtotal.toLocaleString()} CUP`;
      dom.cartTotal.textContent = `$${subtotal.toLocaleString()} CUP`;
    }
    
    function renderProducts(productsToRender, container) {
      if (!container) return;
  
      container.innerHTML = '';
      productsToRender.forEach(p => {
        // Corrección: el precio original solo aplica a productos con descuento
        const originalPrice = p.discount && p.discount.includes('%') ? `<span class="original-price">$${Math.round(p.price / (1 - parseFloat(p.discount) / 100)).toLocaleString()}</span>` : '';
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
          <div class="product-info">
            ${p.discount ? `<div class="badge">${p.discount}</div>` : ''}
            <h3>${p.name}</h3>
            <div class="rating">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> 4.8 (24 reseñas)
            </div>
            <div class="price">$${p.price.toLocaleString()} CUP ${originalPrice}</div>
            <button class="btn-add" data-product='${JSON.stringify(p)}'>
              <i class="fas fa-shopping-cart"></i> Agregar al Carrito
            </button>
          </div>
        `;
        container.appendChild(productCard);
      });
    }
  
    function filterProducts() {
      const categoryFilter = dom.categoryFilter?.value || '';
      const minPrice = parseFloat(dom.minPrice?.value) || 0;
      const maxPrice = parseFloat(dom.maxPrice?.value) || Infinity;
  
      const filtered = products.filter(p => {
        const isCategoryMatch = !categoryFilter || p.category === categoryFilter;
        const isPriceMatch = p.price >= minPrice && p.price <= maxPrice;
        return isCategoryMatch && isPriceMatch;
      });
  
      renderProducts(filtered, dom.filteredProductsContainer);
    }
  
    function addMessageToChat(text, sender) {
      if (!dom.chatbotBody) return;
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${sender}`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      dom.chatbotBody.appendChild(messageDiv);
      dom.chatbotBody.scrollTop = dom.chatbotBody.scrollHeight;
    }
  
    function handleChatbotResponse(message) {
      const lowerCaseMessage = message.toLowerCase();
      let botResponse = 'Lo siento, no entendí tu pregunta. Puedes preguntar sobre nuestros productos, envíos o devoluciones.';
  
      if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludos')) {
        botResponse = '¡Hola! ¿En qué puedo ayudarte hoy?';
      } else if (lowerCaseMessage.includes('productos') || lowerCaseMessage.includes('catálogo')) {
        botResponse = 'Puedes ver todos nuestros productos en la sección de <a href="products.html">Productos</a>. Tenemos laptops, teléfonos y accesorios.';
      } else if (lowerCaseMessage.includes('envío') || lowerCaseMessage.includes('envios')) {
        botResponse = 'Ofrecemos servicio de envío a domicilio en toda Cuba. El costo varía según la ubicación.';
      } else if (lowerCaseMessage.includes('devoluciones') || lowerCaseMessage.includes('garantía')) {
        botResponse = 'Todos nuestros productos tienen una garantía de 30 días. Para devoluciones, por favor contacta a nuestro equipo de soporte.';
      } else if (lowerCaseMessage.includes('contacto') || lowerCaseMessage.includes('soporte')) {
        botResponse = 'Puedes contactarnos a través del formulario en la página de <a href="support.html">Soporte</a> o en nuestros números de teléfono.';
      }
      
      setTimeout(() => {
        addMessageToChat(botResponse, 'bot');
      }, 1000);
    }
  
    function renderPaymentInfo(currency) {
      if (!dom.transfermovilInfoContainer || !dom.checkoutAmountElements) return;
      const total = App.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalMLC = (total / conversionRate).toFixed(2);
      
      if (currency === 'cup') {
        dom.transfermovilInfoContainer.innerHTML = `
          <p><strong>Número de Teléfono:</strong> +53 53932292</p>
          <p><strong>Tarjeta CUP:</strong> 9238129975083223</p>
        `;
        dom.checkoutAmountElements.forEach(el => el.textContent = `$${total.toLocaleString()} CUP`);
      } else if (currency === 'mlc') {
        dom.transfermovilInfoContainer.innerHTML = `
          <p><strong>Número de Teléfono:</strong> +53 53932292</p>
          <p><strong>Tarjeta MLC:</strong> 9235129979365413</p>
        `;
        dom.checkoutAmountElements.forEach(el => el.textContent = `$${totalMLC} MLC`);
      }
    }
  
    // 4. Inicialización y Eventos (Centralizados)
    function setupEventListeners() {
      // Evento para el menú de hamburguesa
      dom.hamburger?.addEventListener('click', () => {
        dom.nav?.classList.toggle('active');
        const isExpanded = dom.nav?.classList.contains('active');
        dom.hamburger.setAttribute('aria-expanded', isExpanded);
        dom.hamburger.querySelector('i').className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
      });
  
      // Evento para el cambio de tema
      dom.themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        App.setTheme(newTheme);
        updateThemeIcon();
      });

      // Evento para el botón de cuenta
      dom.userToggle?.addEventListener('click', () => {
          const userMenu = dom.userToggle.closest('.user-menu');
          userMenu.classList.toggle('active');
          const isExpanded = userMenu.classList.contains('active');
          dom.userToggle.setAttribute('aria-expanded', isExpanded);
      });
      
      // Cerrar el menú desplegable si se hace clic fuera
      document.addEventListener('click', (event) => {
          if (dom.userMenu && !dom.userMenu.contains(event.target)) {
              dom.userMenu.classList.remove('active');
              dom.userToggle?.setAttribute('aria-expanded', 'false');
          }
      });
  
      // Evento para el botón de cerrar sesión
      dom.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        App.logout();
      });
  
      // Eventos para formularios de autenticación
      dom.loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        App.login(email, password);
      });
  
      dom.registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        App.register(name, email, password);
      });
  
      // Evento para agregar, eliminar y actualizar productos del carrito (delegación de eventos)
      document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-add')) {
          const productData = JSON.parse(e.target.closest('.btn-add').dataset.product);
          App.addToCart(productData);
        } else if (e.target.closest('.btn-remove')) {
          const cartId = e.target.closest('.btn-remove').dataset.cartId;
          App.removeFromCart(parseInt(cartId));
        }
      });
      
      document.addEventListener('input', (e) => {
          if (e.target.closest('.cart-item-quantity input')) {
              const input = e.target.closest('.cart-item-quantity input');
              const cartId = input.dataset.cartId;
              const quantity = input.value;
              if (quantity > 0) {
                  App.updateCartQuantity(parseInt(cartId), quantity);
              }
          }
      });
  
      // Evento para el botón de checkout
      dom.checkoutBtn?.addEventListener('click', () => {
          if (App.cart.length > 0) {
              window.location.href = 'checkout.html';
          } else {
              alert('Tu carrito está vacío.');
          }
      });
  
      // Evento para redirección de categorías
      dom.categoryCards.forEach(card => {
        card.addEventListener('click', () => {
          const cat = card.dataset.category;
          localStorage.setItem('searchQuery', cat);
          window.location.href = 'products.html';
        });
      });
  
      // Eventos para la búsqueda avanzada
      if (dom.categoryFilter && dom.minPrice && dom.maxPrice) {
          dom.categoryFilter.addEventListener('change', filterProducts);
          dom.minPrice.addEventListener('input', filterProducts);
          dom.maxPrice.addEventListener('input', filterProducts);
      }
  
      // Eventos para el chatbot
      if (dom.chatbotToggle && dom.chatbotClose && dom.userInput && dom.sendBtn) {
          dom.chatbotToggle.addEventListener('click', () => {
              dom.chatbotWindow.classList.toggle('active');
              const isChatbotActive = dom.chatbotWindow.classList.contains('active');
              dom.chatbotToggle.setAttribute('aria-label', isChatbotActive ? 'Cerrar Chatbot' : 'Abrir Chatbot');
              dom.chatbotToggle.querySelector('i').className = isChatbotActive ? 'fas fa-times' : 'fas fa-comment-dots';
          });
          dom.chatbotClose.addEventListener('click', () => {
              dom.chatbotWindow.classList.remove('active');
              dom.chatbotToggle.setAttribute('aria-label', 'Abrir Chatbot');
              dom.chatbotToggle.querySelector('i').className = 'fas fa-comment-dots';
          });
          dom.sendBtn.addEventListener('click', () => {
              const message = dom.userInput.value.trim();
              if (message) {
                  addMessageToChat(message, 'user');
                  handleChatbotResponse(message);
                  dom.userInput.value = '';
              }
          });
          dom.userInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                  dom.sendBtn.click();
              }
          });
      }
  
      // Evento para el selector de moneda
      dom.currencySelect?.addEventListener('change', (e) => {
        renderPaymentInfo(e.target.value);
      });
    }
  
    // 5. Función de Inicialización Principal
    function init() {
      setupEventListeners();
      updateCartCount();
      updateThemeIcon();
      
      // Llamada para configurar el encabezado al cargar
      updateHeaderView(); 
      
      const path = window.location.pathname;
  
      if (path.includes('products.html')) {
        const query = localStorage.getItem('searchQuery');
        const productsToDisplay = query ? products.filter(p => p.category === query) : products;
        renderProducts(productsToDisplay, dom.productsContainer);
        localStorage.removeItem('searchQuery');
      } else if (path.includes('index.html') || path === '/') {
        const featuredProducts = products.filter(p => p.featured);
        renderProducts(featuredProducts, dom.featuredProductsContainer);
      } else if (path.includes('cart.html')) {
        renderCartItems();
      } else if (path.includes('advanced-search.html')) {
        filterProducts();
      } else if (path.includes('checkout.html')) {
        renderPaymentInfo(dom.currencySelect?.value || 'cup');
      }
    }
  
    // Inicia todo el script
    init();
  });