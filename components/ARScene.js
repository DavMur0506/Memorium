'use client'

// import { Canvas, useFrame } from '@react-three/fiber'
// import { Text, OrbitControls, Environment, RoundedBox } from '@react-three/drei'
// import { useState, useEffect, useRef } from 'react'

// // Componente para mostrar una memoria como panel 3D flotante
// function MemoryPanel({ memory, position, isVisible = true }) {
//   const [hovered, setHovered] = useState(false)
//   const meshRef = useRef()
  
//   // Animación sutil de flotación más pronunciada para AR
//   useFrame((state) => {
//     if (meshRef.current && isVisible) {
//       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
//     }
//   })
  
//   // Colores más vibrantes por categoría
//   const categoryColors = {
//     RECOMENDACION: '#f59e0b',
//     ADVERTENCIA: '#dc2626',
//     HISTORIA: '#2563eb',
//     CURIOSIDAD: '#7c3aed'
//   }
  
//   const color = categoryColors[memory.category] || '#6b7280'
  
//   const categorySymbols = {
//     RECOMENDACION: '★',
//     ADVERTENCIA: '⚠',
//     HISTORIA: '📖',
//     CURIOSIDAD: '🔍'
//   }
  
//   const symbol = categorySymbols[memory.category] || '•'
  
//   if (!isVisible) return null
  
//   return (
//     <group 
//       ref={meshRef}
//       position={position}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//       scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
//     >
//       {/* Panel principal con mayor transparencia para AR */}
//       <RoundedBox
//         args={[2.2, 1.5, 0.1]}
//         position={[0, 0, 0]}
//         radius={0.08}
//         smoothness={6}
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial 
//           color="#ffffff"
//           metalness={0.1}
//           roughness={0.1}
//           transparent
//           opacity={0.95}
//         />
//       </RoundedBox>
      
//       {/* Borde con glow para AR */}
//       <RoundedBox
//         args={[2.25, 1.55, 0.08]}
//         position={[0, 0, -0.02]}
//         radius={0.08}
//         smoothness={6}
//       >
//         <meshStandardMaterial 
//           color={color}
//           metalness={0.3}
//           roughness={0.2}
//           transparent
//           opacity={0.3}
//           emissive={color}
//           emissiveIntensity={0.2}
//         />
//       </RoundedBox>
      
//       {/* Barra superior más prominente */}
//       <RoundedBox
//         args={[2.2, 0.3, 0.11]}
//         position={[0, 0.6, 0.01]}
//         radius={0.08}
//         smoothness={6}
//       >
//         <meshStandardMaterial 
//           color={color}
//           metalness={0.4}
//           roughness={0.1}
//           emissive={color}
//           emissiveIntensity={0.1}
//         />
//       </RoundedBox>
      
//       {/* Símbolo de categoría */}
//       <Text
//         position={[-0.9, 0.6, 0.07]}
//         fontSize={0.15}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {symbol}
//       </Text>
      
//       {/* Nombre de categoría */}
//       <Text
//         position={[0.1, 0.6, 0.07]}
//         fontSize={0.08}
//         color="white"
//         anchorX="left"
//         anchorY="middle"
//         maxWidth={1.8}
//       >
//         {memory.category?.toUpperCase() || 'MEMORIA'}
//       </Text>
      
//       {/* Título de la memoria */}
//       <Text
//         position={[0, 0.25, 0.07]}
//         fontSize={0.12}
//         color="#111827"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={2}
//         fontWeight="bold"
//       >
//         {memory.title || 'Sin título'}
//       </Text>
      
//       {/* Descripción */}
//       <Text
//         position={[0, -0.1, 0.07]}
//         fontSize={0.07}
//         color="#374151"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={2}
//         lineHeight={1.2}
//       >
//         {memory.description?.substring(0, 80) + (memory.description?.length > 80 ? '...' : '') || 'Sin descripción'}
//       </Text>
      
//       {/* Información del autor y tiempo */}
//       <Text
//         position={[-0.9, -0.45, 0.07]}
//         fontSize={0.06}
//         color="#6b7280"
//         anchorX="left"
//         anchorY="middle"
//         maxWidth={1.2}
//       >
//         👤 {memory.author_name || 'Usuario'}
//       </Text>
      
//       <Text
//         position={[0.9, -0.45, 0.07]}
//         fontSize={0.06}
//         color="#6b7280"
//         anchorX="right"
//         anchorY="middle"
//       >
//         🕒 {formatTimeAgo(memory.created_at)}
//       </Text>
      
//       {/* Stats */}
//       <group position={[0, -0.65, 0.07]}>
//         <Text
//           position={[-0.3, 0, 0]}
//           fontSize={0.06}
//           color="#dc2626"
//           anchorX="center"
//           anchorY="middle"
//         >
//           ♥ {memory.likes_count || 0}
//         </Text>
        
//         <Text
//           position={[0.3, 0, 0]}
//           fontSize={0.06}
//           color="#2563eb"
//           anchorX="center"
//           anchorY="middle"
//         >
//           💬 {memory.comments_count || 0}
//         </Text>
//       </group>
      
//       {/* Badge de verificado */}
//       {memory.is_verified && (
//         <group position={[0.95, 0.5, 0.05]}>
//           <mesh>
//             <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
//             <meshStandardMaterial 
//               color="#10b981" 
//               emissive="#10b981"
//               emissiveIntensity={0.2}
//             />
//           </mesh>
//           <Text
//             position={[0, 0, 0.02]}
//             fontSize={0.08}
//             color="white"
//             anchorX="center"
//             anchorY="middle"
//           >
//             ✓
//           </Text>
//         </group>
//       )}
      
//       {/* Efecto de hover con glow más intenso para AR */}
//       {hovered && (
//         <>
//           <pointLight
//             position={[0, 0, 0.3]}
//             intensity={0.5}
//             color={color}
//             distance={2}
//           />
          
//           {/* Partículas flotantes */}
//           <group>
//             {[...Array(6)].map((_, i) => (
//               <mesh key={i} position={[
//                 Math.sin(i) * 1.5,
//                 Math.cos(i) * 1.5,
//                 0.2
//               ]}>
//                 <sphereGeometry args={[0.02]} />
//                 <meshStandardMaterial 
//                   color={color}
//                   emissive={color}
//                   emissiveIntensity={0.5}
//                   transparent
//                   opacity={0.7}
//                 />
//               </mesh>
//             ))}
//           </group>
//         </>
//       )}
//     </group>
//   )
// }

// // Componente de cámara AR
// function ARCamera({ onCameraReady }) {
//   const [stream, setStream] = useState(null)
//   const [error, setError] = useState(null)
//   const [permissionState, setPermissionState] = useState('prompt')
//   const [isInitializing, setIsInitializing] = useState(false)
//   const videoRef = useRef(null)
  
//   const initCamera = async () => {
//     setIsInitializing(true)
//     setError(null)
    
