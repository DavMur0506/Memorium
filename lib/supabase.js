import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Cliente principal de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Funciones de autenticación
export const auth = {
  // Registrarse con email y password
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName || email.split('@')[0],
            ...metadata
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in signUp:', error)
      return { data: null, error }
    }
  },

  // Iniciar sesión con email y password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { data: null, error }
    }
  },

  // Iniciar sesión con proveedor OAuth (Google, GitHub, etc.)
  signInWithProvider: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in signInWithProvider:', error)
      return { data: null, error }
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error in signOut:', error)
      return { error }
    }
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in resetPassword:', error)
      return { data: null, error }
    }
  },

  // Actualizar contraseña
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in updatePassword:', error)
      return { data: null, error }
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  },

  // Obtener sesión actual
  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      console.error('Error in getCurrentSession:', error)
      return { session: null, error }
    }
  }
}

// Funciones para perfiles de usuario
export const profiles = {
  // Obtener perfil por ID
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in getProfile:', error)
      return { data: null, error }
    }
  },

  // Crear o actualizar perfil
  upsertProfile: async (profile) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in upsertProfile:', error)
      return { data: null, error }
    }
  },

  // Actualizar avatar
  updateAvatar: async (userId, avatarUrl) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateAvatar:', error)
      return { data: null, error }
    }
  }
}

// Funciones para memorias
export const memories = {
  // Obtener memorias cercanas usando la función SQL
  getNearbyMemories: async (lat, lng, radiusMeters = 5000, category = null) => {
    try {
      let query = supabase.rpc('get_nearby_memories', {
        lat,
        lng,
        radius_meters: radiusMeters
      })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query.limit(50)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in getNearbyMemories:', error)
      return { data: null, error }
    }
  },

  // Obtener todas las memorias con paginación
  getMemories: async (options = {}) => {
    try {
      const {
        category,
        userId,
        isPrivate = false,
        limit = 10,
        offset = 0,
        orderBy = 'created_at'
      } = options

      let query = supabase
        .from('memories')
        .select(`
          *,
          profiles!memories_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('is_private', isPrivate)

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
        .order(orderBy, { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in getMemories:', error)
      return { data: null, error }
    }
  },

  // Crear nueva memoria
  createMemory: async (memory) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert(memory)
        .select(`
          *,
          profiles!memories_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in createMemory:', error)
      return { data: null, error }
    }
  },

  // Obtener memoria por ID
  getMemoryById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles!memories_user_id_fkey (
            full_name,
            avatar_url
          ),
          comments (
            *,
            profiles!comments_user_id_fkey (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error

      // Incrementar vistas
      await supabase
        .from('memories')
        .update({ views: data.views + 1 })
        .eq('id', id)

      return { data, error: null }
    } catch (error) {
      console.error('Error in getMemoryById:', error)
      return { data: null, error }
    }
  },

  // Actualizar memoria
  updateMemory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles!memories_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateMemory:', error)
      return { data: null, error }
    }
  },

  // Eliminar memoria
  deleteMemory: async (id) => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in deleteMemory:', error)
      return { data: null, error }
    }
  },

  // Dar/quitar like a una memoria
  toggleLike: async (memoryId, userId) => {
    try {
      // Verificar si ya existe el like
      const { data: existingLike } = await supabase
        .from('memory_likes')
        .select('id')
        .eq('memory_id', memoryId)
        .eq('user_id', userId)
        .single()

      if (existingLike) {
        // Quitar like
        const { error } = await supabase
          .from('memory_likes')
          .delete()
          .eq('memory_id', memoryId)
          .eq('user_id', userId)
        
        if (error) throw error
        return { liked: false, error: null }
      } else {
        // Agregar like
        const { error } = await supabase
          .from('memory_likes')
          .insert({ memory_id: memoryId, user_id: userId })
        
        if (error) throw error
        return { liked: true, error: null }
      }
    } catch (error) {
      console.error('Error in toggleLike:', error)
      return { liked: false, error }
    }
  },

  // Verificar si el usuario dio like a una memoria
  checkLike: async (memoryId, userId) => {
    try {
      const { data, error } = await supabase
        .from('memory_likes')
        .select('id')
        .eq('memory_id', memoryId)
        .eq('user_id', userId)
        .single()
      
      return { liked: !!data, error: null }
    } catch (error) {
      return { liked: false, error: null }
    }
  }
}

// Funciones para comentarios
export const comments = {
  // Crear comentario
  createComment: async (comment) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select(`
          *,
          profiles!comments_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in createComment:', error)
      return { data: null, error }
    }
  },

  // Obtener comentarios de una memoria
  getCommentsByMemoryId: async (memoryId, options = {}) => {
    try {
      const { limit = 50, offset = 0 } = options

      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in getCommentsByMemoryId:', error)
      return { data: null, error }
    }
  },

  // Eliminar comentario
  deleteComment: async (id) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in deleteComment:', error)
      return { data: null, error }
    }
  }
}

// Funciones para subida de archivos
export const storage = {
  // Subir imagen
  uploadImage: async (file, userId, path = '') => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = path ? `${path}/${fileName}` : fileName

      const { data, error } = await supabase.storage
        .from('memories')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(filePath)

      return { data: { ...data, publicUrl, path: filePath }, error: null }
    } catch (error) {
      console.error('Error in uploadImage:', error)
      return { data: null, error }
    }
  },

  // Eliminar imagen
  deleteImage: async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('memories')
        .remove([path])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error in deleteImage:', error)
      return { data: null, error }
    }
  },

  // Obtener URL pública
  getPublicUrl: (path) => {
    return supabase.storage
      .from('memories')
      .getPublicUrl(path)
  }
}

// Event listeners para cambios de autenticación
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

export default supabase