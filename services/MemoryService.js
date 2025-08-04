import { supabase } from '../lib/supabase'

// Obtener todas las memorias con información del usuario
export const getMemories = async (filters = {}) => {
  try {
    console.log('📥 Cargando memorias con filtros:', filters)
    
    let query = supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters.category && filters.category !== 'TODAS') {
      query = query.eq('category', filters.category)
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    const { data: memories, error } = await query

    if (error) {
      console.error('❌ Error fetching memories:', error)
      throw new Error(`Error al obtener memorias: ${error.message}`)
    }

    if (!memories || memories.length === 0) {
      console.log('📭 No hay memorias')
      return []
    }

    console.log('📋 Memorias obtenidas:', memories.length)

    // Obtener información de perfiles para todos los usuarios únicos
    const uniqueUserIds = [...new Set(memories.map(m => m.user_id))]
    
    let profilesMap = {}
    
    if (uniqueUserIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', uniqueUserIds)

      if (!profilesError && profiles) {
        profiles.forEach(profile => {
          profilesMap[profile.id] = profile
        })
      }
    }

    // Obtener el usuario actual para verificar likes
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id

    console.log('👤 Usuario actual:', currentUserId ? 'autenticado' : 'no autenticado')

    // Si hay usuario logueado, obtener sus likes
    let userLikes = []
    if (currentUserId && memories.length > 0) {
      const memoryIds = memories.map(memory => memory.id)
      console.log('🔍 Buscando likes del usuario para memorias:', memoryIds)
      
      const { data: likesData, error: likesError } = await supabase
        .from('memory_likes')
        .select('memory_id')
        .eq('user_id', currentUserId)
        .in('memory_id', memoryIds)
      
      if (likesError) {
        console.error('❌ Error obteniendo likes:', likesError)
      } else {
        userLikes = likesData?.map(like => like.memory_id) || []
        console.log('❤️ Likes del usuario encontrados:', userLikes)
      }
    }

    // Procesar los datos para mapear tu estructura a la esperada por el frontend
    const processedData = memories.map(memory => {
      const profile = profilesMap[memory.user_id]
      const hasLiked = userLikes.includes(memory.id)
      
      return {
        ...memory,
        description: memory.content, // Mapear content a description
        images: memory.image_urls || [], // Mapear image_urls a images
        likes_count: memory.likes_count || 0, // Usar el valor de la BD
        comments_count: 0, // Tu tabla no tiene comments_count, inicializar en 0
        is_verified: !memory.is_private, // Mapear is_private a is_verified (invertido)
        user_has_liked: hasLiked,
        author_name: profile?.full_name || 'Usuario Anónimo'
      }
    })

    console.log('✅ Memorias procesadas:', processedData.length)
    console.log('📊 Ejemplo de memoria procesada:', processedData[0])

    return processedData
  } catch (error) {
    console.error('💥 Error in getMemories:', error)
    throw error
  }
}