//     try {
//       // Verificar HTTPS
//       const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
//       if (!isSecure) {
//         throw new Error('HTTPS_REQUIRED')
//       }

//       // Verificar si MediaDevices está disponible
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         throw new Error('MEDIA_NOT_SUPPORTED')
//       }

//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: { ideal: 'environment' }, // Preferir cámara trasera
//           width: { ideal: 1280, min: 640 },
//           height: { ideal: 720, min: 480 }
//         },
//         audio: false
//       })
      
//       setStream(mediaStream)
//       setPermissionState('granted')
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream
//         videoRef.current.onloadedmetadata = () => {
//           onCameraReady?.(true)
//         }
//       }
//     } catch (err) {
//       console.error('Error accessing camera:', err)
//       setPermissionState('denied')
      
//       let errorMessage = 'No se pudo acceder a la cámara.'
//       let showHttpsWarning = false
      
//       if (err.message === 'HTTPS_REQUIRED') {
//         errorMessage = 'La cámara requiere HTTPS para funcionar por seguridad.'
//         showHttpsWarning = true
//       } else if (err.message === 'MEDIA_NOT_SUPPORTED') {
//         errorMessage = 'Tu navegador no soporta acceso a la cámara.'
//       } else if (err.name === 'NotAllowedError') {
//         // Verificar si realmente es por HTTPS
//         const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
//         if (!isSecure) {
//           errorMessage = 'Se requiere HTTPS para acceder a la cámara.'
//           showHttpsWarning = true
//         } else {
//           errorMessage = 'Permisos de cámara denegados. Revisa la configuración del navegador.'
//         }
//       } else if (err.name === 'NotFoundError') {
//         errorMessage = 'No se encontró ninguna cámara en el dispositivo.'
//       } else if (err.name === 'NotSupportedError') {
//         errorMessage = 'Tu navegador no soporta acceso a la cámara.'
//       } else if (err.name === 'NotReadableError') {
//         errorMessage = 'La cámara está siendo usada por otra aplicación.'
//       }
      
//       setError({ message: errorMessage, showHttpsWarning })
//       onCameraReady?.(false)
//     } finally {
//       setIsInitializing(false)
//     }
//   }
  
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [stream])
  
//   if (error) {
//     const isHttpsIssue = error.showHttpsWarning
//     const currentUrl = window.location.href
//     const httpsUrl = currentUrl.replace('http://', 'https://')
    
//     return (
//       <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
//         <div className="text-center max-w-sm">
//           <div className="text-6xl mb-4">
//             {isHttpsIssue ? '🔒' : '📷'}
//           </div>
//           <p className="text-lg mb-4 font-semibold">
//             {isHttpsIssue ? 'Se Requiere HTTPS' : 'Error de Cámara'}
//           </p>
//           <p className="text-sm text-gray-300 mb-6 leading-relaxed">
//             {error.message}
//           </p>
          
//           {isHttpsIssue ? (
//             <div className="space-y-4">
//               <button
//                 onClick={() => window.location.href = httpsUrl}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
//               >
//                 🔒 Ir a HTTPS
//               </button>
              
//               <div className="text-xs text-gray-400 space-y-2">
//                 <p>O prueba estas alternativas:</p>
//                 <div className="bg-gray-800 p-3 rounded text-left">
//                   <p className="text-yellow-400 mb-1">Opciones:</p>
//                   <p>• Usar localhost (si es desarrollo)</p>
//                   <p>• Usar ngrok para túnel HTTPS</p>
//                   <p>• Desplegar en Vercel/Netlify</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <button
//                 onClick={initCamera}
//                 disabled={isInitializing}
//                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
//               >
//                 {isInitializing ? (
//                   <>
//                     <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                     Iniciando...
//                   </>
//                 ) : (
//                   <>
//                     📹 Intentar de nuevo
//                   </>
//                 )}
//               </button>
              
//               <div className="mt-4 text-xs text-gray-400">
//                 <p>Asegúrate de:</p>
//                 <p>• Permitir acceso a la cámara</p>
//                 <p>• Usar HTTPS o localhost</p>
//                 <p>• Cerrar otras apps que usen la cámara</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }
  
//   if (permissionState === 'prompt' || !stream) {
//     return (
//       <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white p-4">
//         <div className="text-center max-w-sm">
//           <div className="text-6xl mb-4">🎥</div>
//           <p className="text-xl mb-4 font-semibold">AR Memorias</p>
//           <p className="text-sm text-gray-200 mb-6 leading-relaxed">
//             Para comenzar la experiencia AR, necesitamos acceso a tu cámara
//           </p>
          
//           <button
//             onClick={initCamera}
//             disabled={isInitializing}
//             className="bg-white text-purple-900 hover:bg-gray-100 disabled:bg-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center mx-auto shadow-lg"
//           >
//             {isInitializing ? (
//               <>
//                 <div className="animate-spin w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full mr-3"></div>
//                 Iniciando AR...
//               </>
//             ) : (
//               <>
//                 🚀 Activar AR
//               </>
//             )}
//           </button>
          
//           <div className="mt-6 text-xs text-gray-300 space-y-1">
//             <p>🔒 Tus datos permanecen privados</p>
//             <p>📱 Funciona mejor con cámara trasera</p>
//           </div>
//         </div>
//       </div>
//     )
//   }
  
//   return (
//     <video
//       ref={videoRef}
//       autoPlay
//       playsInline
//       muted
//       className="absolute inset-0 w-full h-full object-cover"
//       style={{ transform: 'scaleX(-1)' }} // Efecto espejo
//     />
//   )
// }

// function formatTimeAgo(dateString) {
//   if (!dateString) return 'Ahora'
  
//   try {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
//     if (diffInHours < 1) return 'Ahora'
//     if (diffInHours < 24) return `${diffInHours}h`
//     if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
//     return `${Math.floor(diffInHours / 168)}sem`
//   } catch {
//     return 'Reciente'
//   }
// }

// // Componente principal de la escena AR
// function ARSceneContent({ memories, showMemories }) {
//   const [cameraPermission, setCameraPermission] = useState('prompt')
  
//   useEffect(() => {
//     // Verificar permisos de cámara
//     if ('permissions' in navigator) {
//       navigator.permissions.query({ name: 'camera' }).then(result => {
//         setCameraPermission(result.state)
//       })
//     }
//   }, [])
  
//   return (
//     <>
//       {/* Controles de órbita más suaves para AR */}
//       <OrbitControls 
//         enablePan={false}
//         enableZoom={true}
//         enableRotate={true}
//         maxDistance={10}
//         minDistance={2}
//         maxPolarAngle={Math.PI / 1.8}
//         minPolarAngle={Math.PI / 4}
//       />
      
//       {/* Iluminación optimizada para AR */}
//       <ambientLight intensity={0.4} />
//       <directionalLight 
//         position={[5, 5, 5]} 
//         intensity={0.6}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//       />
      
