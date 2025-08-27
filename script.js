document.addEventListener('DOMContentLoaded', () => {

  // Simulación de una App centralizada
  window.App = {
    theme: localStorage.getItem('theme') || 'light',
    user: JSON.parse(localStorage.getItem('user')),
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [
      { id: 1, name: 'Gaming PC RTX 4070 Super', price: 45000, category: 'gaming', img: 'https://images.unsplash.com/photo-1587202377897-e0657748b15d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', discount: '-10%', featured: true },
      { id: 2, name: 'MacBook Air M2 13"', price: 65000, category: 'laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', featured: true },
      { id: 3, name: 'Gaming Laptop RTX 4060', price: 55000, category: 'gaming', img: 'https://images.unsplash.com/photo-1595824470512-dff708601d91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', discount: 'Nuevo', featured: true },
      { id: 4, name: 'iPhone 15 Pro 128GB', price: 85000, category: 'phones', img: 'https://images.unsplash.com/photo-1695645040755-f74909d0656c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80', discount: 'Nuevo' },
      { id: 5, name: 'Samsung Galaxy S24 Ultra', price: 75000, category: 'phones', img: 'https://images.unsplash.com/photo-1610945265077-9392388e57f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
      { id: 6, name: 'Apple Watch Series 8', price: 25000, category: 'accessories', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80' }
    ],
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
      window.location.href = 'index.html';
    }
  };

  // Referencias a elementos del DOM
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const cartCount = document.getElementById('cartCount');
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const profileLink = document.getElementById('profileLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const productsContainer = document.getElementById('products');
  const featuredProductsContainer = document.getElementById('featured-products');
  const categoryCards = document.querySelectorAll('.category-card');
  const filteredProductsContainer = document.getElementById('filtered-products');

  // Cart DOM elements
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Chatbot DOM elements
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotBody = document.getElementById('chatbot-body');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // Forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // --- Funciones de Utilidad ---

  // Actualiza el contador del carrito en el header
  function updateCartCount() {
    const count = App.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = count;
    }
  }

  // Actualiza el ícono del tema según el modo actual
  function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (themeIcon) {
      themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // Renderiza los productos en el carrito
  function renderCartItems() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (App.cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-cart-message">Tu carrito está vacío.</p>`;
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
                cartItemsContainer.appendChild(cartItem);
            });
        }
        updateCartSummary();
    }
  }
  
  // Actualiza el resumen del carrito (subtotal, total)
  function updateCartSummary() {
      if (cartSubtotal && cartTotal) {
          const subtotal = App.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
          cartSubtotal.textContent = `$${subtotal.toLocaleString()} CUP`;
          cartTotal.textContent = `$${subtotal.toLocaleString()} CUP`; // Envío gratis, total = subtotal
      }
  }
  
  // Renderiza una lista de productos en el contenedor especificado
  function renderProducts(productsToRender, container) {
    if (container) {
      container.innerHTML = '';
      productsToRender.forEach(p => {
        const originalPrice = p.price !== 85000 ? `<span class="original-price">$${Math.round(p.price * 1.1).toLocaleString()}</span>` : '';
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
  }

  // Lógica de filtrado de productos para la página de búsqueda avanzada
  function filterProducts() {
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const minPrice = parseFloat(document.getElementById('min-price')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price')?.value) || Infinity;

    const filtered = App.products.filter(p => {
      const isCategoryMatch = !categoryFilter || p.category === categoryFilter;
      const isPriceMatch = p.price >= minPrice && p.price <= maxPrice;
      return isCategoryMatch && isPriceMatch;
    });

    if (filteredProductsContainer) {
      renderProducts(filtered, filteredProductsContainer);
    }
  }

  // Función para manejar el chatbot
  function addMessageToChat(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${sender}`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      chatbotBody.appendChild(messageDiv);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function handleChatbotResponse(message) {
      const lowerCaseMessage = message.toLowerCase();
      let botResponse = 'Lo siento, no entendí tu pregunta. ¿Podrías ser más específico? Puedes preguntar sobre nuestros productos, envíos, o devoluciones.';

      if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludos')) {
          botResponse = '¡Hola! ¿En qué puedo ayudarte hoy?';
      } else if (lowerCaseMessage.includes('productos') || lowerCaseMessage.includes('catálogo')) {
          botResponse = 'Puedes ver todos nuestros productos en la sección de <a href="products.html">Productos</a>. Tenemos laptops, teléfonos, y accesorios.';
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

  // --- Manejadores de Eventos ---

  // Evento para el menú de hamburguesa
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      const isExpanded = nav.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      hamburger.querySelector('i').className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
    });
  }

  // Evento para el cambio de tema
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    App.setTheme(newTheme);
    updateThemeIcon();
  });

  // Evento para el botón de cerrar sesión
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    App.logout();
  });

  // Evento para agregar productos al carrito (delegación de eventos)
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add');
    if (button && App.addToCart) {
      const productData = JSON.parse(button.dataset.product);
      App.addToCart(productData);
    }
  });
  
  // Evento para eliminar productos del carrito (delegación de eventos)
  document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn-remove');
      if (button && App.removeFromCart) {
          const cartId = button.dataset.cartId;
          App.removeFromCart(parseInt(cartId));
      }
  });

  // Evento para actualizar la cantidad del producto en el carrito (delegación de eventos)
  document.addEventListener('input', (e) => {
      const input = e.target.closest('.cart-item-quantity input');
      if (input && App.updateCartQuantity) {
          const cartId = input.dataset.cartId;
          const quantity = input.value;
          if (quantity > 0) {
              App.updateCartQuantity(parseInt(cartId), quantity);
          }
      }
  });

  // Evento para el botón de checkout
  checkoutBtn?.addEventListener('click', () => {
      if (App.cart.length > 0) {
          alert('Procediendo a la pasarela de pago... (Funcionalidad no implementada)');
          App.cart = [];
          localStorage.setItem('cart', JSON.stringify(App.cart));
          renderCartItems();
          updateCartCount();
      } else {
          alert('Tu carrito está vacío.');
      }
  });

  // Evento para redirección de categorías
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      localStorage.setItem('searchQuery', cat);
      location.href = 'products.html';
    });
  });

  // Eventos para la búsqueda avanzada
  const categoryFilter = document.getElementById('category-filter');
  const minPrice = document.getElementById('min-price');
  const maxPrice = document.getElementById('max-price');
  
  if (categoryFilter && minPrice && maxPrice) {
      categoryFilter.addEventListener('change', filterProducts);
      minPrice.addEventListener('input', filterProducts);
      maxPrice.addEventListener('input', filterProducts);
      filterProducts(); // Initial render
  }

  // Eventos para el chatbot
  if (chatbotToggle && chatbotClose && userInput && sendBtn) {
      chatbotToggle.addEventListener('click', () => {
          chatbotWindow.classList.toggle('active');
          const isChatbotActive = chatbotWindow.classList.contains('active');
          chatbotToggle.setAttribute('aria-label', isChatbotActive ? 'Cerrar Chatbot' : 'Abrir Chatbot');
          chatbotToggle.querySelector('i').className = isChatbotActive ? 'fas fa-times' : 'fas fa-comment-dots';
      });

      chatbotClose.addEventListener('click', () => {
          chatbotWindow.classList.remove('active');
          chatbotToggle.setAttribute('aria-label', 'Abrir Chatbot');
          chatbotToggle.querySelector('i').className = 'fas fa-comment-dots';
      });

      sendBtn.addEventListener('click', () => {
          const message = userInput.value.trim();
          if (message) {
              addMessageToChat(message, 'user');
              handleChatbotResponse(message);
              userInput.value = '';
          }
      });

      userInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              sendBtn.click();
          }
      });
  }

  // Eventos para formularios de autenticación
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    App.login(email, password);
  });

  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    App.register(name, email, password);
  });

  // --- Inicialización ---

  // Llama a las funciones iniciales para configurar la página
  function init() {
    updateCartCount();
    updateThemeIcon();
    
    // Renderiza productos si los contenedores existen
    if (productsContainer) {
      const query = localStorage.getItem('searchQuery');
      if (query) {
        const filteredProducts = App.products.filter(p => p.category === query);
        renderProducts(filteredProducts, productsContainer);
        localStorage.removeItem('searchQuery');
      } else {
        renderProducts(App.products, productsContainer);
      }
    }
    
    if (featuredProductsContainer) {
      const featuredProducts = App.products.filter(p => p.featured);
      renderProducts(featuredProducts, featuredProductsContainer);
    }

    // Configura la interfaz de usuario del usuario
    const user = App.user;
    if (user) {
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (profileLink) profileLink.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
      if (loginLink) loginLink.style.display = 'block';
      if (registerLink) registerLink.style.display = 'block';
      if (profileLink) profileLink.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  init();
});