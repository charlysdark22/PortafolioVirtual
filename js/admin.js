// Sistema de administración
class AdminSystem {
  constructor() {
    this.currentUser = null
  }

  // Verificar si el usuario actual es administrador
  isAdmin() {
    const user = window.getCurrentUser() // Assuming getCurrentUser is a global function
    return user && user.isAdmin === true
  }

  // Obtener estadísticas del dashboard
  getDashboardStats() {
    const products = window.getProducts() // Assuming getProducts is a global function
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.total || 0)
    }, 0)

    const recentOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

    const lowStockProducts = products.filter((product) => product.stock < 10)

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: totalRevenue,
      recentOrders: recentOrders,
      lowStockProducts: lowStockProducts,
    }
  }

  // Gestión de productos
  addProduct(productData) {
    const products = window.getProducts() // Assuming getProducts is a global function
    const newProduct = {
      id: "prod-" + Date.now(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)
    localStorage.setItem("products", JSON.stringify(products))
    return newProduct
  }

  updateProduct(productId, productData) {
    const products = window.getProducts() // Assuming getProducts is a global function
    const index = products.findIndex((p) => p.id === productId)

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("products", JSON.stringify(products))
      return products[index]
    }
    return null
  }

  deleteProduct(productId) {
    const products = window.getProducts() // Assuming getProducts is a global function
    const filteredProducts = products.filter((p) => p.id !== productId)
    localStorage.setItem("products", JSON.stringify(filteredProducts))
    return true
  }

  // Gestión de pedidos
  getOrders() {
    return JSON.parse(localStorage.getItem("orders") || "[]")
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders()
    const index = orders.findIndex((o) => o.id === orderId)

    if (index !== -1) {
      orders[index].status = status
      orders[index].updatedAt = new Date().toISOString()
      localStorage.setItem("orders", JSON.stringify(orders))
      return orders[index]
    }
    return null
  }

  // Gestión de usuarios
  getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]")
  }

  updateUserStatus(userId, status) {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === userId)

    if (index !== -1) {
      users[index].status = status
      users[index].updatedAt = new Date().toISOString()
      localStorage.setItem("users", JSON.stringify(users))
      return users[index]
    }
    return null
  }

  toggleUserAdmin(userId) {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === userId)

    if (index !== -1) {
      users[index].isAdmin = !users[index].isAdmin
      users[index].updatedAt = new Date().toISOString()
      localStorage.setItem("users", JSON.stringify(users))
      return users[index]
    }
    return null
  }

  // Configuración de la tienda
  getStoreConfig() {
    return JSON.parse(
      localStorage.getItem("storeConfig") ||
        JSON.stringify({
          storeName: "TechStore Cuba",
          storeDescription: "Tu tienda de tecnología en Cuba",
          currency: "USD",
          language: "es",
          theme: "light",
          shippingCost: 15.0,
          taxRate: 0.0,
          allowRegistration: true,
          maintenanceMode: false,
        }),
    )
  }

  updateStoreConfig(config) {
    const currentConfig = this.getStoreConfig()
    const updatedConfig = {
      ...currentConfig,
      ...config,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("storeConfig", JSON.stringify(updatedConfig))
    return updatedConfig
  }

  // Reportes y análisis
  getSalesReport(startDate, endDate) {
    const orders = this.getOrders()
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= startDate && orderDate <= endDate
    })

    const totalSales = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = filteredOrders.length

    // Ventas por categoría
    const salesByCategory = {}
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!salesByCategory[item.category]) {
          salesByCategory[item.category] = 0
        }
        salesByCategory[item.category] += item.price * item.quantity
      })
    })

    // Productos más vendidos
    const productSales = {}
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[item.id].quantity += item.quantity
        productSales[item.id].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    return {
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      salesByCategory,
      topProducts,
      orders: filteredOrders,
    }
  }
}

// Instancia global del sistema de administración
const adminSystem = new AdminSystem()

// Funciones de utilidad para el admin
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CU", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("es-CU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }
  return statusClasses[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
}

// Exportar para uso global
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AdminSystem, adminSystem }
}
