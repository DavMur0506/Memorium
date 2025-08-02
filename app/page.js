'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import MemoryCard from '@/components/MemoryCard'
import CreateMemoryModal from '@/components/CreateMemoryModal'
import AuthModal from '@/components/auth/AuthModal'
export default function HomePage() {
  const [memories, setMemories] = useState([])
  const [user, setUser] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const categories = {
    all: { label: 'Todas', icon: '🌐', color: 'bg-gray-100' },
    recomendacion: { label: 'Recomendaciones', icon: '⭐', color: 'bg-yellow-100' },
    advertencia: { label: 'Advertencias', icon: '⚠️', color: 'bg-red-100' },
    historia: { label: 'Historia', icon: '📚', color: 'bg-blue-100' },
    curiosidad: { label: 'Curiosidades', icon: '🔍', color: 'bg-purple-100' }
  }

  // Datos de ejemplo
  const sampleMemories = [
    {
      id: 1,
      title: "Café increíble",
      content: "Este lugar tiene el mejor café de especialidad de la zona. Prueben el cappuccino con leche de avena.",
      category: "recomendacion",
      author: { name: "Ana García", id: 1 },
      distance: 50,
      likes: 12,
      views: 45,
      createdAt: "2h",
      isPrivate: false
    },
    {
      id: 2,
      title: "Cuidado con el hoyo",
      content: "Hay un hoyo grande en la banqueta justo aquí. Especialmente peligroso de noche.",
      category: "advertencia",
      author: { name: "Carlos López", id: 2 },
      distance: 120,
      likes: 8,
      views: 23,
      createdAt: "5h",
      isPrivate: false
    },
    {
      id: 3,
      title: "Arte urbano histórico",
      content: "Este mural fue pintado en los 80s por un artista local. Representa la historia del barrio.",
      category: "historia",
      author: { name: "María Rodríguez", id: 3 },
      distance: 200,
      likes: 25,
      views: 78,
      createdAt: "1d",
      isPrivate: false
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMemories(sampleMemories)
      setLoading(false)
    }, 1000)

    // Obtener ubicación
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      })
    }
  }, [])

  const handleMemoryCreated = (newMemory) => {
    setMemories([newMemory, ...memories])
    setShowCreateForm(false)
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleSignOut = () => {
    setUser(null)
  }

  const handleCreateClick = () => {
    if (user) {
      setShowCreateForm(true)
    } else {
      setShowAuthModal(true)
    }
  }

  const filteredMemories = selectedCategory === 'all' 
    ? memories 
    : memories.filter(m => m.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando memorias cercanas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header 
        onCreateClick={handleCreateClick}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : `${cat.color} text-gray-700 hover:shadow-md`
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de memorias */}
        <div className="space-y-4">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay memorias aquí aún
              </h3>
              <p className="text-gray-500 mb-4">
                Sé el primero en compartir algo sobre este lugar
              </p>
              <button
                onClick={handleCreateClick}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
              >
                Crear primera memoria
              </button>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                categories={categories}
              />
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateMemoryModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onMemoryCreated={handleMemoryCreated}
        userLocation={userLocation}
        categories={categories}
        user={user}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}