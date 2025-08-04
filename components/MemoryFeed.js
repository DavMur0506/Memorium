'use client'

import { useState } from 'react'
import { Heart, MessageCircle, MapPin, Star, AlertTriangle, BookOpen, Search, Loader2, RefreshCw } from 'lucide-react'
import { useMemories } from '../hooks/useMemories'
import { useAuth } from '../contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const categoryIcons = {
  RECOMENDACION: Star,
  ADVERTENCIA: AlertTriangle,
  HISTORIA: BookOpen,
  CURIOSIDAD: Search
}

const categoryColors = {
  RECOMENDACION: 'text-yellow-500',
  ADVERTENCIA: 'text-red-500',
  HISTORIA: 'text-blue-500',
  CURIOSIDAD: 'text-purple-500'
}

const categoryBg = {
  RECOMENDACION: 'bg-yellow-50 border-yellow-200',
  ADVERTENCIA: 'bg-red-50 border-red-200',
  HISTORIA: 'bg-blue-50 border-blue-200',
  CURIOSIDAD: 'bg-purple-50 border-purple-200'
}

const MemoryCard = ({ memory, onToggleLike, currentUserId }) => {
  const [likeLoading, setLikeLoading] = useState(false)
  
  // Verificación defensiva
  if (!memory || !memory.id) {
    console.warn('MemoryCard recibió una memoria inválida:', memory)
    return null // No renderizar nada si la memoria es inválida
  }
  
  const Icon = categoryIcons[memory.category] || Search // Fallback icon
  
  const handleLike = async () => {
    if (!currentUserId) return
    
    try {
      setLikeLoading(true)
      await onToggleLike(memory.id)
    } catch (error) {
      console.error('Error al dar like:', error)
    } finally {
      setLikeLoading(false)
    }
  }

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es
      })
    } catch {
      return 'Hace un momento'
    }
  }

  const formatDistance = (meters) => {
    if (!meters || isNaN(meters)) return ''
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  // Valores por defecto para campos que podrían estar undefined
  const title = memory.title || 'Sin título'
  const description = memory.description || memory.content || 'Sin descripción'
  const authorName = memory.author_name || 'Usuario Anónimo'
  const likesCount = memory.likes_count || 0
  const commentsCount = memory.comments_count || 0
  const images = memory.images || memory.image_urls || []
  const address = memory.address || ''
  const category = memory.category || 'CURIOSIDAD'

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${categoryBg[category] || categoryBg.CURIOSIDAD}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${categoryColors[category] || categoryColors.CURIOSIDAD} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${categoryColors[category] || categoryColors.CURIOSIDAD}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{authorName}</span>
              <span>•</span>
              <span>{formatTimeAgo(memory.created_at)}</span>
            </div>
          </div>
        </div>
        
        {memory.distance && (
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {formatDistance(memory.distance)}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Location */}
      {address && (
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      )}

      {/* Images */}
      {images && images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  loading="lazy"
                />
                {index === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!currentUserId || likeLoading}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              memory.user_has_liked
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            } ${!currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {likeLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${memory.user_has_liked ? 'fill-current' : ''}`} />
            )}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>
        </div>

        {memory.is_verified && (
          <div className="flex items-center text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Verificado
          </div>
        )}
      </div>
    </div>
  )
}

const FilterTabs = ({ activeFilter, onFilterChange, loading }) => {
  const filters = [
    { key: 'TODAS', label: 'Todas', icon: null },
    { key: 'RECOMENDACION', label: 'Recomendaciones', icon: Star },
    { key: 'ADVERTENCIA', label: 'Advertencias', icon: AlertTriangle },
    { key: 'HISTORIA', label: 'Historia', icon: BookOpen },
    { key: 'CURIOSIDAD', label: 'Curiosidades', icon: Search }
  ]

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {filters.map((filter) => {
        const Icon = filter.icon
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange({ category: filter.key })}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter.key
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{filter.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function MemoryFeed() {
  const { user } = useAuth()
  const { 
    memories, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    refresh, 
    toggleLike 
  } = useMemories()

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refresh()
    } finally {
      setRefreshing(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar memorias</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header con botón de refresh */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Feed de Memorias</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Actualizar</span>
        </button>
      </div>

      {/* Filtros */}
      <FilterTabs
        activeFilter={filters.category || 'TODAS'}
        onFilterChange={updateFilters}
        loading={loading}
      />

      {/* Loading inicial */}
      {loading && memories.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Cargando memorias...</p>
        </div>
      )}

      {/* Sin memorias */}
      {!loading && memories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay memorias</h3>
          <p className="text-gray-500 mb-4">
            {filters.category && filters.category !== 'TODAS'
              ? `No se encontraron memorias en la categoría "${filters.category}"`
              : 'Aún no hay memorias compartidas. ¡Sé el primero en crear una!'
            }
          </p>
        </div>
      )}

      {/* Lista de memorias */}
      <div className="space-y-6">
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onToggleLike={toggleLike}
            currentUserId={user?.id}
          />
        ))}
      </div>

      {/* Loading más memorias */}
      {loading && memories.length > 0 && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto" />
        </div>
      )}
    </div>
  )
}