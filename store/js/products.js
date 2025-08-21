// Products system
class ProductsSystem {
  constructor() {
    this.products = JSON.parse(localStorage.getItem("products") || "[]")
    this.categories = JSON.parse(localStorage.getItem("categories") || "[]")
    this.initializeDefaultData()
  }

  initializeDefaultData() {
    if (this.categories.length === 0) {
      this.categories = [
        { id: 1, name: "Computadoras", slug: "computadoras", description: "PCs de escritorio potentes" },
        { id: 2, name: "Laptops", slug: "laptops", description: "Portátiles para trabajo y gaming" },
        { id: 3, name: "Teléfonos", slug: "telefonos", description: "Smartphones de última generación" },
        { id: 4, name: "Accesorios", slug: "accesorios", description: "Complementos y periféricos" },
      ]
      this.saveCategories()
    }

    if (this.products.length === 0) {
      this.products = [
        // Computadoras
        {
          id: 1,
          name: "PC Gaming RGB Pro",
          slug: "pc-gaming-rgb-pro",
          description: "Computadora gaming de alto rendimiento con iluminación RGB",
          price: 1299.99,
          originalPrice: 1499.99,
          categoryId: 1,
          stock: 15,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "Intel Core i7-12700K",
            "Memoria RAM": "32GB DDR4",
            Almacenamiento: "1TB NVMe SSD",
            "Tarjeta Gráfica": "NVIDIA RTX 4070",
            Fuente: "750W 80+ Gold",
          },
          featured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "PC Oficina Compacta",
          slug: "pc-oficina-compacta",
          description: "Computadora compacta ideal para oficina y trabajo",
          price: 599.99,
          categoryId: 1,
          stock: 25,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "Intel Core i5-12400",
            "Memoria RAM": "16GB DDR4",
            Almacenamiento: "512GB SSD",
            "Tarjeta Gráfica": "Intel UHD Graphics",
            Fuente: "450W",
          },
          featured: false,
          createdAt: new Date().toISOString(),
        },
        // Laptops
        {
          id: 3,
          name: "Laptop Gaming Predator",
          slug: "laptop-gaming-predator",
          description: 'Laptop gaming de 15.6" con pantalla 144Hz',
          price: 1599.99,
          originalPrice: 1799.99,
          categoryId: 2,
          stock: 8,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "Intel Core i7-12700H",
            "Memoria RAM": "16GB DDR5",
            Almacenamiento: "1TB NVMe SSD",
            "Tarjeta Gráfica": "NVIDIA RTX 4060",
            Pantalla: '15.6" FHD 144Hz',
          },
          featured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "MacBook Air M2",
          slug: "macbook-air-m2",
          description: "MacBook Air con chip M2, ultraligero y potente",
          price: 1199.99,
          categoryId: 2,
          stock: 12,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "Apple M2",
            "Memoria RAM": "8GB",
            Almacenamiento: "256GB SSD",
            Pantalla: '13.6" Liquid Retina',
            Batería: "Hasta 18 horas",
          },
          featured: true,
          createdAt: new Date().toISOString(),
        },
        // Teléfonos
        {
          id: 5,
          name: "iPhone 15 Pro",
          slug: "iphone-15-pro",
          description: "iPhone 15 Pro con chip A17 Pro y cámara de 48MP",
          price: 999.99,
          categoryId: 3,
          stock: 20,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "A17 Pro",
            Almacenamiento: "128GB",
            Cámara: "48MP + 12MP + 12MP",
            Pantalla: '6.1" Super Retina XDR',
            Batería: "Hasta 23 horas de video",
          },
          featured: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Samsung Galaxy S24",
          slug: "samsung-galaxy-s24",
          description: "Galaxy S24 con IA integrada y cámara profesional",
          price: 799.99,
          categoryId: 3,
          stock: 18,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Procesador: "Snapdragon 8 Gen 3",
            "Memoria RAM": "8GB",
            Almacenamiento: "256GB",
            Cámara: "50MP + 12MP + 10MP",
            Pantalla: '6.2" Dynamic AMOLED 2X',
          },
          featured: false,
          createdAt: new Date().toISOString(),
        },
        // Accesorios
        {
          id: 7,
          name: "Teclado Mecánico RGB",
          slug: "teclado-mecanico-rgb",
          description: "Teclado mecánico gaming con switches Cherry MX",
          price: 129.99,
          categoryId: 4,
          stock: 30,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Switches: "Cherry MX Red",
            Iluminación: "RGB por tecla",
            Conectividad: "USB-C",
            Teclas: "104 teclas",
            Material: "Aluminio",
          },
          featured: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 8,
          name: "Mouse Gaming Inalámbrico",
          slug: "mouse-gaming-inalambrico",
          description: "Mouse gaming inalámbrico con sensor de 25,600 DPI",
          price: 79.99,
          categoryId: 4,
          stock: 45,
          image: "/placeholder.svg?height=300&width=300",
          images: ["/placeholder.svg?height=300&width=300"],
          specifications: {
            Sensor: "25,600 DPI",
            Conectividad: "2.4GHz + Bluetooth",
            Batería: "Hasta 70 horas",
            Botones: "6 programables",
            Peso: "99g",
          },
          featured: false,
          createdAt: new Date().toISOString(),
        },
      ]
      this.saveProducts()
    }
  }

  saveProducts() {
    localStorage.setItem("products", JSON.stringify(this.products))
  }

  saveCategories() {
    localStorage.setItem("categories", JSON.stringify(this.categories))
  }

  getProducts(filters = {}) {
    let filteredProducts = [...this.products]

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter((p) => p.categoryId === filters.categoryId)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm),
      )
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice)
    }

    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice)
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0)
    }

    if (filters.featured) {
      filteredProducts = filteredProducts.filter((p) => p.featured)
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "name-asc":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "newest":
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
      }
    }

    return filteredProducts
  }

  getProductById(id) {
    return this.products.find((p) => p.id === Number.parseInt(id))
  }

  getProductBySlug(slug) {
    return this.products.find((p) => p.slug === slug)
  }

  getCategories() {
    return this.categories
  }

  getCategoryById(id) {
    return this.categories.find((c) => c.id === Number.parseInt(id))
  }

  getCategoryBySlug(slug) {
    return this.categories.find((c) => c.slug === slug)
  }

  getFeaturedProducts(limit = 4) {
    return this.products.filter((p) => p.featured).slice(0, limit)
  }

  addProduct(productData) {
    const newProduct = {
      id: Date.now(),
      ...productData,
      createdAt: new Date().toISOString(),
    }
    this.products.push(newProduct)
    this.saveProducts()
    return newProduct
  }

  updateProduct(id, productData) {
    const index = this.products.findIndex((p) => p.id === Number.parseInt(id))
    if (index === -1) return null

    this.products[index] = { ...this.products[index], ...productData }
    this.saveProducts()
    return this.products[index]
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === Number.parseInt(id))
    if (index === -1) return false

    this.products.splice(index, 1)
    this.saveProducts()
    return true
  }
}

// Global products instance
window.productsSystem = new ProductsSystem()

// Global product functions
window.getProducts = (filters = {}) => window.productsSystem.getProducts(filters)

window.getProductById = (id) => window.productsSystem.getProductById(id)

window.getProductBySlug = (slug) => window.productsSystem.getProductBySlug(slug)

window.getCategories = () => window.productsSystem.getCategories()

window.getCategoryById = (id) => window.productsSystem.getCategoryById(id)

window.getCategoryBySlug = (slug) => window.productsSystem.getCategoryBySlug(slug)

window.getFeaturedProducts = (limit = 4) => window.productsSystem.getFeaturedProducts(limit)
