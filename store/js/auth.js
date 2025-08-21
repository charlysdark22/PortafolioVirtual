// Authentication system
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users") || "[]")
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
    this.initializeDefaultUsers()
  }

  initializeDefaultUsers() {
    if (this.users.length === 0) {
      // Add default admin user
      this.users.push({
        id: 1,
        name: "Administrador",
        email: "admin@techstore.com",
        password: "admin123",
        phone: "+53 5555-5555",
        role: "admin",
        createdAt: new Date().toISOString(),
      })

      // Add default customer user
      this.users.push({
        id: 2,
        name: "Usuario Demo",
        email: "demo@techstore.com",
        password: "demo123",
        phone: "+53 5555-1234",
        role: "customer",
        createdAt: new Date().toISOString(),
      })

      this.saveUsers()
    }
  }

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users))
  }

  saveCurrentUser() {
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
  }

  login(email, password) {
    const user = this.users.find((u) => u.email === email && u.password === password)
    if (user) {
      this.currentUser = { ...user }
      delete this.currentUser.password // Don't store password in session
      this.saveCurrentUser()
      return { success: true, user: this.currentUser }
    }
    return { success: false, message: "Credenciales inválidas" }
  }

  register(userData) {
    // Check if email already exists
    if (this.users.find((u) => u.email === userData.email)) {
      return { success: false, message: "El email ya está registrado" }
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || "",
      role: "customer",
      createdAt: new Date().toISOString(),
    }

    this.users.push(newUser)
    this.saveUsers()

    // Auto login after registration
    const loginResult = this.login(userData.email, userData.password)
    return loginResult
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  getCurrentUser() {
    return this.currentUser
  }

  isLoggedIn() {
    return this.currentUser !== null
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === "admin"
  }

  updateProfile(userData) {
    if (!this.currentUser) return { success: false, message: "No hay usuario logueado" }

    const userIndex = this.users.findIndex((u) => u.id === this.currentUser.id)
    if (userIndex === -1) return { success: false, message: "Usuario no encontrado" }

    // Update user data
    this.users[userIndex] = { ...this.users[userIndex], ...userData }
    this.currentUser = { ...this.users[userIndex] }
    delete this.currentUser.password

    this.saveUsers()
    this.saveCurrentUser()

    return { success: true, user: this.currentUser }
  }

  getAllUsers() {
    if (!this.isAdmin()) return []
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }
}

// Global auth instance
window.authSystem = new AuthSystem()

// Global auth functions
window.login = (email, password) => window.authSystem.login(email, password)

window.register = (userData) => window.authSystem.register(userData)

window.logout = () => {
  window.authSystem.logout()
  window.location.href = "index.html"
}

window.getCurrentUser = () => window.authSystem.getCurrentUser()

window.isLoggedIn = () => window.authSystem.isLoggedIn()

window.isAdmin = () => window.authSystem.isAdmin()

// Logout button handler
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.logout()
    })
  }
})
