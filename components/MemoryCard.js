import { MapPin, Plus } from 'lucide-react'

function MemoryCard({ memory, categories }) {
  const categoryInfo = categories[memory.category] || categories.recomendacion
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`}></div>
            <h3 className="font-semibold text-gray-800">{memory.title}</h3>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{memory.distance}m</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{memory.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{memory.author.name}</span>
            <span className="text-sm text-gray-500">{memory.createdAt}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">❤️ {memory.likes}</span>
            <span className="text-sm text-gray-500">👁️ {memory.views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


export default MemoryCard