'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Github, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin') // 'signin' o 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        // Validación de contraseñas
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          return
        }

        // Registro con Supabase
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: window.location.origin
          }
        })

        if (error) {
          throw error
        }

        if (data.user && !data.user.email_confirmed_at) {
          setMessage('Te hemos enviado un email de confirmación. Por favor revisa tu bandeja de entrada.')
          // No cerramos el modal para mostrar el mensaje
        } else if (data.user) {
          onAuthSuccess(data.user)
          onClose()
        }

      } else {
        // Inicio de sesión con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          throw error
        }

        if (data.user) {
          onAuthSuccess(data.user)
          onClose()
        }
      }

    } catch (error) {
      console.error('Error de autenticación:', error)
      
      // Manejo de errores específicos de Supabase
      switch (error.message) {
        case 'Invalid login credentials':
          setError('Credenciales inválidas. Verifica tu email y contraseña.')
          break
        case 'User already registered':
          setError('Este email ya está registrado. Intenta iniciar sesión.')
          break
        case 'Email not confirmed':
          setError('Por favor confirma tu email antes de iniciar sesión.')
          break
        case 'Signup not allowed for this instance':
          setError('El registro no está habilitado en este momento.')
          break
        case 'Password should be at least 6 characters':
          setError('La contraseña debe tener al menos 6 caracteres.')
          break
        case 'Unable to validate email address: invalid format':
          setError('Formato de email inválido.')
          break
        default:
          setError(error.message || 'Error en la autenticación')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) {
        throw error
      }
      
      // El redirect será manejado automáticamente por Supabase
    } catch (error) {
      console.error('Error con GitHub:', error)
      setError('Error al conectar con GitHub')
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
    setMessage('')
  }

  const handleModeChange = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start">
            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline mr-1" />
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {loading ? 'Procesando...' : (mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {/* Separador */}
        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Botón de GitHub */}
        <button
          onClick={handleGitHubSignIn}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Github className="w-5 h-5 mr-2" />
          Continuar con GitHub
        </button>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleModeChange}
            className="text-sm text-purple-600 hover:text-purple-800"
            disabled={loading}
          >
            {mode === 'signin' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}