//       {/* Luz adicional para resaltar los paneles */}
//       <pointLight
//         position={[0, 3, 3]}
//         intensity={0.3}
//         color="#ffffff"
//       />
      
//       {/* Mostrar memorias como paneles 3D flotantes */}
//       {memories && memories.length > 0 && showMemories && memories.map((memory, index) => {
//         if (!memory || !memory.id) return null
        
//         // Distribución circular más natural para AR
//         const angle = (index / memories.length) * Math.PI * 2
//         const radius = 3 + Math.sin(index) * 0.5
//         const height = 1.5 + Math.cos(index * 0.7) * 0.8
        
//         return (
//           <MemoryPanel
//             key={memory.id}
//             memory={memory}
//             position={[
//               Math.cos(angle) * radius,
//               height,
//               Math.sin(angle) * radius
//             ]}
//             isVisible={showMemories}
//           />
//         )
//       })}
      
//       {/* Mensaje si no hay memorias */}
//       {(!memories || memories.length === 0) && showMemories && (
//         <Text
//           position={[0, 2, 0]}
//           fontSize={0.3}
//           color="#ffffff"
//           anchorX="center"
//           anchorY="middle"
//           outlineWidth={0.01}
//           outlineColor="#000000"
//         >
//           No hay memorias para mostrar
//         </Text>
//       )}
      
//       {/* Indicadores AR sutiles */}
//       {showMemories && (
//         <>
//           {/* Punto de referencia central */}
//           <mesh position={[0, 0, 0]}>
//             <sphereGeometry args={[0.05]} />
//             <meshStandardMaterial 
//               color="#ffffff"
//               emissive="#ffffff"
//               emissiveIntensity={0.3}
//               transparent
//               opacity={0.8}
//             />
//           </mesh>
          
//           {/* Grid de referencia sutil */}
//           <gridHelper 
//             args={[10, 10, '#ffffff', '#ffffff']} 
//             position={[0, -0.1, 0]}
//             material-transparent={true}
//             material-opacity={0.1}
//           />
//         </>
//       )}
//     </>
//   )
// }

// export default function ARScene({ memories = [] }) {
//   const [mounted, setMounted] = useState(false)
//   const [showMemories, setShowMemories] = useState(true)
//   const [cameraReady, setCameraReady] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)
  
//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   const toggleFullscreen = async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await document.documentElement.requestFullscreen()
//         setIsFullscreen(true)
//         // Forzar orientación landscape en móviles si está disponible
//         if (screen.orientation && screen.orientation.lock) {
//           try {
//             await screen.orientation.lock('landscape')
//           } catch (e) {
//             // Ignorar si no se puede cambiar orientación
//           }
//         }
//       } else {
//         await document.exitFullscreen()
//         setIsFullscreen(false)
//       }
//     } catch (error) {
//       console.log('Fullscreen no disponible:', error)
//     }
//   }

//   const handleCameraReady = (ready) => {
//     setCameraReady(ready)
//     if (ready) {
//       // Auto-entrar en pantalla completa cuando la cámara esté lista (opcional)
//       // toggleFullscreen()
//     }
//   }
  
//   if (!mounted) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
//         <div className="text-center">
//           <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Inicializando AR...</p>
//         </div>
//       </div>
//     )
//   }
  
//   return (
//     <div className="w-full h-full relative overflow-hidden">
//       {/* Cámara AR como fondo */}
//       <ARCamera onCameraReady={handleCameraReady} />
      
//       {/* Solo mostrar controles si la cámara está lista */}
//       {cameraReady && (
//         <>
//           {/* Overlay de información AR */}
//           <div className="absolute top-4 left-4 z-40 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg max-w-xs">
//             <h3 className="font-semibold mb-2 text-sm">AR Memorias</h3>
//             <div className="space-y-1 text-xs">
//               <p className="flex items-center">
//                 <span className="w-2 h-2 bg-yellow-400 rounded mr-2"></span>
//                 Recomendaciones
//               </p>
//               <p className="flex items-center">
//                 <span className="w-2 h-2 bg-red-500 rounded mr-2"></span>
//                 Advertencias
//               </p>
//               <p className="flex items-center">
//                 <span className="w-2 h-2 bg-blue-500 rounded mr-2"></span>
//                 Historia
//               </p>
//               <p className="flex items-center">
//                 <span className="w-2 h-2 bg-purple-500 rounded mr-2"></span>
//                 Curiosidades
//               </p>
//             </div>
//             <div className="mt-2 pt-2 border-t border-gray-400">
//               <p className="text-xs text-gray-200">
//                 Paneles: {memories?.length || 0}
//               </p>
//             </div>
//           </div>
          
//           {/* Controles AR */}
//           <div className="absolute top-4 right-4 z-40 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg">
//             <h4 className="font-semibold text-xs mb-2">Controles AR</h4>
//             <div className="text-xs space-y-1 mb-3">
//               <p>📱 Mueve el dispositivo</p>
//               <p>👆 Toca para interactuar</p>
//               <p>🔍 Pellizca para zoom</p>
//             </div>
            
//             <div className="space-y-2">
//               <button
//                 onClick={() => setShowMemories(!showMemories)}
//                 className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
//                   showMemories 
//                     ? 'bg-purple-600 text-white' 
//                     : 'bg-gray-600 text-gray-200'
//                 }`}
//               >
//                 {showMemories ? '🔴 Ocultar Memorias' : '🟢 Mostrar Memorias'}
//               </button>
              
//               <button
//                 onClick={toggleFullscreen}
//                 className="w-full px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//               >
//                 {isFullscreen ? '🔴 Salir Pantalla Completa' : '🔳 Pantalla Completa'}
//               </button>
//             </div>
//           </div>
          
//           {/* Indicador de estado AR */}
//           <div className="absolute bottom-4 left-4 z-40 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//               <span className="text-xs font-medium">AR Activo</span>
//             </div>
//           </div>
          
//           {/* Canvas de Three.js superpuesto sobre la cámara */}
//           <div className="absolute inset-0 z-10">
//             <Canvas
//               camera={{ 
//                 position: [0, 2, 5], 
//                 fov: 60,
//                 near: 0.1,
//                 far: 100
//               }}
//               style={{ background: 'transparent' }}
//               shadows
//               gl={{ alpha: true, antialias: true }}
//             >
//               <ARSceneContent memories={memories} showMemories={showMemories} />
//             </Canvas>
//           </div>
          
//           {/* Botón de captura AR */}
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
//             <button 
//               onClick={() => {
//                 // Simular captura con efecto flash mejorado
//                 const flash = document.createElement('div')
//                 flash.className = 'fixed inset-0 bg-white pointer-events-none z-50'
//                 flash.style.opacity = '0'
//                 flash.style.transition = 'opacity 0.1s ease'
//                 document.body.appendChild(flash)
                
