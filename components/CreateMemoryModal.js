'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Camera, Star, AlertTriangle, BookOpen, Search, Loader2, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { createMemory } from '../services/MemoryService'

const categories = [
  { 
    key: 'RECOMENDACION', 
    label: 'Recomendación', 
    icon: Star, 
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
  },
  { 
    key: 'ADVERTENCIA', 
    label: 'Advertencia', 
    icon: AlertTriangle, 
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200 hover:bg-red-100'
  },
  { 
    key: 'HISTORIA', 
    label: 'Historia', 
    icon: BookOpen, 
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  { 
    key: 'CURIOSIDAD', 
    label: 'Curiosidad', 
    icon: Search, 
    color: 'text-purple-500',
    bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  }
]

export default function CreateMemoryModal({ isOpen, onClose, onMemoryCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    latitude: null,
    longitude: null,
    address: '',
    images: []
  })

  // Limpiar formulario al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        category: '',
        latitude: null,
        longitude: null,
        address: '',
        images: []
      })
      setError('')
    }
  }, [isOpen])

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    setLocationLoading(true)
    setError('')

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation no está soportado en este navegador')
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      const { latitude, longitude } = position.coords
      
      // Intentar obtener la dirección usando reverse geocoding
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
        )
        const data = await response.json()
        const address = data.results?.[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          address
        }))
      } catch (geocodeError) {
        // Si falla el geocoding, usar coordenadas
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }))
      }
    } catch (error) {
      console.error('Error getting location:', error)
      setError('No se pudo obtener la ubicación. Por favor ingresa la dirección manualmente.')
    } finally {
      setLocationLoading(false)
    }
  }

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido')
      return false
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida')
      return false
    }
    if (!formData.category) {
      setError('Selecciona una categoría')
      return false
    }
    if (!formData.latitude || !formData.longitude) {
      setError('La ubicación es requerida')
      return false
    }
    return true
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const memoryData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address.trim() || null,
        images: formData.images,
        is_verified: false
      }

      await createMemory(memoryData)
      
      // Notificar éxito
      onMemoryCreated?.()
      onClose()
    } catch (error) {
      console.error('Error creating memory:', error)
      setError(error.message || 'Error al crear la memoria')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Crear Memoria</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="¿Qué quieres compartir?"
              disabled={loading}
              required
              maxLength={100}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Cuenta más detalles sobre este lugar o experiencia..."
              rows={4}
              disabled={loading}
              required
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.description.length}/500
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categoría *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                const isSelected = formData.category === category.key
                
                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleInputChange('category', category.key)}
                    disabled={loading}
                    className={`p-3 border rounded-lg transition-all text-left ${
                      isSelected
                        ? `${category.bg} border-opacity-50 ring-2 ring-opacity-20`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${isSelected ? category.color : 'text-gray-400'}`} />
                      <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {category.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            
            {/* Botón para obtener ubicación actual */}
            <div className="mb-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading || locationLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {locationLoading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                </span>
              </button>
            </div>

            {/* Campo de dirección */}
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Dirección o descripción del lugar"
              disabled={loading}
            />
            
            {/* Mostrar coordenadas si están disponibles */}
            {formData.latitude && formData.longitude && (
              <div className="text-xs text-gray-500 mt-1">
                Coordenadas: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description || !formData.category || !formData.latitude}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <span>Crear Memoria</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}