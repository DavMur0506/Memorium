import { MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
function Header({ onCreateClick, user, onAuthClick, onSignOut }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Memorium</h1>
              <p className="text-sm text-gray-600">Descubre historias cerca de ti</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={onCreateClick}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Memoria</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">Usuario</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            onSignOut()
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


export default Header