//                 // Efecto flash
//                 requestAnimationFrame(() => {
//                   flash.style.opacity = '0.9'
//                   setTimeout(() => {
//                     flash.style.opacity = '0'
//                     setTimeout(() => {
//                       if (document.body.contains(flash)) {
//                         document.body.removeChild(flash)
//                       }
//                     }, 100)
//                   }, 100)
//                 })
                
//                 // Vibración táctil si está disponible
//                 if (navigator.vibrate) {
//                   navigator.vibrate(50)
//                 }
//               }}
//               className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-xl hover:bg-white hover:scale-105 transition-all duration-200 border-4 border-white/50 active:scale-95"
//             >
//               📷
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useRef } from 'react'

// export default function SafariCameraFix() {
//     const [step, setStep] = useState(0)
//     const [stream, setStream] = useState(null)
//     const [error, setError] = useState(null)
//     const [videoPlaying, setVideoPlaying] = useState(false)
//     const videoRef = useRef(null)

//     // Limpiar stream al desmontar
//     useEffect(() => {
//         return () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop())
//         }
//         }
//     }, [stream])

//     const startCamera = async () => {
//         try {
//             setStep(1);
//             const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
//             setStream(mediaStream);

//             if (videoRef.current) {
//             videoRef.current.srcObject = mediaStream;
//             // Esto dispara la reproducción en Safari:
//             await videoRef.current.play();
//             setVideoPlaying(true);
//             setStep(4);
//             }
//         } catch (err) {
//             // …
//         }
//     };

//   const playVideo = async () => {
//     if (videoRef.current && stream) {
//       try {
//         // Reproducir con manejo especial para Safari
//         const playPromise = videoRef.current.play()
        
//         if (playPromise !== undefined) {
//           await playPromise
//         }
//       } catch (playError) {
//         console.error('Error al reproducir:', playError)
//         setError(`Error de reproducción: ${playError.message}`)
//       }
//     }
//   }

//   const getStepInfo = () => {
//     switch (step) {
//       case 0: return { bg: '#3b82f6', text: '📱 Presiona para activar cámara', desc: 'Safari requiere interacción del usuario' }
//       case 1: return { bg: '#f59e0b', text: '🔄 Solicitando cámara...', desc: 'Obteniendo permisos de cámara' }
//       case 2: return { bg: '#f59e0b', text: '📹 Cámara obtenida', desc: 'Configurando video...' }
//       case 3: return { bg: '#10b981', text: '▶️ Presiona para ver video', desc: 'Video listo, requiere reproducción manual' }
//       case 4: return { bg: '#059669', text: '🎉 ¡Cámara funcionando!', desc: 'AR listo para usar' }
//       case -1: return { bg: '#dc2626', text: '❌ Error', desc: error || 'Error desconocido' }
//       default: return { bg: '#6b7280', text: '❓ Estado desconocido', desc: '' }
//     }
//   }

//   const stepInfo = getStepInfo()

//   return (
//     <div style={{
//       width: '100vw',
//       height: '100vh',
//       backgroundColor: stepInfo.bg,
//       color: 'white',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       fontFamily: 'Arial, sans-serif',
//       padding: '20px',
//       position: 'relative'
//     }}>
      
//       {/* Video (oculto hasta que esté reproduciéndose) */}
//       {stream && (
//         <video
//           ref={videoRef}
//           playsInline
//           muted
//           autoPlay
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             transform: 'scaleX(-1)',
//             display: videoPlaying ? 'block' : 'none'
//           }}
//         />
//       )}

//       {/* Overlay de controles */}
//       <div style={{
//         position: 'relative',
//         zIndex: 10,
//         textAlign: 'center',
//         backgroundColor: videoPlaying ? 'rgba(0,0,0,0.5)' : 'transparent',
//         padding: '20px',
//         borderRadius: '15px'
//       }}>
        
//         <h1 style={{ 
//           fontSize: '36px', 
//           margin: '0 0 15px 0' 
//         }}>
//           {stepInfo.text}
//         </h1>
        
//         <p style={{ 
//           fontSize: '16px', 
//           margin: '0 0 25px 0',
//           opacity: 0.9 
//         }}>
//           {stepInfo.desc}
//         </p>

//         {/* Botón principal */}
//         {step === 0 && (
//           <button
//             onClick={startCamera}
//             style={{
//               backgroundColor: 'white',
//               color: stepInfo.bg,
//               padding: '15px 30px',
//               border: 'none',
//               borderRadius: '25px',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
//             }}
//           >
//             🚀 Activar Cámara AR
//           </button>
//         )}

//         {step === 3 && (
//           <button
//             onClick={playVideo}
//             style={{
//               backgroundColor: 'white',
//               color: stepInfo.bg,
//               padding: '15px 30px',
//               border: 'none',
//               borderRadius: '25px',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
//             }}
//           >
//             ▶️ Reproducir Video
//           </button>
//         )}

//         {step === -1 && (
//           <button
//             onClick={() => {
//               setStep(0)
//               setError(null)
//               setStream(null)
//               setVideoPlaying(false)
//             }}
//             style={{
//               backgroundColor: 'white',
//               color: stepInfo.bg,
//               padding: '15px 30px',
//               border: 'none',
//               borderRadius: '25px',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               cursor: 'pointer'
//             }}
//           >
//             🔄 Intentar de nuevo
//           </button>
//         )}

//         {/* Información de debug */}
//         <div style={{
//           marginTop: '20px',
//           padding: '10px',
//           backgroundColor: 'rgba(0,0,0,0.3)',
//           borderRadius: '8px',
//           fontSize: '12px',
//           textAlign: 'left'
//         }}>
//           <p><strong>Debug Info:</strong></p>
//           <p>HTTPS: {window.location.protocol === 'https:' ? '✅' : '❌'}</p>
//           <p>Stream: {stream ? '✅' : '❌'}</p>
//           <p>Video Playing: {videoPlaying ? '✅' : '❌'}</p>
//           <p>Safari: {/Safari/.test(navigator.userAgent) ? '✅' : '❌'}</p>
//         </div>
//       </div>

//       {/* Botón de captura cuando la cámara funciona */}
//       {videoPlaying && (
//         <div style={{
//           position: 'absolute',
//           bottom: '30px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           zIndex: 20
//         }}>
//           <button
//             onClick={() => {
//               // Simular captura con flash
//               document.body.style.backgroundColor = 'white'
//               setTimeout(() => {
//                 document.body.style.backgroundColor = ''
//               }, 100)
              
//               // Vibrar si está disponible
//               if (navigator.vibrate) {
//                 navigator.vibrate(50)
//               }
              
//               alert('¡Foto capturada! 📸✨\n\nLa cámara AR está funcionando perfectamente.')
//             }}
//             style={{
//               width: '70px',
//               height: '70px',
//               borderRadius: '50%',
//               backgroundColor: 'white',
//               border: '4px solid rgba(255,255,255,0.5)',
//               fontSize: '24px',
//               cursor: 'pointer',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             📷
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// 'use client'

