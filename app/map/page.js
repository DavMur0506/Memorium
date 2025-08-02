'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function MapPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga del mapa
    setTimeout(() => setLoading(false), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <div className="container-responsive py-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mapa Interactivo</h1>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🗺️
                </div>
                <h3 className="text-lg font-semibold mb-2">Mapa en desarrollo</h3>
                <p className="text-sm">Próximamente integración con Mapbox</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}