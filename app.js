// app.js
class CharlieApp {
  constructor() {
    this.lang = localStorage.getItem("lang") || "es";
    this.theme = localStorage.getItem("theme") || "light";
    this.user = JSON.parse(localStorage.getItem("user"));
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];

    this.translations = {
      es: {
        welcome: "Bienvenido a Charlie's Tecnologi",
        subtitle: "Tecnología de calidad en Cuba",
        products: "Productos",
        offers: "Ofertas",
        support: "Soporte",
        login: "Iniciar sesión",
        register: "Registrarse",
        logout: "Cerrar sesión",
        cart: "Carrito",
        addToCart: "Añadir al carrito",
        viewDetails: "Ver Detalles",
        total: "Total",
        checkout: "Finalizar compra",
        continue: "Seguir comprando",
        empty: "Tu carrito está vacío",
        search: "Buscar productos...",
        contact: "Contáctanos",
        faq: "Preguntas Frecuentes",
        hours: "Horario: Lunes a Sábado, 9:00 AM - 8:00 PM",
        theme: "🌙",
        themeDark: "☀️",
        langEs: "🇪🇸",
        langEn: "🇬🇧"
      },
      en: {
        welcome: "Welcome to Charlie's Tecnologi",
        subtitle: "Quality technology in Cuba",
        products: "Products",
        offers: "Offers",
        support: "Support",
        login: "Login",
        register: "Register",
        logout: "Logout",
        cart: "Cart",
        addToCart: "Add to Cart",
        viewDetails: "View Details",
        total: "Total",
        checkout: "Checkout",
        continue: "Continue Shopping",
        empty: "Your cart is empty",
        search: "Search products...",
        contact: "Contact Us",
        faq: "Frequently Asked Questions",
        hours: "Hours: Mon-Sat, 9:00 AM - 8:00 PM",
        theme: "☀️",
        themeDark: "🌙",
        langEs: "🇪🇸",
        langEn: "🇬🇧"
      }
    };
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const el = document.getElementById("themeToggle");
    if (el) el.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem("lang", lang);
    this.translatePage();
  }

  translatePage() {
    const t = this.translations[this.lang];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    const langEl = document.getElementById("langToggle");
    if (langEl) langEl.textContent = t[`lang${this.lang === 'es' ? 'En' : 'Es'}`];
  }

  updateCartCount() {
    const el = document.getElementById("cartCount");
    if (el) el.textContent = this.cart.length;
  }

  addToCart(product) {
    this.cart.push(product);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateCartCount();
    alert(`${product.name} añadido al carrito`);
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    location.reload();
  }

  init() {
    this.setTheme(this.theme);
    this.translatePage();
    this.updateCartCount();
  }
}

const App = new CharlieApp();