import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Search, Star } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const [sneakers, setSneakers] = useState([])
  const [filteredSneakers, setFilteredSneakers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedCondition, setSelectedCondition] = useState('ALL')
  const [showContent, setShowContent] = useState(false)

  const brands = ['NIKE', 'ADIDAS', 'NEW BALANCE', 'PUMA', 'CONVERSE', 'VANS']
  const conditions = ['ALL', 'NEW', 'LIKE NEW', 'USED']

  useEffect(() => {
    fetchSneakers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sneakers, selectedBrands, selectedCondition, searchTerm])

  const fetchSneakers = async () => {
    try {
      const response = await axios.get('/api/sneakers/all')
      setSneakers(response.data)
      // Trigger entrance animation after data loads
      setTimeout(() => setShowContent(true), 100)
    } catch (error) {
      console.error('Failed to fetch sneakers:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...sneakers]

    if (searchTerm.trim()) {
      filtered = filtered.filter(sneaker =>
        sneaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sneaker.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(sneaker => 
        selectedBrands.some(brand => brand.toLowerCase() === sneaker.brand.toLowerCase())
      )
    }

    if (selectedCondition !== 'ALL') {
      filtered = filtered.filter(sneaker => 
        sneaker.condition.toLowerCase() === selectedCondition.toLowerCase()
      )
    }

    setFilteredSneakers(filtered)
  }

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-sm uppercase tracking-widest mb-4 font-semibold transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              THE BEST SNEAKERS ARE ONLY HERE
            </p>
            <h1 className={`text-display text-8xl md:text-9xl font-bold mb-12 leading-none transition-all duration-1000 delay-200 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              KICK IT UP
            </h1>
            
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-8 py-5 rounded-full bg-white text-black border-2 border-white focus:outline-none text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl"
                />
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`border-b-2 border-black py-8 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-6 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider transition-all ${
                  selectedBrands.includes(brand) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {conditions.map(condition => (
              <button
                key={condition}
                onClick={() => setSelectedCondition(condition)}
                className={`px-6 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider transition-all ${
                  selectedCondition === condition ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`mb-12 transition-all duration-1000 delay-900 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-display text-6xl font-bold text-center mb-4">OUR COLLECTION</h2>
          <p className="text-center text-gray-600 uppercase text-sm tracking-wider font-semibold">
            {filteredSneakers.length} SNEAKERS FOUND
          </p>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent"></div>
            <p className="mt-6 text-sm uppercase tracking-wider font-semibold text-gray-600">LOADING COLLECTION...</p>
          </div>
        ) : filteredSneakers.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl font-bold uppercase tracking-wider mb-6">NO SNEAKERS FOUND</p>
            <button onClick={() => { setSelectedBrands([]); setSelectedCondition('ALL'); setSearchTerm('') }} className="btn-primary">
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSneakers.map((sneaker, index) => {
              const isOwnListing = user && sneaker.seller?.username === user.username
              return (
                <Link
                  key={sneaker.id}
                  to={`/sneaker/${sneaker.id}`}
                  className={`card group transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{transitionDelay: `${1000 + index * 100}ms`}}
                >
                  {isOwnListing && (
                    <div className="absolute top-4 right-4 z-10 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                      YOUR LISTING
                    </div>
                  )}
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={sneaker.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}
                      alt={sneaker.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">{sneaker.brand}</p>
                        <h3 className="font-bold text-xl uppercase tracking-wide break-words">{sneaker.name}</h3>
                      </div>
                      {sneaker.averageRating > 0 && (
                        <div className="flex items-center space-x-1 bg-black text-white px-3 py-1 rounded-full flex-shrink-0">
                          <Star className="h-4 w-4 fill-white" />
                          <span className="text-sm font-bold">{sneaker.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 uppercase tracking-wider font-semibold">
                      SIZE {sneaker.size} • {sneaker.condition}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold">${sneaker.price}</p>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                        sneaker.status === 'AVAILABLE' 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {sneaker.status}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
