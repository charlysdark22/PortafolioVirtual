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

  const products = window.getProducts().slice(0, 4) // Get first 4 products

  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">${product.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-primary-600 dark:text-primary-400">$${window.formatCurrency(product.price)}</span>
                    <button onclick="addToCart(${product.id})" class="btn-primary text-sm px-3 py-1" ${product.stock === 0 ? "disabled" : ""}>
                        ${product.stock === 0 ? window.translate("products.out_of_stock") : window.translate("products.add_to_cart")}
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const cart = window.getCart()
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// Update authentication UI
function updateAuthUI() {
  const user = window.getCurrentUser()
  const authLinks = document.getElementById("auth-links")
  const userLinks = document.getElementById("user-links")
  const adminLink = document.getElementById("admin-link")

  if (user) {
    if (authLinks) authLinks.classList.add("hidden")
    if (userLinks) userLinks.classList.remove("hidden")
    if (adminLink && user.role === "admin") adminLink.classList.remove("hidden")
  } else {
    if (authLinks) authLinks.classList.remove("hidden")
    if (userLinks) userLinks.classList.add("hidden")
    if (adminLink) adminLink.classList.add("hidden")
  }
}

// Show alert message
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-sm`
  alertDiv.textContent = message

  document.body.appendChild(alertDiv)

  setTimeout(() => {
    alertDiv.remove()
  }, 3000)
}

// Format currency
window.formatCurrency = (amount) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount)

// Debounce function for search
window.debounce = (func, wait) => {
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

// Placeholder functions for undeclared variables
window.getProducts = () => {
  // Implement getProducts logic here
  return []
}

window.translate = (key) => {
  // Implement translate logic here
  return key
}

window.getCart = () => {
  // Implement getCart logic here
  return []
}

window.getCurrentUser = () => {
  // Implement getCurrentUser logic here
  return null
}
