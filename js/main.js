// Main application logic
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // User menu toggle
  const userMenuButton = document.getElementById("user-menu-button")
  const userMenu = document.getElementById("user-menu")

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener("click", () => {
      userMenu.classList.toggle("hidden")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.add("hidden")
      }
    })
  }

  // Load featured products
  loadFeaturedProducts()

  // Update cart count
  updateCartCount()

  // Update auth UI
  updateAuthUI()
})

// Load featured products
function loadFeaturedProducts() {
  const container = document.getElementById("featured-products")
  if (!container) return

  const products = window.getProducts ? window.getProducts().slice(0, 4) : []

  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">${product.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${product.description?.substring(0, 80) || ""}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-blue-600 dark:text-blue-400">$${product.price.toFixed(2)}</span>
                    <button onclick="addToCartFromProduct('${product.id}')" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}" ${product.stock === 0 ? "disabled" : ""}>
                        ${product.stock === 0 ? (window.translate ? window.translate("products.out_of_stock") : "Agotado") : window.translate ? window.translate("products.add_to_cart") : "Agregar al Carrito"}
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function addToCartFromProduct(productId) {
  if (!window.getProducts || !window.addToCart) return

  const product = window.getProducts().find((p) => p.id === productId)
  if (product && product.stock > 0) {
    window.addToCart(product)
    updateCartCount()
    const message = window.translate ? window.translate("cart.added") : "Producto agregado al carrito"
    showAlert(message, "success")
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const cart = window.getCart ? window.getCart() : []
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems

    // Show/hide cart count badge
    if (totalItems > 0) {
      cartCount.classList.remove("hidden")
    } else {
      cartCount.classList.add("hidden")
    }
  }
}

// Update authentication UI
function updateAuthUI() {
  const user = window.getCurrentUser ? window.getCurrentUser() : null
  const authLinks = document.getElementById("auth-links")
  const userLinks = document.getElementById("user-links")
  const adminLink = document.getElementById("admin-link")
  const userNameElement = document.getElementById("user-name")

  if (user) {
    if (authLinks) authLinks.classList.add("hidden")
    if (userLinks) userLinks.classList.remove("hidden")
    if (userNameElement) userNameElement.textContent = user.name || user.email
    if (adminLink && user.isAdmin) adminLink.classList.remove("hidden")
  } else {
    if (authLinks) authLinks.classList.remove("hidden")
    if (userLinks) userLinks.classList.add("hidden")
    if (adminLink) adminLink.classList.add("hidden")
  }
}

// Show alert message
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div")
  const alertClasses = {
    success: "bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
    error: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
    warning:
      "bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200",
    info: "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200",
  }

  alertDiv.className = `fixed top-4 right-4 z-50 max-w-sm p-4 border-l-4 rounded-lg shadow-lg ${alertClasses[type] || alertClasses.success}`
  alertDiv.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === "success" ? "✓" : type === "error" ? "✗" : type === "warning" ? "⚠" : "ℹ"}</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-lg font-bold">&times;</button>
    </div>
  `

  document.body.appendChild(alertDiv)

  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

function initializeSearch() {
  const searchInput = document.getElementById("search-input")
  const searchResults = document.getElementById("search-results")

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        const query = e.target.value.toLowerCase().trim()

        if (query.length < 2) {
          if (searchResults) searchResults.classList.add("hidden")
          return
        }

        if (!window.getProducts) return

        const products = window.getProducts()
        const filteredProducts = products
          .filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query),
          )
          .slice(0, 5)

        if (searchResults && filteredProducts.length > 0) {
          searchResults.innerHTML = filteredProducts
            .map(
              (product) => `
          <a href="producto.html?id=${product.id}" class="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-3">
              <img src="${product.image}" alt="${product.name}" class="w-10 h-10 object-cover rounded">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">${product.name}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">$${product.price.toFixed(2)}</div>
              </div>
            </div>
          </a>
        `,
            )
            .join("")
          searchResults.classList.remove("hidden")
        } else if (searchResults) {
          searchResults.classList.add("hidden")
        }
      }, 300),
    )

    // Hide search results when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && searchResults && !searchResults.contains(e.target)) {
        searchResults.classList.add("hidden")
      }
    })
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CU", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSearch()

  // Update translations
  if (typeof window.updateTranslations === "function") {
    window.updateTranslations()
  }

  // Set up periodic cart count updates
  setInterval(updateCartCount, 1000)
})

window.showAlert = showAlert
window.formatCurrency = formatCurrency
window.debounce = debounce
window.updateCartCount = updateCartCount
window.updateAuthUI = updateAuthUI
