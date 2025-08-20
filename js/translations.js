// Translation system
const translations = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.categories": "Categorías",

    // Hero
    "hero.title": "La Mejor Tecnología a Tu Alcance",
    "hero.subtitle": "Computadoras, laptops, teléfonos y accesorios de las mejores marcas",
    "hero.cta": "Ver Productos",

    // Categories
    "categories.title": "Categorías Destacadas",
    "categories.computers": "Computadoras",
    "categories.computers_desc": "PCs de escritorio potentes",
    "categories.laptops": "Laptops",
    "categories.laptops_desc": "Portátiles para trabajo y gaming",
    "categories.phones": "Teléfonos",
    "categories.phones_desc": "Smartphones de última generación",
    "categories.accessories": "Accesorios",
    "categories.accessories_desc": "Complementos y periféricos",
    "categories.view_all": "Ver Todo",

    // Products
    "products.featured": "Productos Destacados",
    "products.view_all": "Ver Todos los Productos",
    "products.add_to_cart": "Agregar al Carrito",
    "products.out_of_stock": "Agotado",
    "products.price": "Precio",
    "products.specifications": "Especificaciones",

    // Auth
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.logout": "Cerrar Sesión",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.confirm_password": "Confirmar Contraseña",
    "auth.name": "Nombre Completo",
    "auth.phone": "Teléfono",

    // User
    "user.profile": "Mi Perfil",
    "user.orders": "Mis Pedidos",

    // Cart
    "cart.title": "Carrito de Compras",
    "cart.empty": "Tu carrito está vacío",
    "cart.quantity": "Cantidad",
    "cart.total": "Total",
    "cart.checkout": "Proceder al Pago",
    "cart.remove": "Eliminar",

    // Checkout
    "checkout.title": "Finalizar Compra",
    "checkout.subtitle": "Complete su información para procesar el pedido",
    "checkout.shipping_info": "Información de Envío",
    "checkout.first_name": "Nombre",
    "checkout.last_name": "Apellidos",
    "checkout.email": "Email",
    "checkout.phone": "Teléfono",
    "checkout.address": "Dirección",
    "checkout.city": "Ciudad",
    "checkout.province": "Provincia",
    "checkout.notes": "Notas del pedido (opcional)",
    "checkout.order_summary": "Resumen del Pedido",
    "checkout.subtotal": "Subtotal",
    "checkout.shipping": "Envío",
    "checkout.total": "Total",
    "checkout.proceed_payment": "Proceder al Pago",

    // Payment
    "payment.title": "Método de Pago",
    "payment.subtitle": "Seleccione su método de pago preferido",
    "payment.methods": "Métodos de Pago Disponibles",
    "payment.transfermovil_desc": "Pago mediante la aplicación Transfermóvil",
    "payment.enzona_desc": "Pago mediante la plataforma Enzona",
    "payment.bank_selection": "Seleccionar Banco",
    "payment.card_number": "Número de Tarjeta",
    "payment.expiry": "Vencimiento",
    "payment.cvv": "CVV",
    "payment.cardholder": "Nombre del Titular",
    "payment.back": "Volver",
    "payment.process": "Procesar Pago",
    "payment.order_summary": "Resumen del Pedido",
    "payment.total": "Total a Pagar",

    // Confirmation
    "confirmation.title": "¡Pedido Confirmado!",
    "confirmation.subtitle": "Gracias por su compra. Su pedido ha sido procesado exitosamente.",
    "confirmation.order_details": "Detalles del Pedido",
    "confirmation.order_number": "Número de Pedido",
    "confirmation.order_date": "Fecha del Pedido",
    "confirmation.payment_method": "Método de Pago",
    "confirmation.status": "Estado",
    "confirmation.confirmed": "Confirmado",
    "confirmation.items_ordered": "Productos Pedidos",
    "confirmation.total_paid": "Total Pagado",
    "confirmation.shipping_info": "Información de Envío",
    "confirmation.next_steps": "Próximos Pasos",
    "confirmation.step1": "• Recibirá un email de confirmación en breve",
    "confirmation.step2": "• Su pedido será procesado en 1-2 días hábiles",
    "confirmation.step3": "• Le notificaremos cuando su pedido sea enviado",
    "confirmation.step4": "• Tiempo estimado de entrega: 3-5 días hábiles",
    "confirmation.view_orders": "Ver Mis Pedidos",
    "confirmation.continue_shopping": "Seguir Comprando",

    // Admin
    "admin.panel": "Panel Admin",
    "admin.dashboard": "Dashboard",
    "admin.products": "Productos",
    "admin.orders": "Pedidos",
    "admin.users": "Usuarios",
    "admin.settings": "Configuración",
    "admin.logout": "Cerrar Sesión",
    "admin.dashboard_title": "Dashboard de Administrador",
    "admin.dashboard_subtitle": "Resumen general de la tienda",
    "admin.total_products": "Total Productos",
    "admin.total_orders": "Total Pedidos",
    "admin.total_users": "Total Usuarios",
    "admin.total_revenue": "Ingresos Totales",
    "admin.recent_orders": "Pedidos Recientes",
    "admin.low_stock": "Stock Bajo",
    "admin.view_all": "Ver todos",
    "admin.manage": "Gestionar",
    "admin.view_store": "Ver Tienda",

    // Footer
    "footer.description": "Tu tienda de confianza para tecnología de calidad",
    "footer.categories": "Categorías",
    "footer.support": "Soporte",
    "footer.contact": "Contacto",
    "footer.help": "Ayuda",
    "footer.shipping": "Envíos",
    "footer.returns": "Devoluciones",
    "footer.payment": "Métodos de Pago",
    "footer.rights": "Todos los derechos reservados.",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.categories": "Categories",

    // Hero
    "hero.title": "The Best Technology at Your Reach",
    "hero.subtitle": "Computers, laptops, phones and accessories from the best brands",
    "hero.cta": "View Products",

    // Categories
    "categories.title": "Featured Categories",
    "categories.computers": "Computers",
    "categories.computers_desc": "Powerful desktop PCs",
    "categories.laptops": "Laptops",
    "categories.laptops_desc": "Portable for work and gaming",
    "categories.phones": "Phones",
    "categories.phones_desc": "Latest generation smartphones",
    "categories.accessories": "Accessories",
    "categories.accessories_desc": "Complements and peripherals",
    "categories.view_all": "View All",

    // Products
    "products.featured": "Featured Products",
    "products.view_all": "View All Products",
    "products.add_to_cart": "Add to Cart",
    "products.out_of_stock": "Out of Stock",
    "products.price": "Price",
    "products.specifications": "Specifications",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm_password": "Confirm Password",
    "auth.name": "Full Name",
    "auth.phone": "Phone",

    // User
    "user.profile": "My Profile",
    "user.orders": "My Orders",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.quantity": "Quantity",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.remove": "Remove",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.subtitle": "Complete your information to process the order",
    "checkout.shipping_info": "Shipping Information",
    "checkout.first_name": "First Name",
    "checkout.last_name": "Last Name",
    "checkout.email": "Email",
    "checkout.phone": "Phone",
    "checkout.address": "Address",
    "checkout.city": "City",
    "checkout.province": "Province",
    "checkout.notes": "Order notes (optional)",
    "checkout.order_summary": "Order Summary",
    "checkout.subtotal": "Subtotal",
    "checkout.shipping": "Shipping",
    "checkout.total": "Total",
    "checkout.proceed_payment": "Proceed to Payment",

    // Payment
    "payment.title": "Payment Method",
    "payment.subtitle": "Select your preferred payment method",
    "payment.methods": "Available Payment Methods",
    "payment.transfermovil_desc": "Payment via Transfermóvil app",
    "payment.enzona_desc": "Payment via Enzona platform",
    "payment.bank_selection": "Select Bank",
    "payment.card_number": "Card Number",
    "payment.expiry": "Expiry",
    "payment.cvv": "CVV",
    "payment.cardholder": "Cardholder Name",
    "payment.back": "Back",
    "payment.process": "Process Payment",
    "payment.order_summary": "Order Summary",
    "payment.total": "Total to Pay",

    // Confirmation
    "confirmation.title": "Order Confirmed!",
    "confirmation.subtitle": "Thank you for your purchase. Your order has been processed successfully.",
    "confirmation.order_details": "Order Details",
    "confirmation.order_number": "Order Number",
    "confirmation.order_date": "Order Date",
    "confirmation.payment_method": "Payment Method",
    "confirmation.status": "Status",
    "confirmation.confirmed": "Confirmed",
    "confirmation.items_ordered": "Items Ordered",
    "confirmation.total_paid": "Total Paid",
    "confirmation.shipping_info": "Shipping Information",
    "confirmation.next_steps": "Next Steps",
    "confirmation.step1": "• You will receive a confirmation email shortly",
    "confirmation.step2": "• Your order will be processed in 1-2 business days",
    "confirmation.step3": "• We will notify you when your order is shipped",
    "confirmation.step4": "• Estimated delivery time: 3-5 business days",
    "confirmation.view_orders": "View My Orders",
    "confirmation.continue_shopping": "Continue Shopping",

    // Admin
    "admin.panel": "Admin Panel",
    "admin.dashboard": "Dashboard",
    "admin.products": "Products",
    "admin.orders": "Orders",
    "admin.users": "Users",
    "admin.settings": "Settings",
    "admin.logout": "Logout",
    "admin.dashboard_title": "Administrator Dashboard",
    "admin.dashboard_subtitle": "General store overview",
    "admin.total_products": "Total Products",
    "admin.total_orders": "Total Orders",
    "admin.total_users": "Total Users",
    "admin.total_revenue": "Total Revenue",
    "admin.recent_orders": "Recent Orders",
    "admin.low_stock": "Low Stock",
    "admin.view_all": "View all",
    "admin.manage": "Manage",
    "admin.view_store": "View Store",

    // Footer
    "footer.description": "Your trusted store for quality technology",
    "footer.categories": "Categories",
    "footer.support": "Support",
    "footer.contact": "Contact",
    "footer.help": "Help",
    "footer.shipping": "Shipping",
    "footer.returns": "Returns",
    "footer.payment": "Payment Methods",
    "footer.rights": "All rights reserved.",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.categories": "Catégories",

    // Hero
    "hero.title": "La Meilleure Technologie à Votre Portée",
    "hero.subtitle": "Ordinateurs, laptops, téléphones et accessoires des meilleures marques",
    "hero.cta": "Voir les Produits",

    // Categories
    "categories.title": "Catégories en Vedette",
    "categories.computers": "Ordinateurs",
    "categories.computers_desc": "PCs de bureau puissants",
    "categories.laptops": "Laptops",
    "categories.laptops_desc": "Portables pour travail et gaming",
    "categories.phones": "Téléphones",
    "categories.phones_desc": "Smartphones de dernière génération",
    "categories.accessories": "Accessoires",
    "categories.accessories_desc": "Compléments et périphériques",
    "categories.view_all": "Voir Tout",

    // Products
    "products.featured": "Produits en Vedette",
    "products.view_all": "Voir Tous les Produits",
    "products.add_to_cart": "Ajouter au Panier",
    "products.out_of_stock": "Épuisé",
    "products.price": "Prix",
    "products.specifications": "Spécifications",

    // Auth
    "auth.login": "Se Connecter",
    "auth.register": "S'inscrire",
    "auth.logout": "Se Déconnecter",
    "auth.email": "Email",
    "auth.password": "Mot de Passe",
    "auth.confirm_password": "Confirmer le Mot de Passe",
    "auth.name": "Nom Complet",
    "auth.phone": "Téléphone",

    // User
    "user.profile": "Mon Profil",
    "user.orders": "Mes Commandes",

    // Cart
    "cart.title": "Panier d'Achat",
    "cart.empty": "Votre panier est vide",
    "cart.quantity": "Quantité",
    "cart.total": "Total",
    "cart.checkout": "Procéder au Paiement",
    "cart.remove": "Supprimer",

    // Checkout
    "checkout.title": "Finaliser l'Achat",
    "checkout.subtitle": "Complétez vos informations pour traiter la commande",
    "checkout.shipping_info": "Informations de Livraison",
    "checkout.first_name": "Prénom",
    "checkout.last_name": "Nom",
    "checkout.email": "Email",
    "checkout.phone": "Téléphone",
    "checkout.address": "Adresse",
    "checkout.city": "Ville",
    "checkout.province": "Province",
    "checkout.notes": "Notes de commande (optionnel)",
    "checkout.order_summary": "Résumé de la Commande",
    "checkout.subtotal": "Sous-total",
    "checkout.shipping": "Livraison",
    "checkout.total": "Total",
    "checkout.proceed_payment": "Procéder au Paiement",

    // Payment
    "payment.title": "Méthode de Paiement",
    "payment.subtitle": "Sélectionnez votre méthode de paiement préférée",
    "payment.methods": "Méthodes de Paiement Disponibles",
    "payment.transfermovil_desc": "Paiement via l'app Transfermóvil",
    "payment.enzona_desc": "Paiement via la plateforme Enzona",
    "payment.bank_selection": "Sélectionner la Banque",
    "payment.card_number": "Numéro de Carte",
    "payment.expiry": "Expiration",
    "payment.cvv": "CVV",
    "payment.cardholder": "Nom du Titulaire",
    "payment.back": "Retour",
    "payment.process": "Traiter le Paiement",
    "payment.order_summary": "Résumé de la Commande",
    "payment.total": "Total à Payer",

    // Confirmation
    "confirmation.title": "Commande Confirmée!",
    "confirmation.subtitle": "Merci pour votre achat. Votre commande a été traitée avec succès.",
    "confirmation.order_details": "Détails de la Commande",
    "confirmation.order_number": "Numéro de Commande",
    "confirmation.order_date": "Date de Commande",
    "confirmation.payment_method": "Méthode de Paiement",
    "confirmation.status": "Statut",
    "confirmation.confirmed": "Confirmé",
    "confirmation.items_ordered": "Articles Commandés",
    "confirmation.total_paid": "Total Payé",
    "confirmation.shipping_info": "Informations de Livraison",
    "confirmation.next_steps": "Prochaines Étapes",
    "confirmation.step1": "• Vous recevrez un email de confirmation sous peu",
    "confirmation.step2": "• Votre commande sera traitée en 1-2 jours ouvrables",
    "confirmation.step3": "• Nous vous notifierons quand votre commande sera expédiée",
    "confirmation.step4": "• Temps de livraison estimé: 3-5 jours ouvrables",
    "confirmation.view_orders": "Voir Mes Commandes",
    "confirmation.continue_shopping": "Continuer les Achats",

    // Admin
    "admin.panel": "Panneau Admin",
    "admin.dashboard": "Tableau de Bord",
    "admin.products": "Produits",
    "admin.orders": "Commandes",
    "admin.users": "Utilisateurs",
    "admin.settings": "Paramètres",
    "admin.logout": "Se Déconnecter",
    "admin.dashboard_title": "Tableau de Bord Administrateur",
    "admin.dashboard_subtitle": "Aperçu général du magasin",
    "admin.total_products": "Total Produits",
    "admin.total_orders": "Total Commandes",
    "admin.total_users": "Total Utilisateurs",
    "admin.total_revenue": "Revenus Totaux",
    "admin.recent_orders": "Commandes Récentes",
    "admin.low_stock": "Stock Faible",
    "admin.view_all": "Voir tout",
    "admin.manage": "Gérer",
    "admin.view_store": "Voir le Magasin",

    // Footer
    "footer.description": "Votre magasin de confiance pour la technologie de qualité",
    "footer.categories": "Catégories",
    "footer.support": "Support",
    "footer.contact": "Contact",
    "footer.help": "Aide",
    "footer.shipping": "Livraison",
    "footer.returns": "Retours",
    "footer.payment": "Méthodes de Paiement",
    "footer.rights": "Tous droits réservés.",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Sauvegarder",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
  },

  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.products": "Produtos",
    "nav.categories": "Categorias",

    // Hero
    "hero.title": "A Melhor Tecnologia ao Seu Alcance",
    "hero.subtitle": "Computadores, laptops, telefones e acessórios das melhores marcas",
    "hero.cta": "Ver Produtos",

    // Categories
    "categories.title": "Categorias em Destaque",
    "categories.computers": "Computadores",
    "categories.computers_desc": "PCs de mesa potentes",
    "categories.laptops": "Laptops",
    "categories.laptops_desc": "Portáteis para trabalho e gaming",
    "categories.phones": "Telefones",
    "categories.phones_desc": "Smartphones de última geração",
    "categories.accessories": "Acessórios",
    "categories.accessories_desc": "Complementos e periféricos",
    "categories.view_all": "Ver Tudo",

    // Products
    "products.featured": "Produtos em Destaque",
    "products.view_all": "Ver Todos os Produtos",
    "products.add_to_cart": "Adicionar ao Carrinho",
    "products.out_of_stock": "Esgotado",
    "products.price": "Preço",
    "products.specifications": "Especificações",

    // Auth
    "auth.login": "Entrar",
    "auth.register": "Registrar",
    "auth.logout": "Sair",
    "auth.email": "Email",
    "auth.password": "Senha",
    "auth.confirm_password": "Confirmar Senha",
    "auth.name": "Nome Completo",
    "auth.phone": "Telefone",

    // User
    "user.profile": "Meu Perfil",
    "user.orders": "Meus Pedidos",

    // Cart
    "cart.title": "Carrinho de Compras",
    "cart.empty": "Seu carrinho está vazio",
    "cart.quantity": "Quantidade",
    "cart.total": "Total",
    "cart.checkout": "Finalizar Compra",
    "cart.remove": "Remover",

    // Checkout
    "checkout.title": "Finalizar Compra",
    "checkout.subtitle": "Complete suas informações para processar o pedido",
    "checkout.shipping_info": "Informações de Envio",
    "checkout.first_name": "Nome",
    "checkout.last_name": "Sobrenome",
    "checkout.email": "Email",
    "checkout.phone": "Telefone",
    "checkout.address": "Endereço",
    "checkout.city": "Cidade",
    "checkout.province": "Província",
    "checkout.notes": "Notas do pedido (opcional)",
    "checkout.order_summary": "Resumo do Pedido",
    "checkout.subtotal": "Subtotal",
    "checkout.shipping": "Envio",
    "checkout.total": "Total",
    "checkout.proceed_payment": "Prosseguir para Pagamento",

    // Payment
    "payment.title": "Método de Pagamento",
    "payment.subtitle": "Selecione seu método de pagamento preferido",
    "payment.methods": "Métodos de Pagamento Disponíveis",
    "payment.transfermovil_desc": "Pagamento via app Transfermóvil",
    "payment.enzona_desc": "Pagamento via plataforma Enzona",
    "payment.bank_selection": "Selecionar Banco",
    "payment.card_number": "Número do Cartão",
    "payment.expiry": "Vencimento",
    "payment.cvv": "CVV",
    "payment.cardholder": "Nome do Portador",
    "payment.back": "Voltar",
    "payment.process": "Processar Pagamento",
    "payment.order_summary": "Resumo do Pedido",
    "payment.total": "Total a Pagar",

    // Confirmation
    "confirmation.title": "Pedido Confirmado!",
    "confirmation.subtitle": "Obrigado pela sua compra. Seu pedido foi processado com sucesso.",
    "confirmation.order_details": "Detalhes do Pedido",
    "confirmation.order_number": "Número do Pedido",
    "confirmation.order_date": "Data do Pedido",
    "confirmation.payment_method": "Método de Pagamento",
    "confirmation.status": "Status",
    "confirmation.confirmed": "Confirmado",
    "confirmation.items_ordered": "Itens Pedidos",
    "confirmation.total_paid": "Total Pago",
    "confirmation.shipping_info": "Informações de Envio",
    "confirmation.next_steps": "Próximos Passos",
    "confirmation.step1": "• Você receberá um email de confirmação em breve",
    "confirmation.step2": "• Seu pedido será processado em 1-2 dias úteis",
    "confirmation.step3": "• Notificaremos quando seu pedido for enviado",
    "confirmation.step4": "• Tempo estimado de entrega: 3-5 dias úteis",
    "confirmation.view_orders": "Ver Meus Pedidos",
    "confirmation.continue_shopping": "Continuar Comprando",

    // Admin
    "admin.panel": "Painel Admin",
    "admin.dashboard": "Dashboard",
    "admin.products": "Produtos",
    "admin.orders": "Pedidos",
    "admin.users": "Usuários",
    "admin.settings": "Configurações",
    "admin.logout": "Sair",
    "admin.dashboard_title": "Dashboard do Administrador",
    "admin.dashboard_subtitle": "Visão geral da loja",
    "admin.total_products": "Total de Produtos",
    "admin.total_orders": "Total de Pedidos",
    "admin.total_users": "Total de Usuários",
    "admin.total_revenue": "Receita Total",
    "admin.recent_orders": "Pedidos Recentes",
    "admin.low_stock": "Estoque Baixo",
    "admin.view_all": "Ver todos",
    "admin.manage": "Gerenciar",
    "admin.view_store": "Ver Loja",

    // Footer
    "footer.description": "Sua loja de confiança para tecnologia de qualidade",
    "footer.categories": "Categorias",
    "footer.support": "Suporte",
    "footer.contact": "Contato",
    "footer.help": "Ajuda",
    "footer.shipping": "Envios",
    "footer.returns": "Devoluções",
    "footer.payment": "Métodos de Pagamento",
    "footer.rights": "Todos os direitos reservados.",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    "common.cancel": "Cancelar",
    "common.save": "Salvar",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
  },
}

// Translation functions
let currentLanguage = localStorage.getItem("language") || "es"

function translate(key) {
  return translations[currentLanguage][key] || key
}

function updatePageTranslations() {
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    element.textContent = translate(key)
  })
}

function setLanguage(lang) {
  currentLanguage = lang
  localStorage.setItem("language", lang)
  document.documentElement.lang = lang
  updatePageTranslations()
}

// Function to update translations globally
function updateTranslations() {
  updatePageTranslations()
}

// Initialize translations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  updatePageTranslations()

  const languageSelect = document.getElementById("language-select")
  if (languageSelect) {
    languageSelect.value = currentLanguage
    languageSelect.addEventListener("change", function () {
      setLanguage(this.value)
    })
  }
})
