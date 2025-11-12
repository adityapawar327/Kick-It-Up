import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { Heart, Trash2 } from 'lucide-react'

const Favorites = () => {
  const { token } = useAuth()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [token])

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/favorites')
      setFavorites(response.data)
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (sneakerId) => {
    try {
      await axios.delete(`/favorites/${sneakerId}`)
      setFavorites(favorites.filter(fav => fav.id !== sneakerId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl mb-4">No favorites yet</p>
            <Link to="/" className="btn-primary inline-block">
              Browse Sneakers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((sneaker) => (
              <div key={sneaker.id} className="card overflow-hidden group relative">
                <Link to={`/sneaker/${sneaker.id}`}>
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    <img
                      src={sneaker.imageUrls?.[0] || 'https://via.placeholder.com/400'}
                      alt={sneaker.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{sneaker.brand}</p>
                    <h3 className="font-semibold text-lg line-clamp-1">{sneaker.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Size: {sneaker.size}</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(sneaker.price)}</p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavorite(sneaker.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
