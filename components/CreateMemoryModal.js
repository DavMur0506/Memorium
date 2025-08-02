import { useState } from "react"
function CreateMemoryModal({ isOpen, onClose, onMemoryCreated, userLocation, categories, user }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'recomendacion',
    isPrivate: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      setError('Título y contenido son obligatorios')
      return
    }

    if (!user) {
      setError('Debes iniciar sesión para crear una memoria')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simular creación de memoria (reemplazar con llamada a Supabase)
      const newMemory = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: { name: user.email, id: user.id },
        distance: 0,
        likes: 0,
        views: 0,
        createdAt: 'ahora',
        isPrivate: formData.isPrivate
      }

      onMemoryCreated(newMemory)
      setFormData({ title: '', content: '', category: 'recomendacion', isPrivate: false })
      setError('')
    } catch (error) {
      setError('Error al crear la memoria')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nueva Memoria</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="¿Qué quieres compartir?"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              placeholder="Comparte los detalles..."
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="recomendacion">⭐ Recomendación</option>
              <option value="advertencia">⚠️ Advertencia</option>
              <option value="historia">📚 Historia</option>
              <option value="curiosidad">🔍 Curiosidad</option>
            </select>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Memoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMemoryModal