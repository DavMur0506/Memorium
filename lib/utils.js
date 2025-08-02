import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Formatear distancia en metros/kilómetros
export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    return `${(distance / 1000).toFixed(1)}km`
  }
}

// Formatear tiempo relativo
export const formatRelativeTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es
    })
  } catch (error) {
    // Fallback para fechas inválidas
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'ahora'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }
}

// Calcular distancia entre dos puntos usando fórmula de Haversine
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000 // Radio de la Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Validar archivo de imagen
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, error: 'No se seleccionó archivo' }
  }
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Solo se permiten archivos de imagen' }
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `El archivo es muy grande. Máximo ${maxSize / (1024 * 1024)}MB` 
    }
  }
  
  return { valid: true }
}

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Generar ID único simple
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + '...'
}

// Validar coordenadas GPS
export const validateCoordinates = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { valid: false, error: 'Las coordenadas deben ser números' }
  }
  
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitud debe estar entre -90 y 90' }
  }
  
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitud debe estar entre -180 y 180' }
  }
  
  return { valid: true }
}

// Detectar si es dispositivo móvil
export const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}

// Sanitizar texto para prevenir XSS básico
export const sanitizeText = (text) => {
  if (!text) return ''
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// Generar color aleatorio para avatares
export const generateAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ]
  
  if (!name) return colors[0]
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

// Debounce function para optimizar búsquedas
export const debounce = (func, wait) => {
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

// Obtener iniciales de un nombre
export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Validar email básico
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Formatear número con separadores de miles
export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}