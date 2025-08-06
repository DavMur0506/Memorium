'use client'

import { createMemory, getNearbyMemories } from '@/services/MemoryService'
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
    { value: 'RECOMENDACION', label: 'Recomendación', icon: '⭐', color: '#60a5fa' }, // blue-400
    { value: 'ADVERTENCIA', label: 'Advertencia', icon: '⚠️', color: '#f87171' }, // red-400
    { value: 'HISTORIA', label: 'Historia', icon: '📚', color: '#34d399' }, // emerald-400
    { value: 'CURIOSIDAD', label: 'Curiosidad', icon: '🔍', color: '#a78bfa' } // violet-400
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
        arPosition: position || { x: 0, y: 0, z: 0 },
        created_at: new Date().toISOString(),
        author_name: 'Usuario AR',
        is_verified: false,
        likes_count: 0,
        comments_count: 0,
        id: `memory-${Date.now()}`
      }

      // Intentar API call usando el servicio
      try {
        const savedMemory = await createMemory(memoryData)
        onCreateMemory(savedMemory)
      } catch (apiError) {
        console.warn('API call failed, using local memory:', apiError)
        onCreateMemory(memoryData)
      }
      
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-300">📍 Nueva Memoria AR</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Lugar increíble para fotos"
              className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200 placeholder-slate-400"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                      : 'border-slate-600 text-slate-300 hover:border-slate-500 bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: formData.category === category.value ? category.color : '',
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
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe qué hace especial este lugar..."
              rows={4}
              className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-slate-700 text-slate-200 placeholder-slate-400"
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Dirección (opcional)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Se detectará automáticamente"
              className="w-full p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200 placeholder-slate-400"
              disabled={isSubmitting}
            />
          </div>

          {position && (
            <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
              <div className="text-sm text-blue-300">
                <strong>📍 Posición AR:</strong>
                <div className="font-mono text-xs mt-1">
                  X: {position.x.toFixed(3)}, Y: {position.y.toFixed(3)}, Z: {position.z.toFixed(3)}
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50"
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

// Componente principal con Three.js y WebXR
export default function TrueARScene({ memories = [] }) {
  // Estados principales
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [isSessionStarting, setIsSessionStarting] = useState(false)
  const [placedMemories, setPlacedMemories] = useState([])
  const [nearbyMemories, setNearbyMemories] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loadingMemories, setLoadingMemories] = useState(false)
  
  // Estados de UI
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('Inicializando...')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pendingPosition, setPendingPosition] = useState(null)
  
  // Referencias
  const sessionRef = useRef(null)
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const memoryObjectsRef = useRef(new Map())
  const hitTestSourceRef = useRef(null)

  // Función para calcular distancia entre coordenadas
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lon2-lon1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }, [])

  // Cargar memorias cercanas
  const loadNearbyMemories = useCallback(async () => {
    try {
      setLoadingMemories(true)
      setDebugInfo('Obteniendo ubicación...')
      
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalización no disponible'))
          return
        }
        
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
          }
        )
      })

      const userLat = position.coords.latitude
      const userLng = position.coords.longitude
      
      setUserLocation({ latitude: userLat, longitude: userLng })
      setDebugInfo(`Ubicación: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`)

      const memories = await getNearbyMemories(userLat, userLng, 2000)
      
      console.log('📍 Memorias cercanas encontradas:', memories.length)
      
      if (memories.length === 0) {
        setDebugInfo('Sin memorias cercanas en 2km')
        setNearbyMemories([])
        return
      }
      
      const memoriesWithARPositions = memories.map((memory, index) => {
        const deltaLat = memory.latitude - userLat
        const deltaLng = memory.longitude - userLng
        
        const xOffset = deltaLng * 111320 * Math.cos(userLat * Math.PI / 180)
        const zOffset = -deltaLat * 110540
        
        const maxDistance = 25
        const distance = Math.sqrt(xOffset * xOffset + zOffset * zOffset)
        const scale = distance > maxDistance ? maxDistance / distance : 1
        
        const arPosition = {
          x: (xOffset * scale) || (Math.random() * 4 - 2),
          y: memory.arPosition?.y || 1.5,
          z: (zOffset * scale) || (-2 - index * 0.5)
        }

        return {
          ...memory,
          arPosition: arPosition,
          isNearbyMemory: true
        }
      })

      setNearbyMemories(memoriesWithARPositions)
      setDebugInfo(`✅ ${memories.length} memorias cercanas cargadas`)
      
    } catch (error) {
      console.error('Error loading nearby memories:', error)
      setDebugInfo(`❌ Error: ${error.message}`)
      
      if (error.message.includes('Geolocalización')) {
        const demoMemories = [
          {
            id: 'demo-1',
            title: 'Memoria Demo 1',
            description: 'Esta es una memoria de demostración para probar la visualización AR',
            category: 'RECOMENDACION',
            author_name: 'Demo User',
            arPosition: { x: -2, y: 1.5, z: -3 },
            isNearbyMemory: true,
            distance: 150
          },
          {
            id: 'demo-2',
            title: 'Memoria Demo 2',
            description: 'Otra memoria de ejemplo para ver múltiples paneles',
            category: 'HISTORIA',
            author_name: 'Demo User',
            arPosition: { x: 2, y: 1.5, z: -4 },
            isNearbyMemory: true,
            distance: 230
          }
        ]
        setNearbyMemories(demoMemories)
        setDebugInfo(`✅ ${demoMemories.length} memorias demo cargadas`)
      } else {
        setNearbyMemories([])
      }
    } finally {
      setLoadingMemories(false)
    }
  }, [])

  // Inicializar escena Three.js
  const initializeScene = useCallback(() => {
    if (!canvasRef.current) return

    try {
      if (typeof window !== 'undefined' && !window.THREE) {
        setDebugInfo('Cargando Three.js...')
        
        if (document.querySelector('script[src*="three.min.js"]')) return
        
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => {
          setDebugInfo('Three.js cargado')
          setTimeout(() => initializeScene(), 200)
        }
        script.onerror = () => {
          setDebugInfo('Error cargando Three.js')
          setError('No se pudo cargar Three.js')
        }
        document.head.appendChild(script)
        return
      }

      const THREE = window.THREE
      if (!THREE) {
        setDebugInfo('Three.js no disponible')
        return
      }

      if (rendererRef.current) {
        setDebugInfo('Escena ya inicializada')
        return
      }

      setDebugInfo('Creando escena 3D...')

      const scene = new THREE.Scene()
      scene.background = null
      
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)
      camera.position.set(0, 1.6, 0)
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.xr.enabled = true
      
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      directionalLight.position.set(5, 10, 5)
      scene.add(directionalLight)

      const testGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const testMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
      const testCube = new THREE.Mesh(testGeometry, testMaterial)
      testCube.position.set(0, 1.5, -2)
      scene.add(testCube)

      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      gridHelper.position.y = -0.1
      scene.add(gridHelper)

      setDebugInfo('Escena 3D inicializada ✅')

      const animate = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          if (testCube) {
            testCube.rotation.x += 0.01
            testCube.rotation.y += 0.01
          }
          
          memoryObjectsRef.current.forEach((panel) => {
            if (panel.userData.isMemoryPanel) {
              panel.lookAt(cameraRef.current.position)
            }
          })

          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
        requestAnimationFrame(animate)
      }
      animate()

    } catch (error) {
      console.error('Error initializing scene:', error)
      setDebugInfo(`Error en escena 3D: ${error.message}`)
      setError(error.message)
    }
  }, [])

  // Crear panel 3D para memoria
  const createMemoryPanel = useCallback((memory) => {
    if (!sceneRef.current || !window.THREE) return null

    const THREE = window.THREE
    const group = new THREE.Group()

    const categoryInfo = {
      'RECOMENDACION': { color: 0x60a5fa, icon: '⭐' }, // blue-400
      'ADVERTENCIA': { color: 0xf87171, icon: '⚠️' }, // red-400
      'HISTORIA': { color: 0x34d399, icon: '📚' }, // emerald-400
      'CURIOSIDAD': { color: 0xa78bfa, icon: '🔍' } // violet-400
    }

    const info = categoryInfo[memory.category] || categoryInfo['RECOMENDACION']

    const opacity = memory.isNearbyMemory ? 0.7 : 0.9
    const panelGeometry = new THREE.PlaneGeometry(0.4, 0.6)
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: info.color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide
    })
    const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial)
    group.add(panelMesh)

    const borderGeometry = new THREE.EdgesGeometry(panelGeometry)
    const borderColor = memory.isNearbyMemory ? 0x0ea5e9 : 0x3b82f6 // sky-500 : blue-500
    const borderMaterial = new THREE.LineBasicMaterial({ color: borderColor })
    const borderMesh = new THREE.LineSegments(borderGeometry, borderMaterial)
    group.add(borderMesh)

    if (memory.isNearbyMemory && userLocation && memory.latitude && memory.longitude) {
      const distance = calculateDistance(
        userLocation.latitude, 
        userLocation.longitude, 
        memory.latitude, 
        memory.longitude
      )
      
      const distanceCanvas = document.createElement('canvas')
      distanceCanvas.width = 256
      distanceCanvas.height = 64
      const distanceContext = distanceCanvas.getContext('2d')
      
      distanceContext.fillStyle = 'rgba(14, 165, 233, 0.9)' // sky-500 with opacity
      distanceContext.fillRect(0, 0, 256, 64)
      distanceContext.fillStyle = '#ffffff'
      distanceContext.font = 'bold 24px Arial'
      distanceContext.textAlign = 'center'
      distanceContext.fillText(`${distance.toFixed(0)}m`, 128, 40)
      
      const distanceTexture = new THREE.CanvasTexture(distanceCanvas)
      const distanceMaterial = new THREE.MeshBasicMaterial({ 
        map: distanceTexture, 
        transparent: true 
      })
      const distanceGeometry = new THREE.PlaneGeometry(0.2, 0.05)
      const distanceMesh = new THREE.Mesh(distanceGeometry, distanceMaterial)
      distanceMesh.position.set(0, 0.35, 0.001)
      group.add(distanceMesh)
    }

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 768
    const context = canvas.getContext('2d')
    
    context.fillStyle = 'rgba(255, 255, 255, 0)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.fillStyle = '#ffffff'
    context.font = 'bold 48px Arial'
    context.textAlign = 'center'
    
    const words = memory.title.split(' ')
    let line = ''
    let y = 100
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = context.measureText(testLine)
      const testWidth = metrics.width
      
      if (testWidth > 450 && i > 0) {
        context.fillText(line, canvas.width / 2, y)
        line = words[i] + ' '
        y += 60
      } else {
        line = testLine
      }
    }
    context.fillText(line, canvas.width / 2, y)
    
    context.font = '32px Arial'
    const descWords = memory.description.split(' ')
    line = ''
    y += 100
    
    for (let i = 0; i < descWords.length && y < 700; i++) {
      const testLine = line + descWords[i] + ' '
      const metrics = context.measureText(testLine)
      const testWidth = metrics.width
      
      if (testWidth > 450 && i > 0) {
        context.fillText(line, canvas.width / 2, y)
        line = descWords[i] + ' '
        y += 40
      } else {
        line = testLine
      }
    }
    if (y < 700) {
      context.fillText(line, canvas.width / 2, y)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    
    const textGeometry = new THREE.PlaneGeometry(0.38, 0.58)
    const textMaterial = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true,
      side: THREE.DoubleSide
    })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.z = 0.001
    group.add(textMesh)

    group.position.set(
      memory.arPosition.x,
      memory.arPosition.y + 0.3,
      memory.arPosition.z
    )

    group.lookAt(cameraRef.current.position)
    
    group.userData = { 
      memory: memory,
      isMemoryPanel: true,
      clickable: true
    }

    return group
  }, [userLocation, calculateDistance])

  // Agregar memoria a la escena
  const addMemoryToScene = useCallback((memory) => {
    if (!sceneRef.current) return

    const panel = createMemoryPanel(memory)
    if (panel) {
      sceneRef.current.add(panel)
      memoryObjectsRef.current.set(memory.id, panel)
    }
  }, [createMemoryPanel])

  // Remover memoria de la escena
  const removeMemoryFromScene = useCallback((memoryId) => {
    if (!sceneRef.current) return

    const object = memoryObjectsRef.current.get(memoryId)
    if (object) {
      sceneRef.current.remove(object)
      memoryObjectsRef.current.delete(memoryId)
    }
  }, [])

  // Manejar tap/click para AR
  const handleARTap = useCallback((event) => {
    if (!sessionRef.current || !hitTestSourceRef.current) return

    const frame = event.frame
    const results = frame.getHitTestResults(hitTestSourceRef.current)
    
    if (results.length > 0) {
      const hit = results[0]
      const pose = hit.getPose(sessionRef.current.referenceSpace)
      
      if (pose) {
        const position = {
          x: pose.transform.position.x,
          y: pose.transform.position.y,
          z: pose.transform.position.z
        }
        
        setPendingPosition(position)
        setShowCreateModal(true)
        setDebugInfo(`Posición detectada: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`)
      }
    }
  }, [])

  // Manejar redimensionamiento
  const handleResize = useCallback(() => {
    if (!rendererRef.current || !cameraRef.current) return
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }, [])

  // Inicialización principal
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setDebugInfo('Verificando WebXR...')
        
        if (navigator.xr) {
          try {
            const supported = await navigator.xr.isSessionSupported('immersive-ar')
            setIsARSupported(supported)
            setDebugInfo(supported ? 'AR soportado' : 'AR no soportado')
          } catch (error) {
            setIsARSupported(false)
            setDebugInfo('Error verificando AR')
          }
        } else {
          setIsARSupported(false)
          setDebugInfo('WebXR no disponible')
        }
        
        initializeScene()
        
        setTimeout(() => {
          loadNearbyMemories()
        }, 1000)
        
      } catch (error) {
        console.error('Error in initialization:', error)
        setError(error.message)
        setDebugInfo('Error en inicialización')
        initializeScene()
      }
    }
    
    window.addEventListener('resize', handleResize)
    initializeApp()
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [initializeScene, handleResize, loadNearbyMemories])

  // Actualizar memorias en la escena
  useEffect(() => {
    if (!sceneRef.current) return
    
    console.log('🔄 Actualizando memorias en escena:')
    console.log('   - Memorias cercanas:', nearbyMemories.length)
    console.log('   - Memorias creadas:', placedMemories.length)
    
    memoryObjectsRef.current.forEach((object, id) => {
      removeMemoryFromScene(id)
    })
    
    nearbyMemories.forEach((memory) => {
      addMemoryToScene(memory)
    })
    
    placedMemories.forEach((memory) => {
      addMemoryToScene(memory)
    })
    
    console.log(`✅ Total de objetos en escena: ${memoryObjectsRef.current.size}`)
  }, [placedMemories, nearbyMemories, addMemoryToScene, removeMemoryFromScene])

  // Funciones de AR
  const enterAR = async () => {
    if (!isARSupported || isSessionStarting) return
    
    try {
      setIsSessionStarting(true)
      setError('')
      setDebugInfo('Iniciando sesión AR...')
      
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hit-test']
      })
      
      sessionRef.current = session
      
      rendererRef.current.xr.setReferenceSpaceType('local-floor')
      rendererRef.current.xr.setSession(session)
      
      if (session.requestHitTestSource) {
        const referenceSpace = await session.requestReferenceSpace('viewer')
        hitTestSourceRef.current = await session.requestHitTestSource({ space: referenceSpace })
      }
      
      setIsARActive(true)
      setDebugInfo('AR activo ✅ - Toca superficie para crear memoria')
      
      session.addEventListener('end', () => {
        setIsARActive(false)
        setDebugInfo('Sesión AR terminada')
        sessionRef.current = null
        hitTestSourceRef.current = null
      })
      
      session.addEventListener('select', handleARTap)
      
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
      hitTestSourceRef.current = null
    } catch (error) {
      console.error('Error exiting AR:', error)
    }
  }

  // Funciones de UI
  const createMemoryAtPosition = (x = 0, y = 0, z = -2) => {
    const position = { x, y, z }
    setPendingPosition(position)
    setShowCreateModal(true)
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

  // Manejar clicks en canvas para modo demo
  const handleCanvasClick = (event) => {
    if (isARActive) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    createMemoryAtPosition(x * 2, y + 1.6, -3)
    setDebugInfo(`Click detectado: creando memoria en (${(x * 2).toFixed(1)}, ${(y + 1.6).toFixed(1)}, -3)`)
  }

  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden">
      {/* Canvas para escena 3D */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
        style={{ touchAction: 'none' }}
      />

      {/* Panel de debug */}
      <div className="absolute top-4 left-4 z-50 bg-slate-800/95 backdrop-blur-sm text-slate-200 p-4 rounded-lg max-w-sm border border-slate-700">
        <h3 className="font-semibold mb-2 text-blue-300">🔍 AR Memory Creator</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Status:</strong> {debugInfo}</p>
          <p><strong className="text-green-400">📍 Memorias creadas:</strong> {placedMemories.length}</p>
          <p><strong className="text-sky-400">🌍 Memorias cercanas:</strong> {nearbyMemories.length}</p>
          <p><strong className="text-blue-400">🎯 AR:</strong> {isARActive ? 'Activo' : 'Inactivo'}</p>
          {loadingMemories && <p className="text-yellow-400"><strong>⏳ Cargando memorias...</strong></p>}
          {userLocation && (
            <p className="text-emerald-400 text-xs">
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
          )}
          {error && <p className="text-red-400"><strong>⚠️ Error:</strong> {error}</p>}
        </div>
        
        {isARActive && (
          <div className="mt-4 p-3 bg-green-600/20 rounded border border-green-500">
            <p className="text-green-300 text-sm">
              <strong>AR Activo</strong><br />
              Toca cualquier superficie para crear una memoria
            </p>
          </div>
        )}

        {!isARActive && !loadingMemories && nearbyMemories.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-600/20 rounded border border-yellow-500">
            <p className="text-yellow-300 text-sm">
              <strong>Sin memorias cercanas</strong><br />
              No hay memorias en tu área. ¡Crea la primera!
            </p>
          </div>
        )}

        {!isARActive && nearbyMemories.length > 0 && (
          <div className="mt-4 p-3 bg-sky-600/20 rounded border border-sky-500">
            <p className="text-sky-300 text-sm">
              <strong>Memorias encontradas</strong><br />
              {nearbyMemories.length} memorias cercanas cargadas
            </p>
          </div>
        )}
      </div>

      {/* Lista de memorias */}
      {(placedMemories.length > 0 || nearbyMemories.length > 0) && (
        <div className="absolute bottom-4 right-4 z-50 bg-slate-800/95 backdrop-blur-sm text-slate-200 p-4 rounded-lg max-w-xs border border-slate-700">
          <h4 className="font-semibold mb-2 text-blue-300">📝 Memorias</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            
            {/* Memorias cercanas */}
            {nearbyMemories.length > 0 && (
              <>
                <div className="text-xs text-sky-400 font-semibold mb-1">🌍 Cercanas ({nearbyMemories.length})</div>
                {nearbyMemories.slice(0, 3).map((memory) => (
                  <div key={memory.id} className="p-2 bg-slate-700 rounded text-xs border-l-2 border-sky-400">
                    <div className="flex items-center gap-2 mb-1">
                      <span>
                        {memory.category === 'RECOMENDACION' ? '⭐' :
                         memory.category === 'ADVERTENCIA' ? '⚠️' :
                         memory.category === 'HISTORIA' ? '📚' : '🔍'}
                      </span>
                      <span className="font-medium text-slate-200">{memory.title}</span>
                    </div>
                    <p className="text-slate-400 truncate">{memory.description}</p>
                    {userLocation && memory.latitude && memory.longitude && (
                      <p className="text-xs text-sky-300 mt-1">
                        {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          memory.latitude,
                          memory.longitude
                        ).toFixed(0)}m
                      </p>
                    )}
                  </div>
                ))}
                {nearbyMemories.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{nearbyMemories.length - 3} más...
                  </div>
                )}
              </>
            )}

            {/* Memorias creadas */}
            {placedMemories.length > 0 && (
              <>
                <div className="text-xs text-green-400 font-semibold mb-1 mt-3">✏️ Creadas ({placedMemories.length})</div>
                {placedMemories.map((memory) => (
                  <div key={memory.id} className="p-2 bg-slate-700 rounded text-xs border-l-2 border-green-400">
                    <div className="flex items-center gap-2 mb-1">
                      <span>
                        {memory.category === 'RECOMENDACION' ? '⭐' :
                         memory.category === 'ADVERTENCIA' ? '⚠️' :
                         memory.category === 'HISTORIA' ? '📚' : '🔍'}
                      </span>
                      <span className="font-medium text-slate-200">{memory.title}</span>
                    </div>
                    <p className="text-slate-400 truncate">{memory.description}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      Pos: ({memory.arPosition.x.toFixed(1)}, {memory.arPosition.y.toFixed(1)}, {memory.arPosition.z.toFixed(1)})
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="flex gap-2 mt-3">
            {nearbyMemories.length > 0 && (
              <button
                onClick={loadNearbyMemories}
                className="flex-1 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm"
                disabled={loadingMemories}
              >
                Actualizar
              </button>
            )}
            {placedMemories.length > 0 && (
              <button
                onClick={clearMemories}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
      {/* Controles */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {!isARActive ? (
          <div className="flex flex-col items-center space-y-4">
            {isARSupported && (
              <button
                onClick={enterAR}
                disabled={isSessionStarting}
                className={`px-8 py-4 rounded-full font-bold text-white text-lg transition-all ${
                  !isSessionStarting
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isSessionStarting ? '🔄 Iniciando...' : '🚀 Iniciar AR'}
              </button>
            )}
            
            <button
              onClick={() => createMemoryAtPosition(0, 0.5, -2)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
            >
              Crear Memoria {isARSupported ? '(Demo)' : ''}
            </button>
          </div>
        ) : (
          <button
            onClick={exitAR}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold"
          >
            Salir AR
          </button>
        )}
      </div>
      
      {/* Modal de creación */}
      <CreateMemoryModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onCreateMemory={handleCreateMemory}
        position={pendingPosition}
      />
      
      {/* Información de ayuda */}
      {!isARSupported && error && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/95 text-slate-200 p-4 rounded-lg text-center max-w-md border border-slate-700">
          <h4 className="font-semibold mb-2 text-blue-300">📱 Información AR</h4>
          <p className="text-sm mb-3">Para AR real necesitas un dispositivo compatible con ARCore (Android) o ARKit (iOS)</p>
          <p className="text-xs text-slate-400">En modo demo: haz click en pantalla para crear memorias 3D</p>
          {nearbyMemories.length > 0 && (
            <p className="text-xs text-sky-300 mt-2">
              Memorias cercanas cargadas automáticamente
            </p>
          )}
        </div>
      )}
    </div>
  )
}