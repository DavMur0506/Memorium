import { supabase } from '../lib/supabase'

// Función simplificada para debuggear likes
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

      // Actualizar contador
      console.log('📊 Actualizando contador (decrementar)...')
      const { error: updateError } = await supabase
        .from('memories')
        .update({ likes_count: supabase.raw('GREATEST(likes_count - 1, 0)') })
        .eq('id', memoryId)

      if (updateError) {
        console.error('❌ Error actualizando contador:', updateError)
      }

      console.log('✅ Like removido exitosamente')
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

      console.log('✅ Like agregado:', newLike)

      // Actualizar contador
      console.log('📊 Actualizando contador (incrementar)...')
      const { error: updateError } = await supabase
        .from('memories')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', memoryId)

      if (updateError) {
        console.error('❌ Error actualizando contador:', updateError)
      }

      console.log('✅ Like agregado exitosamente')
      return { liked: true }
    }

  } catch (error) {
    console.error('💥 Error en toggleMemoryLike:', error)
    throw error
  }
}

// Función para verificar likes de un usuario
export const getUserLikes = async (memoryIds) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !memoryIds || memoryIds.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('memory_likes')
      .select('memory_id')
      .eq('user_id', user.id)
      .in('memory_id', memoryIds)

    if (error) {
      console.error('Error obteniendo likes del usuario:', error)
      return []
    }

    return data?.map(like => like.memory_id) || []
  } catch (error) {
    console.error('Error en getUserLikes:', error)
    return []
  }
}