// Crear una nueva memoria
export const createMemory = async (memoryData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    // Preparar los datos para insertar - usando la estructura exacta de tu tabla
    const memoryToInsert = {
      user_id: user.id,
      title: memoryData.title,
      content: memoryData.description, // Tu tabla usa 'content'
      category: memoryData.category, // Asegurar que sea exactamente como viene del frontend
      latitude: parseFloat(memoryData.latitude),
      longitude: parseFloat(memoryData.longitude),
      address: memoryData.address || null,
      image_urls: memoryData.images || [], // Tu tabla usa 'image_urls'
      is_private: false, // Tu tabla usa 'is_private' no 'is_verified'
      views: 0 // Inicializar views en 0
    }

    console.log('Datos a insertar:', JSON.stringify(memoryToInsert, null, 2))
    console.log('Categoría específica:', memoryToInsert.category)
    console.log('Tipo de categoría:', typeof memoryToInsert.category)

    const { data, error } = await supabase
      .from('memories')
      .insert([memoryToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating memory:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Error al crear la memoria: ${error.message}`)
    }

    console.log('Memoria creada exitosamente:', data)

    // Obtener información del perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single()

    // Procesar la respuesta para incluir información del autor
    const processedMemory = {
      ...data,
      description: data.content, // Mapear content a description para el frontend
      images: data.image_urls || [], // Mapear image_urls a images para el frontend
      likes_count: 0, // No existe en tu tabla, pero lo necesitamos para el frontend
      comments_count: 0, // No existe en tu tabla, pero lo necesitamos para el frontend
      is_verified: !data.is_private, // Mapear is_private a is_verified
      author_name: profile?.full_name || user.email?.split('@')[0] || 'Usuario Anónimo',
      user_has_liked: false
    }

    console.log('Memoria procesada para retornar:', JSON.stringify(processedMemory, null, 2))

    return processedMemory
  } catch (error) {
    console.error('Error in createMemory:', error)
    throw error
  }
}

// Dar o quitar like a una memoria (versión corregida)
export const toggleMemoryLike = async (memoryId) => {
  try {
    console.log('🔄 Iniciando toggle like para memoria:', memoryId)
    
    // Verificar usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ Error obteniendo usuario:', userError)
      throw userError
    }
    
    if (!user) {
      console.error('❌ Usuario no autenticado')
      throw new Error('Usuario no autenticado')
    }
    
    console.log('✅ Usuario autenticado:', user.id)

    // Verificar si ya existe un like
    console.log('🔍 Verificando like existente...')
    const { data: existingLike, error: checkError } = await supabase
      .from('memory_likes')
      .select('id')
      .eq('memory_id', memoryId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error verificando like existente:', checkError)
      throw checkError
    }

    console.log('🔍 Like existente:', existingLike)

    if (existingLike) {
      // Quitar like
      console.log('➖ Quitando like...')
      const { error: deleteError } = await supabase
        .from('memory_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('❌ Error quitando like:', deleteError)
        throw deleteError
      }

      console.log('✅ Like removido de memory_likes')

      // Obtener el contador actual y decrementarlo
      console.log('📊 Actualizando contador (decrementar)...')
      const { data: memory, error: fetchError } = await supabase
        .from('memories')
        .select('likes_count')
        .eq('id', memoryId)
        .single()

      if (fetchError) {
        console.error('❌ Error obteniendo contador actual:', fetchError)
      } else {
        const newCount = Math.max((memory.likes_count || 0) - 1, 0)
        const { error: updateError } = await supabase
          .from('memories')
          .update({ likes_count: newCount })
          .eq('id', memoryId)

        if (updateError) {
          console.error('❌ Error actualizando contador:', updateError)
        } else {
          console.log('✅ Contador actualizado a:', newCount)
        }
      }

      return { liked: false }

    } else {
      // Agregar like
      console.log('➕ Agregando like...')
      const { data: newLike, error: insertError } = await supabase
        .from('memory_likes')
        .insert([{
          memory_id: memoryId,
          user_id: user.id
        }])
        .select()
        .single()

      if (insertError) {
        console.error('❌ Error agregando like:', insertError)
        throw insertError
      }

      console.log('✅ Like agregado a memory_likes:', newLike)

      // Obtener el contador actual e incrementarlo
      console.log('📊 Actualizando contador (incrementar)...')
      const { data: memory, error: fetchError } = await supabase
        .from('memories')
        .select('likes_count')
        .eq('id', memoryId)
        .single()

      if (fetchError) {
        console.error('❌ Error obteniendo contador actual:', fetchError)
      } else {
        const newCount = (memory.likes_count || 0) + 1
        const { error: updateError } = await supabase
          .from('memories')
          .update({ likes_count: newCount })
          .eq('id', memoryId)

        if (updateError) {
          console.error('❌ Error actualizando contador:', updateError)
        } else {
          console.log('✅ Contador actualizado a:', newCount)
        }
      }

      return { liked: true }
    }

  } catch (error) {
    console.error('💥 Error en toggleMemoryLike:', error)
    throw error
  }
}

// Obtener memorias por categoría
export const getMemoriesByCategory = async (category) => {
  return getMemories({ category })
}

// Obtener memorias cercanas
export const getNearbyMemories = async (latitude, longitude, radius = 5000) => {
  return getMemories({ 
    location: { latitude, longitude, radius } 
  })
}

// Obtener memorias del usuario actual
export const getUserMemories = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    return getMemories({ userId: user.id })
  } catch (error) {
    console.error('Error in getUserMemories:', error)
    throw error
  }
}

// Eliminar una memoria
export const deleteMemory = async (memoryId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)
      .eq('user_id', user.id) // Solo puede eliminar sus propias memorias

    if (error) {
      console.error('Error deleting memory:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteMemory:', error)
    throw error
  }
}

// Función SQL para buscar memorias dentro de un radio
// Esta función debe crearse en Supabase SQL Editor
export const createDistanceFunction = () => {
  return `
    CREATE OR REPLACE FUNCTION memories_within_radius(lat FLOAT, lng FLOAT, radius_meters INT)
    RETURNS SETOF memories AS $$
    BEGIN
      RETURN QUERY
      SELECT *
      FROM memories m
      WHERE (
        6371000 * acos(
          cos(radians(lat)) * cos(radians(m.latitude)) *
          cos(radians(m.longitude) - radians(lng)) +
          sin(radians(lat)) * sin(radians(m.latitude))
        )
      ) <= radius_meters;
    END;
    $$ LANGUAGE plpgsql;
  `
}