'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, profiles, onAuthStateChange } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar perfil del usuario
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await profiles.getProfile(userId)
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }
      
      if (!data) {
        // Crear perfil por defecto si no existe
        const defaultProfile = {
          id: userId,
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario',
          avatar_url: user?.user_metadata?.avatar_url || null,
        }
        
        const { data: newProfile } = await profiles.upsertProfile(defaultProfile)
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
      setError('Error al cargar el perfil')
    }
  }

  // Manejar cambios de estado de autenticación
  useEffect(() => {
    let mounted = true

    // Función para manejar cambios de autenticación
    const handleAuthChange = async (event, session) => {
      console.log('Auth event:', event, session?.user?.id)
      
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      
      setLoading(false)
      setError(null)
    }

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { session, error } = await auth.getCurrentSession()
        if (error) throw error
        
        if (mounted) {
          await handleAuthChange('INITIAL_SESSION', session)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) {
          setLoading(false)
          setError('Error al obtener la sesión')
        }
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = onAuthStateChange(handleAuthChange)

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Funciones de autenticación
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await auth.signUp(email, password, metadata)
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('SignUp error:', error)
      setError('Error al crear la cuenta')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('SignIn error:', error)
      setError('Error al iniciar sesión')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await auth.signInWithProvider(provider)
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('SignInWithProvider error:', error)
      setError('Error al iniciar sesión con ' + provider)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await auth.signOut()
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      // Limpiar estado local
      setUser(null)
      setProfile(null)
      
      return { success: true }
    } catch (error) {
      console.error('SignOut error:', error)
      setError('Error al cerrar sesión')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await auth.resetPassword(email)
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('ResetPassword error:', error)
      setError('Error al enviar email de recuperación')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }
      
      const updatedProfile = { ...profile, ...updates, id: user.id }
      const { data, error } = await profiles.upsertProfile(updatedProfile)
      
      if (error) {
        setError(getErrorMessage(error))
        return { success: false, error }
      }
      
      setProfile(data)
      return { success: true, data }
    } catch (error) {
      console.error('UpdateProfile error:', error)
      setError('Error al actualizar el perfil')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener mensajes de error legibles
  const getErrorMessage = (error) => {
    const errorMessages = {
      'Invalid login credentials': 'Credenciales incorrectas',
      'Email not confirmed': 'Por favor confirma tu email',
      'User already registered': 'El usuario ya está registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Signup is disabled': 'El registro está deshabilitado',
      'Email rate limit exceeded': 'Demasiados intentos, intenta más tarde',
      'User not found': 'Usuario no encontrado',
      'Email address not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
      'Signups not allowed for otp': 'El registro con este método no está permitido',
      'Only an email address or phone number should be provided on signup': 'Solo proporciona email o teléfono'
    }
    
    return errorMessages[error.message] || error.message || 'Error desconocido'
  }

  // Estado de autenticación
  const isAuthenticated = !!user
  const isLoading = loading

  const value = {
    // Estado
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    
    // Funciones de autenticación
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updateProfile,
    
    // Utilidades
    clearError: () => setError(null),
    refreshProfile: () => user ? loadUserProfile(user.id) : null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext