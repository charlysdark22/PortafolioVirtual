// Shopping cart system
class CartSystem {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart") || "[]")
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart))
    this.updateCartCount()
  }

  addItem(productId, quantity = 1) {
    const product = window.getProductById(productId)
    if (!product) return { success: false, message: "Producto no encontrado" }

    if (product.stock < quantity) {
      return { success: false, message: "Stock insuficiente" }
    }

    const existingItem = this.cart.find((item) => item.productId === productId)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (product.stock < newQuantity) {
        return { success: false, message: "Stock insuficiente" }
      }
      existingItem.quantity = newQuantity
    } else {
      this.cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    this.saveCart()
    return { success: true, message: "Producto agregado al carrito" }
  }

  removeItem(productId) {
    this.cart = this.cart.filter((item) => item.productId !== productId)
    this.saveCart()
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find((item) => item.productId === productId)
    if (!item) return { success: false, message: "Producto no encontrado en el carrito" }

    const product = window.getProductById(productId)
    if (!product) return { success: false, message: "Producto no encontrado" }

    if (quantity <= 0) {
      this.removeItem(productId)
      return { success: true, message: "Producto eliminado del carrito" }
    }

    if (product.stock < quantity) {
      return { success: false, message: "Stock insuficiente" }
    }

    item.quantity = quantity
    this.saveCart()
    return { success: true, message: "Cantidad actualizada" }
  }

  getCart() {
    return this.cart
  }

  getCartWithProducts() {
    return this.cart
      .map((item) => {
        const product = window.getProductById(item.productId)
        return {
          ...item,
          product,
          subtotal: product ? product.price * item.quantity : 0,
        }
      })
      .filter((item) => item.product) // Filter out items with missing products
  }

  getTotal() {
    return this.getCartWithProducts().reduce((total, item) => total + item.subtotal, 0)
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0)
  }

  clearCart() {
    this.cart = []
    this.saveCart()
  }

  updateCartCount() {
    const cartCount = document.getElementById("cart-count")
    if (cartCount) {
      cartCount.textContent = this.getItemCount()
    }
  }
}

// Global cart instance
window.cartSystem = new CartSystem()

// Global cart functions
window.addToCart = (productId, quantity = 1) => {
  const result = window.cartSystem.addItem(productId, quantity)
  if (result.success) {
    window.showAlert && window.showAlert(result.message, "success")
  } else {
    window.showAlert && window.showAlert(result.message, "error")
  }
  return result
}

window.removeFromCart = (productId) => {
  window.cartSystem.removeItem(productId)
  window.showAlert && window.showAlert("Producto eliminado del carrito", "success")
}

window.updateCartQuantity = (productId, quantity) => {
  const result = window.cartSystem.updateQuantity(productId, quantity)
  if (result.success) {
    window.showAlert && window.showAlert(result.message, "success")
  } else {
    window.showAlert && window.showAlert(result.message, "error")
  }
  return result
}

window.getCart = () => window.cartSystem.getCart()

window.getCartWithProducts = () => window.cartSystem.getCartWithProducts()

window.getCartTotal = () => window.cartSystem.getTotal()

window.clearCart = () => {
  window.cartSystem.clearCart()
  window.showAlert && window.showAlert("Carrito vaciado", "success")
}

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  window.cartSystem.updateCartCount()
})
