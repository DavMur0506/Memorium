// Categorías de memorias
export const CATEGORIES = {
  all: { 
    label: 'Todas', 
    icon: '🌐', 
    color: 'bg-gray-100',
    textColor: 'text-gray-800',
    description: 'Ver todas las memorias'
  },
  recomendacion: { 
    label: 'Recomendaciones', 
    icon: '⭐', 
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    description: 'Lugares y experiencias recomendadas'
  },
  advertencia: { 
    label: 'Advertencias', 
    icon: '⚠️', 
    color: 'bg-red-100',
    textColor: 'text-red-800',
    description: 'Alertas y precauciones importantes'
  },
  historia: { 
    label: 'Historia', 
    icon: '📚', 
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    description: 'Relatos históricos y culturales'
  },
  curiosidad: { 
    label: 'Curiosidades', 
    icon: '🔍', 
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    description: 'Datos curiosos e interesantes'
  }
}

// Límites del formulario
export const FORM_LIMITS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  CONTENT_MIN_LENGTH: 10,
  CONTENT_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 300,
  MAX_IMAGES: 3,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Configuración de geolocalización
export const GEO_CONFIG = {
  DEFAULT_LOCATION: {
    lat: 19.4326,
    lng: -99.1332, // Ciudad de México
    name: 'Ciudad de México'
  },
  SEARCH_RADIUS: {
    DEFAULT: 5000, // 5km
    MIN: 100,      // 100m
    MAX: 50000,    // 50km
    OPTIONS: [
      { value: 500, label: '500m' },
      { value: 1000, label: '1km' },
      { value: 2000, label: '2km' },
      { value: 5000, label: '5km' },
      { value: 10000, label: '10km' },
    ]
  },
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutos
  }
}

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  COMMENTS_PAGE_SIZE: 20
}

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    MEMORIES: '/memories',
    NEARBY: '/memories/nearby',
    UPLOAD: '/upload',
    COMMENTS: '/comments',
    LIKES: '/likes'
  }
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  LOCATION_DENIED: 'Se necesita acceso a tu ubicación para mostrar memorias cercanas.',
  LOCATION_UNAVAILABLE: 'No se pudo obtener tu ubicación.',
  UPLOAD_FAILED: 'Error al subir el archivo. Intenta nuevamente.',
  VALIDATION_FAILED: 'Por favor corrige los errores en el formulario.',
  MEMORY_NOT_FOUND: 'La memoria que buscas no existe.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.'
}

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  MEMORY_CREATED: '¡Memoria creada exitosamente!',
  MEMORY_UPDATED: '¡Memoria actualizada!',
  MEMORY_DELETED: 'Memoria eliminada.',
  COMMENT_ADDED: 'Comentario agregado.',
  LIKE_ADDED: '¡Te gusta esta memoria!',
  LIKE_REMOVED: 'Ya no te gusta esta memoria.'
}

// Configuración de mapas
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  STYLES: {
    STREETS: 'mapbox://styles/mapbox/streets-v11',
    SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
    OUTDOORS: 'mapbox://styles/mapbox/outdoors-v11'
  },
  MARKER_COLORS: {
    recomendacion: '#f59e0b', // yellow-500
    advertencia: '#ef4444',   // red-500
    historia: '#3b82f6',      // blue-500
    curiosidad: '#8b5cf6',    // purple-500
    default: '#6b7280'        // gray-500
  }
}

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
}

// Configuración de PWA
export const PWA_CONFIG = {
  APP_NAME: 'Memoria Colectiva',
  APP_SHORT_NAME: 'Memoria',
  APP_DESCRIPTION: 'Descubre y comparte historias geolocalizadas de tu comunidad',
  THEME_COLOR: '#8b5cf6',
  BACKGROUND_COLOR: '#ffffff',
  DISPLAY: 'standalone',
  ORIENTATION: 'portrait'
}

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  MEMORY_DETAIL: '/memories/[id]',
  MAP: '/map',
  PROFILE: '/profile',
  CREATE: '/create',
  SEARCH: '/search',
  SETTINGS: '/settings'
}

// Configuración de localStorage
export const STORAGE_KEYS = {
  USER_LOCATION: 'user_location',
  PREFERRED_RADIUS: 'preferred_radius',
  LAST_CATEGORY: 'last_category',
  DRAFT_MEMORY: 'draft_memory',
  USER_PREFERENCES: 'user_preferences'
}

// Configuración de analytics (para futuro)
export const ANALYTICS_EVENTS = {
  MEMORY_CREATED: 'memory_created',
  MEMORY_VIEWED: 'memory_viewed',
  MEMORY_LIKED: 'memory_liked',
  COMMENT_ADDED: 'comment_added',
  LOCATION_SHARED: 'location_shared',
  SEARCH_PERFORMED: 'search_performed'
}

// Roles de usuario (para futuro)
export const USER_ROLES = {
  VISITOR: 'visitor',
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

// Estados de memoria
export const MEMORY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  HIDDEN: 'hidden',
  FLAGGED: 'flagged',
  DELETED: 'deleted'
}

// Configuración de tiempo
export const TIME_CONFIG = {
  REFRESH_INTERVAL: 30000, // 30 segundos
  CACHE_DURATION: 300000,  // 5 minutos
  SESSION_TIMEOUT: 3600000 // 1 hora
}

// Configuración de dispositivos
export const DEVICE_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280
}

// URL y enlaces externos
export const EXTERNAL_LINKS = {
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  SUPPORT_EMAIL: 'support@memoriacolectiva.com',
  GITHUB_REPO: 'https://github.com/tu-usuario/memoria-colectiva',
  FEEDBACK_FORM: 'https://forms.gle/...'
}