// import { Canvas, useFrame } from '@react-three/fiber'
// import { XR, createXRStore } from '@react-three/xr'
// import { Box, Text, OrbitControls, Environment, RoundedBox } from '@react-three/drei'
// import { useState, useEffect, useRef } from 'react'

// // Store para XR
// const store = createXRStore()

// // Componente para mostrar una memoria como panel 3D
// function MemoryPanel({ memory, position }) {
//   const [hovered, setHovered] = useState(false)
//   const meshRef = useRef()
  
//   // Animación sutil de flotación
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
//     }
//   })
  
//   // Colores por categoría
//   const categoryColors = {
//     RECOMENDACION: '#fbbf24', // yellow-400
//     ADVERTENCIA: '#ef4444',   // red-500
//     HISTORIA: '#3b82f6',      // blue-500
//     CURIOSIDAD: '#8b5cf6'     // purple-500
//   }
  
//   const color = categoryColors[memory.category] || '#6b7280'
//   const darkColor = categoryColors[memory.category]?.replace('4', '6') || '#4b5563'
  
//   // Iconos por categoría
//   const categoryIcons = {
//     RECOMENDACION: '⭐',
//     ADVERTENCIA: '⚠️',
//     HISTORIA: '📚',
//     CURIOSIDAD: '🔍'
//   }
  
//   const icon = categoryIcons[memory.category] || '💭'
  
//   return (
//     <group 
//       ref={meshRef}
//       position={position}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//       scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
//     >
//       {/* Panel principal */}
//       <RoundedBox
//         args={[2.4, 1.6, 0.1]}
//         position={[0, 0, 0]}
//         radius={0.05}
//         smoothness={4}
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial 
//           color="white"
//           metalness={0.1}
//           roughness={0.2}
//         />
//       </RoundedBox>
      
//       {/* Barra superior con categoría */}
//       <RoundedBox
//         args={[2.4, 0.3, 0.11]}
//         position={[0, 0.65, 0.01]}
//         radius={0.05}
//         smoothness={4}
//       >
//         <meshStandardMaterial 
//           color={color}
//           metalness={0.2}
//           roughness={0.3}
//         />
//       </RoundedBox>
      
//       {/* Icono de categoría */}
//       <Text
//         position={[-1.0, 0.65, 0.06]}
//         fontSize={0.15}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//         font="/fonts/inter-bold.woff"
//       >
//         {icon}
//       </Text>
      
//       {/* Nombre de categoría */}
//       <Text
//         position={[0.2, 0.65, 0.06]}
//         fontSize={0.08}
//         color="white"
//         anchorX="left"
//         anchorY="middle"
//         font="/fonts/inter-bold.woff"
//         maxWidth={2}
//       >
//         {memory.category}
//       </Text>
      
//       {/* Título de la memoria */}
//       <Text
//         position={[0, 0.3, 0.06]}
//         fontSize={0.12}
//         color="#1f2937"
//         anchorX="center"
//         anchorY="middle"
//         font="/fonts/inter-bold.woff"
//         maxWidth={2.2}
//       >
//         {memory.title}
//       </Text>
      
//       {/* Descripción */}
//       <Text
//         position={[0, -0.1, 0.06]}
//         fontSize={0.07}
//         color="#4b5563"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={2.2}
//         lineHeight={1.2}
//       >
//         {memory.description?.substring(0, 120) + (memory.description?.length > 120 ? '...' : '')}
//       </Text>
      
//       {/* Información del autor */}
//       <Text
//         position={[-1.0, -0.6, 0.06]}
//         fontSize={0.06}
//         color="#6b7280"
//         anchorX="left"
//         anchorY="middle"
//         maxWidth={1.5}
//       >
//         {memory.author_name}
//       </Text>
      
//       {/* Tiempo */}
//       <Text
//         position={[1.0, -0.6, 0.06]}
//         fontSize={0.06}
//         color="#6b7280"
//         anchorX="right"
//         anchorY="middle"
//       >
//         {formatTimeAgo(memory.created_at)}
//       </Text>
      
//       {/* Stats (likes y comentarios) */}
//       <group position={[0, -0.4, 0.06]}>
//         {/* Likes */}
//         <Text
//           position={[-0.3, 0, 0]}
//           fontSize={0.06}
//           color="#ef4444"
//           anchorX="center"
//           anchorY="middle"
//         >
//           ❤️ {memory.likes_count || 0}
//         </Text>
        
//         {/* Comentarios */}
//         <Text
//           position={[0.3, 0, 0]}
//           fontSize={0.06}
//           color="#3b82f6"
//           anchorX="center"
//           anchorY="middle"
//         >
//           💬 {memory.comments_count || 0}
//         </Text>
//       </group>
      
//       {/* Ubicación (si existe) */}
//       {memory.address && (
//         <Text
//           position={[0, -0.75, 0.06]}
//           fontSize={0.05}
//           color="#9ca3af"
//           anchorX="center"
//           anchorY="middle"
//           maxWidth={2.2}
//         >
//           📍 {memory.address.substring(0, 40) + (memory.address.length > 40 ? '...' : '')}
//         </Text>
//       )}
      
//       {/* Indicador de verificado */}
//       {memory.is_verified && (
//         <Text
//           position={[1.1, 0.3, 0.06]}
//           fontSize={0.08}
//           color="#10b981"
//           anchorX="center"
//           anchorY="middle"
//         >
//           ✓
//         </Text>
//       )}
      
//       {/* Efecto de hover - brillo sutil */}
//       {hovered && (
//         <RoundedBox
//           args={[2.5, 1.7, 0.12]}
//           position={[0, 0, -0.01]}
//           radius={0.05}
//           smoothness={4}
//         >
//           <meshStandardMaterial 
//             color={color}
//             transparent
//             opacity={0.1}
//             emissive={color}
//             emissiveIntensity={0.1}
//           />
//         </RoundedBox>
//       )}
//     </group>
//   )
// }

// // Función para formatear tiempo
// function formatTimeAgo(dateString) {
//   if (!dateString) return 'Ahora'
  
//   const date = new Date(dateString)
//   const now = new Date()
//   const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
//   if (diffInHours < 1) return 'Ahora'
//   if (diffInHours < 24) return `${diffInHours}h`
//   if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
//   return `${Math.floor(diffInHours / 168)}sem`
// }

// // Componente principal de la escena
// function SceneContent({ memories, isAR = false }) {
//   return (
//     <>
//       {/* Controles de órbita para navegación 3D (solo si no es AR) */}
//       {!isAR && <OrbitControls enablePan enableZoom enableRotate />}
      
//       {/* Entorno y luces */}
//       <Environment preset="sunset" />
//       <ambientLight intensity={0.6} />
//       <directionalLight 
//         position={[10, 10, 5]} 
//         intensity={0.8} 
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
      
