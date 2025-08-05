'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Componente Modal para crear memorias
function CreateMemoryModal({ isOpen, onClose, onCreateMemory, position }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'RECOMENDACION',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { value: 'RECOMENDACION', label: 'Recomendación', icon: '⭐', color: '#fbbf24' },
    { value: 'ADVERTENCIA', label: 'Advertencia', icon: '⚠️', color: '#ef4444' },
    { value: 'HISTORIA', label: 'Historia', icon: '📚', color: '#3b82f6' },
    { value: 'CURIOSIDAD', label: 'Curiosidad', icon: '🔍', color: '#8b5cf6' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título y descripción son requeridos')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Obtener ubicación
      let locationData = { address: formData.address }
      
      if (navigator.geolocation) {
        try {
          const geoPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: true
            })
          })
          
          locationData.latitude = geoPosition.coords.latitude
          locationData.longitude = geoPosition.coords.longitude
          
          if (!formData.address) {
            locationData.address = `${geoPosition.coords.latitude.toFixed(6)}, ${geoPosition.coords.longitude.toFixed(6)}`
          }
        } catch (geoError) {
          console.log('Geolocation error:', geoError)
        }
      }

      // Crear memoria
      const memoryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        address: locationData.address || 'Ubicación AR',
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
        ar_position_x: position ? position[0] : 0,
        ar_position_y: position ? position[1] : 0,
        ar_position_z: position ? position[2] : 0,
        created_at: new Date().toISOString(),
        author_name: 'Usuario AR',
        is_verified: false,
        likes_count: 0,
        comments_count: 0,
        id: `memory-${Date.now()}`,
        arPosition: position || [0, 0, 0]
      }

      // Intentar API call
      try {
        const response = await fetch('/api/memories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(memoryData)
        })

        if (response.ok) {
          const savedMemory = await response.json()
          memoryData.id = savedMemory.id
        }
      } catch (apiError) {
        console.warn('API call failed, using local memory')
      }

      onCreateMemory(memoryData)
      
      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        category: 'RECOMENDACION',
        address: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Error creating memory:', error)
      setError('Error al crear la memoria')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">📍 Nueva Memoria AR</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Lugar increíble para fotos"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleChange('category', category.value)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.category === category.value
                      ? 'border-current text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: formData.category === category.value ? category.color : 'white',
                    borderColor: formData.category === category.value ? category.color : ''
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe qué hace especial este lugar..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección (opcional)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Se detectará automáticamente"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {position && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>📍 Posición AR:</strong>
                <div className="font-mono text-xs mt-1">
                  X: {position[0].toFixed(2)}, Y: {position[1].toFixed(2)}, Z: {position[2].toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? '🔄 Creando...' : '💾 Crear Memoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente principal SIN React Three Fiber
export default function TrueARScene({ memories = [] }) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [isSessionStarting, setIsSessionStarting] = useState(false)
  const [placedMemories, setPlacedMemories] = useState([])
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('Inicializando...')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pendingPosition, setPendingPosition] = useState(null)
  
  const sessionRef = useRef(null)
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const animationIdRef = useRef(null)

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        setDebugInfo('Verificando WebXR...')
        
        if (!navigator.xr) {
          throw new Error('WebXR no disponible')
        }
        
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        
        if (supported) {
          setDebugInfo('AR soportado ✅')
          setIsARSupported(true)
        } else {
          throw new Error('AR no soportado en este dispositivo')
        }
      } catch (error) {
        setError(error.message)
        setDebugInfo('AR no disponible ❌')
        setIsARSupported(false)
      }
    }
    
    const timer = setTimeout(checkARSupport, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Función simple para crear memoria sin posición AR específica
  const createMemoryAtCurrentLocation = () => {
    // Crear posición simulada
    const position = [
      Math.random() * 2 - 1, // -1 a 1
      0.5,
      Math.random() * 2 - 1
    ]
    
    setPendingPosition(position)
    setShowCreateModal(true)
  }

  const enterAR = async () => {
    if (!isARSupported || isSessionStarting) return
    
    try {
      setIsSessionStarting(true)
      setError('')
      setDebugInfo('Iniciando sesión AR...')
      
      // Intentar iniciar AR usando WebXR directo
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hit-test']
      })
      
      sessionRef.current = session
      setIsARActive(true)
      setDebugInfo('AR activo ✅ - Toca pantalla para crear memoria')
      
      // Configurar eventos
      session.addEventListener('end', () => {
        setIsARActive(false)
        setDebugInfo('Sesión AR terminada')
        sessionRef.current = null
      })
      
      session.addEventListener('selectstart', () => {
        createMemoryAtCurrentLocation()
      })
      
    } catch (error) {
      console.error('Error entering AR:', error)
      setError(`Error AR: ${error.message}`)
      setDebugInfo('Error iniciando AR ❌')
    } finally {
      setIsSessionStarting(false)
    }
  }
  
  const exitAR = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.end()
      }
      setIsARActive(false)
      setDebugInfo('AR cerrado')
      sessionRef.current = null
    } catch (error) {
      console.error('Error exiting AR:', error)
    }
  }
  
  const handleCreateMemory = useCallback((newMemory) => {
    setPlacedMemories(prev => [...prev, newMemory])
    setShowCreateModal(false)
    setPendingPosition(null)
  }, [])
  
  const handleCloseModal = () => {
    setShowCreateModal(false)
    setPendingPosition(null)
  }

  const clearMemories = () => {
    setPlacedMemories([])
  }

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      {/* Debug panel */}
      <div className="absolute top-4 left-4 z-50 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">🔍 AR Memory Creator</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Status:</strong> {debugInfo}</p>
          <p><strong>📍 Memorias:</strong> {placedMemories.length}</p>
          <p><strong>🎯 AR:</strong> {isARActive ? 'Activo' : 'Inactivo'}</p>
          {error && <p className="text-red-400"><strong>⚠️ Error:</strong> {error}</p>}
        </div>
        
        {isARActive && (
          <div className="mt-4 p-3 bg-green-600/20 rounded border border-green-500">
            <p className="text-green-300 text-sm">
              <strong>✨ AR Activo</strong><br />
              Toca la pantalla en cualquier momento para crear una nueva memoria
            </p>
          </div>
        )}
      </div>

      {/* Lista de memorias creadas */}
      {placedMemories.length > 0 && (
        <div className="absolute top-4 right-4 z-50 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
          <h4 className="font-semibold mb-2">📝 Memorias Creadas</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {placedMemories.map((memory, index) => (
              <div key={memory.id} className="p-2 bg-gray-700 rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span>
                    {memory.category === 'RECOMENDACION' ? '⭐' :
                     memory.category === 'ADVERTENCIA' ? '⚠️' :
                     memory.category === 'HISTORIA' ? '📚' : '🔍'}
                  </span>
                  <span className="font-medium">{memory.title}</span>
                </div>
                <p className="text-gray-300 truncate">{memory.description}</p>
              </div>
            ))}
          </div>
          {placedMemories.length > 0 && (
            <button
              onClick={clearMemories}
              className="mt-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              🗑️ Limpiar Todo
            </button>
          )}
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {!isARActive ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={enterAR}
              disabled={!isARSupported || isSessionStarting}
              className={`px-8 py-4 rounded-full font-bold text-white text-lg transition-all ${
                isARSupported && !isSessionStarting
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isSessionStarting ? '🔄 Iniciando...' : '🚀 Iniciar AR'}
            </button>
            
            {!isARSupported && (
              <button
                onClick={createMemoryAtCurrentLocation}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
              >
                ✏️ Crear Memoria (Demo)
              </button>
            )}
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={createMemoryAtCurrentLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold"
            >
              ✏️ Crear Memoria
            </button>
            <button
              onClick={exitAR}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold"
            >
              🚪 Salir AR
            </button>
          </div>
        )}
      </div>
      
      {/* AR Viewport */}
      <div className="w-full h-full flex items-center justify-center">
        {isARActive ? (
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">AR Activo</h2>
            <p className="text-lg">Vista de cámara activa</p>
            <p className="text-sm text-gray-300 mt-2">Toca "Crear Memoria" para añadir una nueva memoria</p>
          </div>
        ) : (
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">AR Memory Creator</h2>
            <p className="text-lg text-gray-300">
              {isARSupported 
                ? 'Toca "Iniciar AR" para comenzar' 
                : 'AR no disponible - Puedes usar el modo demo'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Modal de creación */}
      <CreateMemoryModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onCreateMemory={handleCreateMemory}
        position={pendingPosition}
      />
      
      {/* Help for unsupported devices */}
      {!isARSupported && error && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-blue-900/90 text-white p-4 rounded-lg text-center max-w-md">
          <h4 className="font-semibold mb-2">📱 Información AR</h4>
          <p className="text-sm mb-3">Para AR real necesitas un dispositivo compatible con ARCore (Android) o ARKit (iOS)</p>
          <p className="text-xs text-blue-200">Mientras tanto, puedes probar el modo demo para crear memorias</p>
        </div>
      )}
    </div>
  )
}