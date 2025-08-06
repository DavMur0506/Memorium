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
      
      // Procesar ar_position - manejar diferentes formatos posibles
      let arPosition = { x: 0, y: 0.5, z: 0 }
      
      if (memory.ar_position) {
        if (Array.isArray(memory.ar_position) && memory.ar_position.length >= 3) {
          // Formato array [x, y, z] - formato principal en BD
          arPosition = {
            x: memory.ar_position[0] || 0,
            y: memory.ar_position[1] || 0.5,
            z: memory.ar_position[2] || 0
          }
        } else if (typeof memory.ar_position === 'object' && memory.ar_position.x !== undefined) {
          // Formato objeto {x, y, z} - compatibilidad
          arPosition = {
            x: memory.ar_position.x || 0,
            y: memory.ar_position.y || 0.5,
            z: memory.ar_position.z || 0
          }
        }
      }
      
      return {
        ...memory,
        description: memory.content, // Mapear content a description
        images: memory.image_urls || [], // Mapear image_urls a images
        likes_count: memory.likes_count || 0, // Usar el valor de la BD
        comments_count: 0, // Tu tabla no tiene comments_count, inicializar en 0
        is_verified: !memory.is_private, // Mapear is_private a is_verified (invertido)
        user_has_liked: hasLiked,
        author_name: profile?.full_name || 'Usuario Anónimo',
        arPosition: arPosition, // Agregar la posición AR procesada
        // Mantener compatibilidad con campos individuales
        ar_position_x: arPosition.x,
        ar_position_y: arPosition.y,
        ar_position_z: arPosition.z
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

    // Procesar ar_position antes de insertar - asegurar formato JSON correcto
    let arPositionToSave = [0, 0.5, 0] // Formato array por defecto
    
    if (memoryData.arPosition) {
      if (Array.isArray(memoryData.arPosition) && memoryData.arPosition.length >= 3) {
        // Ya es array
        arPositionToSave = [
          memoryData.arPosition[0] || 0,
          memoryData.arPosition[1] || 0.5,
          memoryData.arPosition[2] || 0
        ]
      } else if (typeof memoryData.arPosition === 'object') {
        // Convertir objeto a array
        arPositionToSave = [
          memoryData.arPosition.x || 0,
          memoryData.arPosition.y || 0.5,
          memoryData.arPosition.z || 0
        ]
      }
    } else if (memoryData.ar_position_x !== undefined || memoryData.ar_position_y !== undefined || memoryData.ar_position_z !== undefined) {
      // Si vienen campos individuales
      arPositionToSave = [
        memoryData.ar_position_x || 0,
        memoryData.ar_position_y || 0.5,
        memoryData.ar_position_z || 0
      ]
    }

    // Preparar los datos para insertar - usando la estructura exacta de tu tabla
    const memoryToInsert = {
      user_id: user.id,
      title: memoryData.title,
      content: memoryData.description, // Tu tabla usa 'content'
      category: memoryData.category, // Asegurar que sea exactamente como viene del frontend
      latitude: memoryData.latitude ? parseFloat(memoryData.latitude) : null,
      longitude: memoryData.longitude ? parseFloat(memoryData.longitude) : null,
      address: memoryData.address || null,
      image_urls: Array.isArray(memoryData.images) ? memoryData.images : [], // Tu tabla usa 'image_urls'
      is_private: false, // Tu tabla usa 'is_private' no 'is_verified'
      ar_position: arPositionToSave, // Formato array [x, y, z]
      views: 0 // Inicializar views en 0
    }

    console.log('Datos a insertar:', JSON.stringify(memoryToInsert, null, 2))
    console.log('Categoría específica:', memoryToInsert.category)
    console.log('Tipo de categoría:', typeof memoryToInsert.category)
    console.log('AR Position a guardar:', arPositionToSave)

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

    // Procesar ar_position de la respuesta
    let arPosition = { x: 0, y: 0.5, z: 0 }
    if (data.ar_position && Array.isArray(data.ar_position) && data.ar_position.length >= 3) {
      arPosition = {
        x: data.ar_position[0] || 0,
        y: data.ar_position[1] || 0.5,
        z: data.ar_position[2] || 0
      }
    } else if (data.ar_position && typeof data.ar_position === 'object') {
      arPosition = {
        x: data.ar_position.x || 0,
        y: data.ar_position.y || 0.5,
        z: data.ar_position.z || 0
      }
    }

    // Procesar la respuesta para incluir información del autor
    const processedMemory = {
      ...data,
      description: data.content, // Mapear content a description para el frontend
      images: data.image_urls || [], // Mapear image_urls a images para el frontend
      likes_count: 0, // No existe en tu tabla, pero lo necesitamos para el frontend
      comments_count: 0, // No existe en tu tabla, pero lo necesitamos para el frontend
      is_verified: !data.is_private, // Mapear is_private a is_verified
      author_name: profile?.full_name || user.email?.split('@')[0] || 'Usuario Anónimo',
      user_has_liked: false,
      arPosition: arPosition, // Agregar la posición AR procesada
      // Mantener compatibilidad con campos individuales
      ar_position_x: arPosition.x,
      ar_position_y: arPosition.y,
      ar_position_z: arPosition.z
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

// Obtener memorias cercanas por ubicación geográfica
export const getNearbyMemories = async (latitude, longitude, radius = 5000) => {
  try {
    console.log('📍 Buscando memorias cercanas:', { latitude, longitude, radius })
    
    // Calcular los límites del cuadro de búsqueda
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    const radiusInDegrees = radius / 111320 // Aproximadamente 111320 metros por grado
    
    const minLat = lat - radiusInDegrees
    const maxLat = lat + radiusInDegrees
    const minLng = lng - (radiusInDegrees / Math.cos(lat * Math.PI / 180))
    const maxLng = lng + (radiusInDegrees / Math.cos(lat * Math.PI / 180))
    
    console.log('🔍 Límites de búsqueda:', { minLat, maxLat, minLng, maxLng })
    
    // Consulta con filtros geográficos básicos
    let query = supabase
      .from('memories')
      .select('*')
      .gte('latitude', minLat)
      .lte('latitude', maxLat)
      .gte('longitude', minLng)
      .lte('longitude', maxLng)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })
    
    const { data: memories, error } = await query
    
    if (error) {
      console.error('❌ Error fetching nearby memories:', error)
      throw new Error(`Error al obtener memorias cercanas: ${error.message}`)
    }
    
    if (!memories || memories.length === 0) {
      console.log('📭 No hay memorias cercanas')
      return []
    }
    
    console.log('📋 Memorias en área encontradas:', memories.length)
    
    // Función para calcular distancia precisa
    const calculatePreciseDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3 // Radio de la Tierra en metros
      const φ1 = lat1 * Math.PI/180
      const φ2 = lat2 * Math.PI/180
      const Δφ = (lat2-lat1) * Math.PI/180
      const Δλ = (lon2-lon1) * Math.PI/180

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      return R * c
    }
    
    // Filtrar por distancia exacta y calcular distancia para cada memoria
    const memoriesWithDistance = memories
      .map(memory => {
        const distance = calculatePreciseDistance(
          lat, lng,
          memory.latitude, memory.longitude
        )
        return {
          ...memory,
          distance: distance
        }
      })
      .filter(memory => memory.distance <= radius)
      .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
    
    console.log('📏 Memorias dentro del radio:', memoriesWithDistance.length)
    
    if (memoriesWithDistance.length === 0) {
      return []
    }
    
    // Obtener información de perfiles para todos los usuarios únicos
    const uniqueUserIds = [...new Set(memoriesWithDistance.map(m => m.user_id))]
    
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

    // Si hay usuario logueado, obtener sus likes
    let userLikes = []
    if (currentUserId && memoriesWithDistance.length > 0) {
      const memoryIds = memoriesWithDistance.map(memory => memory.id)
      
      const { data: likesData, error: likesError } = await supabase
        .from('memory_likes')
        .select('memory_id')
        .eq('user_id', currentUserId)
        .in('memory_id', memoryIds)
      
      if (likesError) {
        console.error('❌ Error obteniendo likes:', likesError)
      } else {
        userLikes = likesData?.map(like => like.memory_id) || []
      }
    }

    // Procesar los datos para mapear tu estructura a la esperada por el frontend
    const processedData = memoriesWithDistance.map(memory => {
      const profile = profilesMap[memory.user_id]
      const hasLiked = userLikes.includes(memory.id)
      
      // Procesar ar_position - manejar diferentes formatos posibles
      let arPosition = { x: 0, y: 0.5, z: 0 }
      
      if (memory.ar_position) {
        if (Array.isArray(memory.ar_position) && memory.ar_position.length >= 3) {
          // Formato array [x, y, z]
          arPosition = {
            x: memory.ar_position[0] || 0,
            y: memory.ar_position[1] || 0.5,
            z: memory.ar_position[2] || 0
          }
        } else if (typeof memory.ar_position === 'object' && memory.ar_position.x !== undefined) {
          // Formato objeto {x, y, z}
          arPosition = {
            x: memory.ar_position.x || 0,
            y: memory.ar_position.y || 0.5,
            z: memory.ar_position.z || 0
          }
        }
      }
      
      return {
        ...memory,
        description: memory.content, // Mapear content a description
        images: memory.image_urls || [], // Mapear image_urls a images
        likes_count: memory.likes_count || 0,
        comments_count: 0,
        is_verified: !memory.is_private, // Mapear is_private a is_verified (invertido)
        user_has_liked: hasLiked,
        author_name: profile?.full_name || 'Usuario Anónimo',
        arPosition: arPosition, // Agregar la posición AR procesada
        // Mantener compatibilidad con campos individuales
        ar_position_x: arPosition.x,
        ar_position_y: arPosition.y,
        ar_position_z: arPosition.z,
        // Información adicional para AR
        distance: memory.distance, // Distancia en metros
        isNearbyMemory: true // Flag para identificar memorias cercanas
      }
    })

    console.log('✅ Memorias cercanas procesadas:', processedData.length)
    console.log('📊 Distancias:', processedData.map(m => `${m.title}: ${m.distance.toFixed(0)}m`))

    return processedData
  } catch (error) {
    console.error('💥 Error in getNearbyMemories:', error)
    throw error
  }
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