import { useState, useEffect, useCallback } from 'react'
import { getMemories, toggleMemoryLike, createMemory } from '../services/MemoryService'

export const useMemories = (initialFilters = {}) => {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  // Cargar memorias
  const loadMemories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getMemories(filters)
      setMemories(data || [])
    } catch (err) {
      console.error('Error loading memories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Dar/quitar like
  const handleToggleLike = useCallback(async (memoryId) => {
    try {
      const result = await toggleMemoryLike(memoryId)
      
      // Actualizar estado local
      setMemories(prevMemories =>
        prevMemories.map(memory => {
          if (memory.id === memoryId) {
            return {
              ...memory,
              user_has_liked: result.liked,
              likes_count: result.liked 
                ? memory.likes_count + 1 
                : memory.likes_count - 1
            }
          }
          return memory
        })
      )
      
      return result
    } catch (err) {
      console.error('Error toggling like:', err)
      throw err
    }
  }, [])

  // Crear memoria
  const handleCreateMemory = useCallback(async (memoryData) => {
    try {
      const newMemory = await createMemory(memoryData)
      
      console.log('Nueva memoria creada:', newMemory)
      
      // Agregar al estado local si coincide con los filtros actuales
      if (!filters.category || filters.category === 'TODAS' || filters.category === newMemory.category) {
        setMemories(prevMemories => {
          // Verificar que la memoria tenga los campos necesarios
          if (newMemory && newMemory.id) {
            return [newMemory, ...prevMemories]
          } else {
            console.warn('Nueva memoria no tiene la estructura esperada:', newMemory)
            return prevMemories
          }
        })
      }
      
      return newMemory
    } catch (err) {
      console.error('Error creating memory:', err)
      throw err
    }
  }, [filters])

  // Cambiar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }))
  }, [])

  // Refrescar memorias
  const refresh = useCallback(() => {
    loadMemories()
  }, [loadMemories])

  // Cargar memorias cuando cambien los filtros
  useEffect(() => {
    loadMemories()
  }, [loadMemories])

  return {
    memories,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    toggleLike: handleToggleLike,
    createMemory: handleCreateMemory
  }
}