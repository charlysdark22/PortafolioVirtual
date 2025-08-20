// Sistema de pagos para Cuba
class PaymentSystem {
  constructor() {
    this.supportedMethods = ["transfermovil", "enzona"]
    this.supportedBanks = ["bandec", "bpa", "metropolitano"]
  }

  // Validar método de pago
  validatePaymentMethod(method) {
    return this.supportedMethods.includes(method)
  }

  // Validar banco
  validateBank(bank) {
    return this.supportedBanks.includes(bank)
  }

  // Validar datos de tarjeta (simulación)
  validateCardData(cardData) {
    const { cardNumber, expiry, cvv, cardholder } = cardData

    // Validaciones básicas
    if (!cardNumber || cardNumber.length < 16) {
      return { valid: false, error: "Número de tarjeta inválido" }
    }

    if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
      return { valid: false, error: "Fecha de vencimiento inválida" }
    }

    if (!cvv || cvv.length < 3) {
      return { valid: false, error: "CVV inválido" }
    }

    if (!cardholder || cardholder.length < 2) {
      return { valid: false, error: "Nombre del titular requerido" }
    }

    return { valid: true }
  }

  // Procesar pago (simulación)
  async processPayment(paymentData) {
    return new Promise((resolve, reject) => {
      // Simular tiempo de procesamiento
      setTimeout(() => {
        // Simular éxito/fallo (90% éxito)
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            transactionId: "TXN-" + Date.now(),
            message: "Pago procesado exitosamente",
          })
        } else {
          reject({
            success: false,
            error: "Error en el procesamiento del pago",
          })
        }
      }, 2000)
    })
  }

  // Obtener información del banco
  getBankInfo(bankCode) {
    const banks = {
      bandec: {
        name: "Banco de Crédito y Comercio",
        code: "BANDEC",
        color: "green",
      },
      bpa: {
        name: "Banco Popular de Ahorro",
        code: "BPA",
        color: "blue",
      },
      metropolitano: {
        name: "Banco Metropolitano",
        code: "METROPOLITANO",
        color: "purple",
      },
    }

    return banks[bankCode] || null
  }

  // Obtener información del método de pago
  getPaymentMethodInfo(method) {
    const methods = {
      transfermovil: {
        name: "Transfermóvil",
        description: "Pago mediante la aplicación Transfermóvil",
        icon: "TM",
        color: "red",
      },
      enzona: {
        name: "Enzona",
        description: "Pago mediante la plataforma Enzona",
        icon: "EZ",
        color: "blue",
      },
    }

    return methods[method] || null
  }
}

// Instancia global del sistema de pagos
const paymentSystem = new PaymentSystem()

// Funciones de utilidad para formateo
function formatCardNumber(value) {
  // Remover espacios y caracteres no numéricos
  const cleaned = value.replace(/\D/g, "")
  // Agregar espacios cada 4 dígitos
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
  return formatted.substring(0, 19) // Máximo 16 dígitos + 3 espacios
}

function formatExpiry(value) {
  // Remover caracteres no numéricos
  const cleaned = value.replace(/\D/g, "")
  // Agregar slash después de 2 dígitos
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
  }
  return cleaned
}

function formatCVV(value) {
  // Solo números, máximo 4 dígitos
  return value.replace(/\D/g, "").substring(0, 4)
}

// Exportar para uso global
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PaymentSystem, paymentSystem }
}