//       {/* Mostrar memorias como paneles 3D */}
//       {memories.map((memory, index) => {
//         const gridSize = Math.ceil(Math.sqrt(memories.length))
//         const row = Math.floor(index / gridSize)
//         const col = index % gridSize
        
//         return (
//           <MemoryPanel
//             key={memory.id}
//             memory={memory}
//             position={[
//               (col - gridSize / 2) * 3, // Más espacio entre paneles
//               1 + Math.sin(index) * 0.5, // Altura variada
//               (row - gridSize / 2) * 3  // Más espacio entre filas
//             ]}
//           />
//         )
//       })}
      
//       {/* Plano de referencia con textura */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
//         <planeGeometry args={[30, 30]} />
//         <meshStandardMaterial 
//           color="#f8fafc" 
//           roughness={0.8}
//           metalness={0.1}
//         />
//       </mesh>
      
//       {/* Grid de referencia más sutil */}
//       <gridHelper 
//         args={[30, 30, '#e2e8f0', '#f1f5f9']} 
//         position={[0, -0.45, 0]} 
//         material-transparent
//         material-opacity={0.3}
//       />
//     </>
//   )
// }

// export default function ARScene({ memories = [] }) {
//   const [isARSupported, setIsARSupported] = useState(false)
//   const [isARActive, setIsARActive] = useState(false)
//   const [checkingAR, setCheckingAR] = useState(true)
  
//   useEffect(() => {
//     // Verificar si AR está soportado
//     const checkARSupport = async () => {
//       if (navigator.xr) {
//         try {
//           const supported = await navigator.xr.isSessionSupported('immersive-ar')
//           setIsARSupported(supported)
//         } catch (error) {
//           console.log('WebXR no soportado:', error)
//           setIsARSupported(false)
//         }
//       } else {
//         setIsARSupported(false)
//       }
//       setCheckingAR(false)
//     }
    
//     checkARSupport()
//   }, [])
  
//   const enterAR = async () => {
//     try {
//       await store.enterAR()
//       setIsARActive(true)
//     } catch (error) {
//       console.error('Error entering AR:', error)
//       alert('No se pudo iniciar AR. Asegúrate de estar usando HTTPS y un dispositivo compatible.')
//     }
//   }
  
//   return (
//     <div className="w-full h-full relative">
//       {/* Panel de información actualizado */}
//       <div className="absolute top-4 left-4 z-40 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
//         <h3 className="font-semibold mb-2">Vista 3D de Memorias</h3>
//         <div className="space-y-1 text-sm">
//           <p className="flex items-center">
//             <span className="w-3 h-3 bg-yellow-400 rounded mr-2"></span>
//             Recomendaciones
//           </p>
//           <p className="flex items-center">
//             <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
//             Advertencias
//           </p>
//           <p className="flex items-center">
//             <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
//             Historia
//           </p>
//           <p className="flex items-center">
//             <span className="w-3 h-3 bg-purple-500 rounded mr-2"></span>
//             Curiosidades
//           </p>
//         </div>
//         <div className="mt-3 pt-3 border-t border-gray-500">
//           <p className="text-xs text-gray-300">
//             {checkingAR ? 'Verificando AR...' : isARSupported ? '✅ AR Disponible' : '❌ AR No Disponible'}
//           </p>
//           <p className="text-xs text-gray-300">
//             Paneles: {memories.length}
//           </p>
//         </div>
//       </div>
      
//       {/* Instrucciones actualizadas */}
//       <div className="absolute top-4 right-4 z-40 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg">
//         <h4 className="font-semibold text-sm mb-2">Navegación 3D</h4>
//         <div className="text-xs space-y-1">
//           <p>🖱️ Clic + Arrastrar: Rotar</p>
//           <p>🔍 Scroll: Zoom</p>
//           <p>👆 Hover: Efecto brillo</p>
//           <p>📋 Paneles flotantes</p>
//         </div>
//       </div>
      
//       {/* Botones de acción */}
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
//         {/* Botón AR nativo (solo si está soportado) */}
//         {isARSupported && !isARActive && (
//           <button
//             onClick={enterAR}
//             className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold flex items-center space-x-2"
//           >
//             <span>📱</span>
//             <span>AR Nativo</span>
//           </button>
//         )}
        
//         {/* Indicador de vista 3D */}
//         {!isARSupported && !checkingAR && (
//           <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
//             Vista 3D • Paneles Flotantes
//           </div>
//         )}
//       </div>
      
//       {/* Canvas de Three.js */}
//       <Canvas
//         camera={{ position: [0, 4, 8], fov: 60 }}
//         style={{ background: 'linear-gradient(to bottom, #dbeafe, #f0f9ff)' }}
//         shadows
//       >
//         {isARSupported && isARActive ? (
//           <XR store={store}>
//             <SceneContent memories={memories} isAR={true} />
//           </XR>
//         ) : (
//           <SceneContent memories={memories} isAR={false} />
//         )}
//       </Canvas>
      
//       {/* Mensaje de ayuda actualizado */}
//       {!isARSupported && !checkingAR && (
//         <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 bg-blue-500/90 text-white p-3 rounded-lg text-center max-w-sm">
//           <p className="text-sm">
//             <strong>💡 Vista mejorada:</strong> Cada memoria es ahora un panel 3D completo con toda la información
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { XR, createXRStore, useXR, useController, useHitTest } from '@react-three/xr'
import { Box, Text, Environment, RoundedBox, Sphere } from '@react-three/drei'
import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

// Store para XR
const store = createXRStore()

