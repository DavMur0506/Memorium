'use client'
import { useState, Suspense } from 'react'
import { Plus, Camera, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useMemories } from '@/hooks/useMemories'
import MemoryFeed from '@/components/MemoryFeed'
import CreateMemoryModal from '@/components/CreateMemoryModal'
import AuthModal from '@/components/auth/AuthModal'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'

// Import dinámico para evitar problemas de SSR con Three.js
const ARScene = dynamic(() => import('@/components/ARScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Cargando experiencia AR...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  const { 
    memories, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    refresh, 
    toggleLike,
    createMemory 
  } = useMemories()
  const { user, isAuthenticated } = useAuth()
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAR, setShowAR] = useState(false) // Estado para mostrar AR
  const [showCreateModal, setShowCreateModal] = useState(false)

  const categories = [
    { key: 'TODAS', label: 'Todas', icon: '🌐', color: 'bg-gray-100' },
    { key: 'RECOMENDACION', label: 'Recomendaciones', icon: '⭐', color: 'bg-yellow-100' },
    { key: 'ADVERTENCIA', label: 'Advertencias', icon: '⚠️', color: 'bg-red-100' },
    { key: 'HISTORIA', label: 'Historia', icon: '📚', color: 'bg-blue-100' },
    { key: 'CURIOSIDAD', label: 'Curiosidades', icon: '🔍', color: 'bg-purple-100' }
  ]
  const handleARClick = () => {
    if (isAuthenticated) {
      setShowAR(true)
    } else {
      setShowAuthModal(true)
    }
  }
  const handleCreateClick = () => {
    if (isAuthenticated) {
      setShowCreateModal(true)
    } else {
      setShowAuthModal(true)
    }
  }
  const handleMemoryCreated = async (memoryData) => {
    try {
      await createMemory(memoryData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating memory:', error)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  // Si AR está activo, mostrar solo la escena AR
  if (showAR) {
    return (
      <div className="fixed inset-0 bg-black">
        {/* Botón para cerrar AR */}
        <button
          onClick={() => setShowAR(false)}
          className="absolute top-4 right-4 z-50 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Escena AR */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Inicializando AR...</p>
            </div>
          </div>
        }>
          <ARScene memories={memories} onToggleLike={toggleLike} currentUserId={user?.id} />
        </Suspense>
      </div>
    )
  }

  if (loading && memories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando memorias cercanas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar memorias</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header */}
      
      <Header onCreateClick={handleCreateClick} isAuthenticated={isAuthenticated} onARClick={handleARClick} user={user} setShowAuthModal={setShowAuthModal}></Header>
      <div className="max-w-4xl mx-auto px-4 py-6">
        

        {/* Lista de memorias */}
        <MemoryFeed/>

        {/* Loading más memorias */}
        {loading && memories.length > 0 && (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateMemoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onMemoryCreated={handleMemoryCreated}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}