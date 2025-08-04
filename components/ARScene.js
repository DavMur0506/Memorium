// 'use client'

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
'use client'

import { useState, useEffect, useRef } from 'react'

// Componente de cámara simplificado para debug
function DebugCamera({ onCameraReady }) {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('Iniciando...')
  const videoRef = useRef(null)
  
  const initCamera = async () => {
    try {
      setStatus('Solicitando permisos...')
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      })
      
      setStatus('Cámara obtenida, iniciando video...')
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Forzar la reproducción del video en móviles
        videoRef.current.onloadedmetadata = async () => {
          try {
            setStatus('Iniciando reproducción...')
            await videoRef.current.play()
            setStatus('✅ Video reproduciendo')
            onCameraReady?.(true)
          } catch (playError) {
            console.error('Error al reproducir video:', playError)
            setStatus('❌ Error al reproducir video')
            setError(`Error de reproducción: ${playError.message}`)
          }
        }
        
        // Manejar errores del video
        videoRef.current.onerror = (e) => {
          console.error('Error en el video:', e)
          setError('Error en el elemento video')
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError(`Error: ${err.name} - ${err.message}`)
      setStatus('Error al acceder a la cámara')
      onCameraReady?.(false)
    }
  }
  
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])
  
  if (error) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#dc2626',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>❌ Error</h2>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <button
          onClick={initCamera}
          style={{
            backgroundColor: 'white',
            color: '#dc2626',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🔄 Intentar de nuevo
        </button>
      </div>
    )
  }
  
  if (!stream) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#1e40af',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>📷 Debug AR</h2>
        <p style={{ marginBottom: '20px' }}>Estado: {status}</p>
        <button
          onClick={initCamera}
          style={{
            backgroundColor: 'white',
            color: '#1e40af',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚀 Activar Cámara
        </button>
        
        <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
          <p>URL: {window.location.href}</p>
          <p>HTTPS: {window.location.protocol === 'https:' ? '✅' : '❌'}</p>
          <p>MediaDevices: {navigator.mediaDevices ? '✅' : '❌'}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          backgroundColor: '#000'
        }}
      />
      
      {/* Overlay de información */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '200px'
      }}>
        <p>✅ Cámara activa</p>
        <p>📱 {status}</p>
        <p style={{ fontSize: '10px', opacity: 0.7, marginTop: '5px' }}>
          Video ready: {videoRef.current?.readyState || 'N/A'}
        </p>
      </div>
      
      {/* Botón manual de play si el video no arranca */}
      {stream && status.includes('iniciando') && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100
        }}>
          <button
            onClick={async () => {
              if (videoRef.current) {
                try {
                  await videoRef.current.play()
                  setStatus('✅ Video reproduciendo (manual)')
                  onCameraReady?.(true)
                } catch (e) {
                  setError('No se pudo reproducir el video: ' + e.message)
                }
              }
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#1e40af',
              padding: '15px 25px',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            ▶️ Reproducir Video
          </button>
        </div>
      )}
    </div>
  )
}

export default function DebugARScene() {
  const [mounted, setMounted] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  
  useEffect(() => {
    console.log('DebugARScene montándose...')
    setMounted(true)
  }, [])
  
  const handleCameraReady = (ready) => {
    console.log('Cámara lista:', ready)
    setCameraReady(ready)
  }
  
  console.log('Renderizando DebugARScene, mounted:', mounted)
  
  if (!mounted) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#10b981',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p>Iniciando Debug AR...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <DebugCamera onCameraReady={handleCameraReady} />
      
      {/* Botón de prueba flotante */}
      {cameraReady && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}>
          <button
            onClick={() => {
              alert('¡Cámara funcionando! 📷✨')
            }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '4px solid rgba(255,255,255,0.5)',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            📷
          </button>
        </div>
      )}
    </div>
  )
}