// Componente para mostrar una memoria como panel 3D
function MemoryPanel({ memory, position, onRemove, id }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  
  // Animación sutil de flotación
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05
    }
  })
  
  // Colores por categoría
  const categoryColors = {
    RECOMENDACION: '#fbbf24', // yellow-400
    ADVERTENCIA: '#ef4444',   // red-500
    HISTORIA: '#3b82f6',      // blue-500
    CURIOSIDAD: '#8b5cf6'     // purple-500
  }
  
  const color = categoryColors[memory.category] || '#6b7280'
  
  // Iconos por categoría
  const categoryIcons = {
    RECOMENDACION: '⭐',
    ADVERTENCIA: '⚠️',
    HISTORIA: '📚',
    CURIOSIDAD: '🔍'
  }
  
  const icon = categoryIcons[memory.category] || '💭'
  
  const handleClick = () => {
    // Doble tap para eliminar
    if (onRemove) {
      onRemove(id)
    }
  }
  
  return (
    <group 
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      scale={0.8} // Más pequeño para AR
    >
      {/* Panel principal */}
      <RoundedBox
        args={[2.0, 1.4, 0.08]}
        position={[0, 0, 0]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="white"
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </RoundedBox>
      
      {/* Barra superior con categoría */}
      <RoundedBox
        args={[2.0, 0.25, 0.09]}
        position={[0, 0.57, 0.01]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial 
          color={color}
          metalness={0.2}
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* Icono de categoría */}
      <Text
        position={[-0.8, 0.57, 0.05]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>
      
      {/* Nombre de categoría */}
      <Text
        position={[0.1, 0.57, 0.05]}
        fontSize={0.07}
        color="white"
        anchorX="left"
        anchorY="middle"
        maxWidth={1.8}
      >
        {memory.category}
      </Text>
      
      {/* Título de la memoria */}
      <Text
        position={[0, 0.25, 0.05]}
        fontSize={0.1}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        lineHeight={1.1}
      >
        {memory.title}
      </Text>
      
      {/* Descripción */}
      <Text
        position={[0, -0.05, 0.05]}
        fontSize={0.06}
        color="#4b5563"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        lineHeight={1.2}
      >
        {memory.description?.substring(0, 100) + (memory.description?.length > 100 ? '...' : '')}
      </Text>
      
      {/* Información del autor */}
      <Text
        position={[-0.8, -0.45, 0.05]}
        fontSize={0.05}
        color="#6b7280"
        anchorX="left"
        anchorY="middle"
        maxWidth={1.2}
      >
        {memory.author_name}
      </Text>
      
      {/* Tiempo */}
      <Text
        position={[0.8, -0.45, 0.05]}
        fontSize={0.05}
        color="#6b7280"
        anchorX="right"
        anchorY="middle"
      >
        {formatTimeAgo(memory.created_at)}
      </Text>
      
      {/* Stats (likes y comentarios) */}
      <group position={[0, -0.3, 0.05]}>
        <Text
          position={[-0.25, 0, 0]}
          fontSize={0.05}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          ❤️ {memory.likes_count || 0}
        </Text>
        
        <Text
          position={[0.25, 0, 0]}
          fontSize={0.05}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
        >
          💬 {memory.comments_count || 0}
        </Text>
      </group>
      
      {/* Ubicación (si existe) */}
      {memory.address && (
        <Text
          position={[0, -0.6, 0.05]}
          fontSize={0.04}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          📍 {memory.address.substring(0, 30) + (memory.address.length > 30 ? '...' : '')}
        </Text>
      )}
      
      {/* Indicador de verificado */}
      {memory.is_verified && (
        <Text
          position={[0.9, 0.25, 0.05]}
          fontSize={0.07}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}
      
      {/* Efecto de hover - brillo sutil */}
      {hovered && (
        <RoundedBox
          args={[2.1, 1.5, 0.1]}
          position={[0, 0, -0.01]}
          radius={0.05}
          smoothness={4}
        >
          <meshStandardMaterial 
            color={color}
            transparent
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </RoundedBox>
      )}
      
      {/* Indicador de doble tap para eliminar */}
      <Text
        position={[0, -0.8, 0.05]}
        fontSize={0.04}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        transparent
        opacity={0.7}
      >
        Toca dos veces para eliminar
      </Text>
    </group>
  )
}

// Componente para detectar superficies y colocar memorias
function ARPlacement({ memories, onPlaceMemory, placedMemories, onRemoveMemory }) {
  const hitTestSourceRef = useRef()
  const [hitTestSource, setHitTestSource] = useState(null)
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0)
  const [isPlacing, setIsPlacing] = useState(false)
  const markerRef = useRef()
  
  const { session } = useXR()
  
  // Configurar hit testing cuando la sesión AR esté lista
  useEffect(() => {
    if (!session) return
    
    const setupHitTest = async () => {
      try {
        const viewerSpace = await session.requestReferenceSpace('viewer')
        const hitTestSource = await session.requestHitTestSource({ space: viewerSpace })
        setHitTestSource(hitTestSource)
        setIsPlacing(true)
      } catch (error) {
        console.error('Error setting up hit test:', error)
      }
    }
    
    setupHitTest()
    
    return () => {
      if (hitTestSource) {
        hitTestSource.cancel()
      }
    }
  }, [session])
  
  // Realizar hit testing en cada frame
  useFrame((state, delta, frame) => {
    if (!frame || !hitTestSource || !markerRef.current) return
    
    const hitTestResults = frame.getHitTestResults(hitTestSource)
    
    if (hitTestResults.length > 0) {
      const hit = hitTestResults[0]
      const pose = hit.getPose(frame.getViewerPose(state.gl.xr.getReferenceSpace()).transform.position)
      
      if (pose) {
        markerRef.current.position.set(
          pose.transform.position.x,
          pose.transform.position.y,
          pose.transform.position.z
        )
        markerRef.current.visible = true
      }
    } else {
      markerRef.current.visible = false
    }
  })
  
  // Manejar controladores AR (touch/tap)
  const handleSelect = useCallback(() => {
    if (!markerRef.current || !markerRef.current.visible || !memories[currentMemoryIndex]) return
    
    const position = markerRef.current.position.clone()
    const memory = memories[currentMemoryIndex]
    
    onPlaceMemory({
      ...memory,
      arPosition: [position.x, position.y + 0.5, position.z], // Elevar un poco del suelo
      id: `ar-${Date.now()}-${currentMemoryIndex}`
    })
    
    // Cambiar a la siguiente memoria
    setCurrentMemoryIndex((prev) => (prev + 1) % memories.length)
  }, [memories, currentMemoryIndex, onPlaceMemory])
  
  // Escuchar eventos de selección
  useEffect(() => {
    if (!session) return
    
    const onSelectStart = () => handleSelect()
    
    session.addEventListener('selectstart', onSelectStart)
    
    return () => {
      session.removeEventListener('selectstart', onSelectStart)
    }
  }, [session, handleSelect])
  
  if (!isPlacing || !memories[currentMemoryIndex]) return null
  
  const currentMemory = memories[currentMemoryIndex]
  const categoryColors = {
    RECOMENDACION: '#fbbf24',
    ADVERTENCIA: '#ef4444',
    HISTORIA: '#3b82f6',
    CURIOSIDAD: '#8b5cf6'
  }
  
  const color = categoryColors[currentMemory.category] || '#6b7280'
  
  return (
    <>
      {/* Marcador de posición */}
      <group ref={markerRef} visible={false}>
        {/* Círculo en el suelo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.15, 0.25, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        
        {/* Punto central */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color={color} />
        </mesh>
        
        {/* Indicador vertical */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        
        {/* Preview de la memoria que se va a colocar */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.08}
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {currentMemory.title}
        </Text>
        
        <Text
          position={[0, 1.05, 0]}
          fontSize={0.05}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          Toca para colocar ({currentMemoryIndex + 1}/{memories.length})
        </Text>
      </group>
      
      {/* Mostrar memorias ya colocadas */}
      {placedMemories.map((memory) => (
        <MemoryPanel
          key={memory.id}
          memory={memory}
          position={memory.arPosition}
          onRemove={onRemoveMemory}
          id={memory.id}
        />
      ))}
    </>
  )
}

// Función para formatear tiempo
function formatTimeAgo(dateString) {
  if (!dateString) return 'Ahora'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Ahora'
  if (diffInHours < 24) return `${diffInHours}h`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
  return `${Math.floor(diffInHours / 168)}sem`
}

// Componente de la escena AR
function ARSceneContent({ memories, placedMemories, onPlaceMemory, onRemoveMemory }) {
  return (
    <>
      {/* Luces para AR */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5}
      />
      
      {/* Componente de colocación AR */}
      <ARPlacement 
        memories={memories}
        onPlaceMemory={onPlaceMemory}
        placedMemories={placedMemories}
        onRemoveMemory={onRemoveMemory}
      />
    </>
  )
}

// Componente principal
export default function TrueARScene({ memories = [] }) {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const [checkingAR, setCheckingAR] = useState(true)
  const [placedMemories, setPlacedMemories] = useState([])
  const [error, setError] = useState('')
  
  // Datos de prueba si no hay memorias
  const defaultMemories = [
    {
      id: 1,
      title: "Recomendación especial",
      description: "Este lugar tiene una vista increíble al atardecer. Perfecto para fotos románticas.",
      category: "RECOMENDACION",
      author_name: "María García",
      created_at: "2024-08-04T10:30:00Z",
      likes_count: 15,
      comments_count: 3,
      address: "Mirador del Valle, Ensenada",
      is_verified: true
    },
    {
      id: 2,
      title: "Advertencia importante",
      description: "Cuidado con las corrientes marinas en esta zona, especialmente durante la tarde.",
      category: "ADVERTENCIA",
      author_name: "Carlos Mendoza",
      created_at: "2024-08-03T15:45:00Z",
      likes_count: 8,
      comments_count: 12,
      address: "Playa La Bocana, Ensenada",
      is_verified: false
    },
    {
      id: 3,
      title: "Historia del lugar",
      description: "Aquí se fundó la primera misión de la región en 1697 por los padres jesuitas.",
      category: "HISTORIA",
      author_name: "Dr. Luis Hernández",
      created_at: "2024-08-02T09:15:00Z",
      likes_count: 22,
      comments_count: 5,
      address: "Centro Histórico, Ensenada",
      is_verified: true
    },
    {
      id: 4,
      title: "Dato curioso",
      description: "Este árbol tiene más de 200 años y es hogar de más de 30 especies de aves diferentes.",
      category: "CURIOSIDAD",
      author_name: "Ana Ruiz",
      created_at: "2024-08-01T12:00:00Z",
      likes_count: 11,
      comments_count: 7,
      address: "Parque Revolución, Ensenada",
      is_verified: false
    }
  ]
  
  const memoriesToUse = memories.length > 0 ? memories : defaultMemories
  
  useEffect(() => {
    const checkARSupport = async () => {
      if (!navigator.xr) {
        setError('WebXR no está disponible en este navegador')
        setIsARSupported(false)
        setCheckingAR(false)
        return
      }
      
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        setIsARSupported(supported)
        if (!supported) {
          setError('AR no está soportado en este dispositivo')
        }
      } catch (error) {
        console.error('Error checking AR support:', error)
        setIsARSupported(false)
        setError('Error verificando soporte AR: ' + error.message)
      }
      setCheckingAR(false)
    }
    
    checkARSupport()
  }, [])
  
  const enterAR = async () => {
    if (!isARSupported) {
      alert('AR no está soportado en este dispositivo o navegador')
      return
    }
    
    try {
      setError('')
      await store.enterAR()
      setIsARActive(true)
    } catch (error) {
      console.error('Error entering AR:', error)
      setError('Error iniciando AR: ' + error.message)
    }
  }
  
  const exitAR = () => {
    store.exitAR()
    setIsARActive(false)
  }
  
  const handlePlaceMemory = (memory) => {
    setPlacedMemories(prev => [...prev, memory])
  }
  
  const handleRemoveMemory = (memoryId) => {
    setPlacedMemories(prev => prev.filter(m => m.id !== memoryId))
  }
  
  const clearAllMemories = () => {
    setPlacedMemories([])
  }
  
  return (
    <div className="w-full h-full relative bg-black">
      {/* Panel de información */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
        <h3 className="font-semibold mb-2">AR Real - Memorias</h3>
        <div className="text-sm space-y-1">
          <p>📱 AR Status: {checkingAR ? 'Verificando...' : isARSupported ? '✅ Disponible' : '❌ No disponible'}</p>
          <p>🎯 Memorias: {memoriesToUse.length}</p>
          <p>📍 Colocadas: {placedMemories.length}</p>
          {error && <p className="text-red-400 text-xs">⚠️ {error}</p>}
        </div>
      </div>
      
      {/* Controles AR */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
        {!isARActive ? (
          <button
            onClick={enterAR}
            disabled={!isARSupported || checkingAR}
            className={`px-6 py-3 rounded-full font-semibold text-white transition-all ${
              isARSupported && !checkingAR
                ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-xl'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            {checkingAR ? 'Verificando...' : '🚀 Iniciar AR Real'}
          </button>
        ) : (
          <>
            <button
              onClick={exitAR}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
            >
              🚪 Salir AR
            </button>
            <button
              onClick={clearAllMemories}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
            >
              🗑️ Limpiar Todo
            </button>
          </>
        )}
      </div>
      
      {/* Instrucciones AR */}
      {isARActive && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/70 text-white p-4 rounded-lg text-center max-w-sm pointer-events-none">
          <h4 className="font-semibold mb-2">📱 Instrucciones AR</h4>
          <div className="text-sm space-y-1">
            <p>1. 📐 Mueve el teléfono para detectar superficies</p>
            <p>2. 🎯 Verás un marcador circular</p>
            <p>3. 👆 Toca la pantalla para colocar memorias</p>
            <p>4. 👆👆 Doble toque para eliminar memorias</p>
          </div>
        </div>
      )}
      
      {/* Canvas Three.js */}
      <Canvas style={{ width: '100%', height: '100%' }}>
        <XR store={store}>
          <ARSceneContent
            memories={memoriesToUse}
            placedMemories={placedMemories}
            onPlaceMemory={handlePlaceMemory}
            onRemoveMemory={handleRemoveMemory}
          />
        </XR>
      </Canvas>
      
      {/* Mensaje de ayuda para dispositivos no AR */}
      {!isARSupported && !checkingAR && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600/90 text-white p-4 rounded-lg text-center max-w-md">
          <h4 className="font-semibold mb-2">📱 AR No Disponible</h4>
          <p className="text-sm">
            Para usar AR real necesitas:
          </p>
          <ul className="text-xs mt-2 space-y-1">
            <li>• Un dispositivo móvil compatible (Android/iOS)</li>
            <li>• Navegador con WebXR (Chrome/Edge)</li>
            <li>• Conexión HTTPS</li>
            <li>• Permisos de cámara</li>
          </ul>
        </div>
      )}
    </div>
  )
}