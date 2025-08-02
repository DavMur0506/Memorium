import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Cliente para componentes del lado del cliente
export const createClient = () => createClientComponentClient()

// Funciones para memorias
export const memoriesApi = {
  // Obtener memorias cercanas usando la función SQL personalizada
  getNearbyMemories: async (lat, lng, radiusMeters = 5000, category = null) => {
    const supabase = createClient()
    
    try {
      let query = supabase.rpc('get_nearby_memories', {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius_meters: parseInt(radiusMeters)
      })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query.limit(50)
      
      if (error) {
        console.error('Error fetching nearby memories:', error)
        throw error
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getNearbyMemories:', error)
      return { data: [], error }
    }
  },

  // Crear nueva memoria
  createMemory: async (memoryData) => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([memoryData])
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
      console.error('Error creating memory:', error)
      return { data: null, error }
    }
  },

  // Obtener memoria por ID
  getMemoryById: async (id) => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles!memories_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      // Incrementar vistas
      await supabase
        .from('memories')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching memory by ID:', error)
      return { data: null, error }
    }
  },

  // Dar/quitar like a una memoria
  toggleLike: async (memoryId, userId) => {
    const supabase = createClient()
    
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
      console.error('Error toggling like:', error)
      return { liked: false, error }
    }
  }
}

// Funciones para autenticación
export const authApi = {
  // Obtener usuario actual
  getCurrentUser: async () => {
    const supabase = createClient()
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null, error }
    }
  },

  // Registrarse
  signUp: async (email, password, metadata = {}) => {
    const supabase = createClient()
    
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

  // Iniciar sesión
  signIn: async (email, password) => {
    const supabase = createClient()
    
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

  // Cerrar sesión
  signOut: async () => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error in signOut:', error)
      return { error }
    }
  }
}

// Funciones para perfiles
export const profilesApi = {
  // Obtener perfil por ID
  getProfile: async (userId) => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error getting profile:', error)
      return { data: null, error }
    }
  },

  // Crear o actualizar perfil
  upsertProfile: async (profile) => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error upserting profile:', error)
      return { data: null, error }
    }
  }
}

export default createClient