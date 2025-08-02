'use client'

import Header from '../../components/Header'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <div className="container-responsive py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Mi Perfil</h1>
          
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              👤
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Perfil de Usuario
            </h3>
            <p className="text-gray-500 mb-6">
              Funcionalidad en desarrollo
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Ver mis memorias</p>
              <p>• Estadísticas personales</p>
              <p>• Configuración de privacidad</p>
              <p>• Notificaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}