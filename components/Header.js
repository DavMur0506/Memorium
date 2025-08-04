import { useMobile } from '@/contexts/MobileContext'
import { isMobile } from '@/lib/utils'
import { Camera, MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
function Header({ onCreateClick, onARClick, onSignOut,isAuthenticated,user}) {
  const { isMobile } = useMobile();
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              {isMobile && 
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Memorium</h1>
                  <p className="text-sm text-gray-500">Descubre historias cerca de ti</p>
                </div>
              }
              
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Botón AR - Cámara */}
              <button
                onClick={onARClick}
                className="bg-purple-400 text-white p-3 rounded-full hover:shadow-lg transition-all"
                title="Abrir AR"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Botón Crear Memoria */}
              <button
                onClick={onCreateClick}
                className=" bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                {isMobile &&  
                  <span>Crear Memoria</span>
                }
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  { isMobile &&
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                  </div>
                  }
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-purple-600 hover:text-purple-800 font-medium px-4 py-2 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
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
