import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { Search, Star, TrendingUp } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const { formatPrice } = useCurrency()
  const [sneakers, setSneakers] = useState([])
  const [filteredSneakers, setFilteredSneakers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedCondition, setSelectedCondition] = useState('ALL')
  const [showContent, setShowContent] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const brands = ['NIKE', 'ADIDAS', 'NEW BALANCE', 'PUMA', 'CONVERSE', 'VANS']
  const conditions = ['ALL', 'NEW', 'LIKE NEW', 'USED']

  useEffect(() => {
    fetchSneakers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sneakers, selectedBrands, selectedCondition, searchTerm])

  useEffect(() => {
    let imageSlider = null
    if (expandedCard) {
      const sneaker = filteredSneakers.find(s => s.id === expandedCard)
      if (sneaker?.imageUrls?.length > 1) {
        imageSlider = setInterval(() => {
          setCurrentImageIndex(prev => (prev + 1) % sneaker.imageUrls.length)
        }, 2000)
      }
    }
    return () => {
      if (imageSlider) clearInterval(imageSlider)
    }
  }, [expandedCard, filteredSneakers])

  const handleCardHover = (sneakerId) => {
    const timer = setTimeout(() => {
      setExpandedCard(sneakerId)
      setCurrentImageIndex(0)
    }, 3000)
    
    return () => clearTimeout(timer)
  }

  const fetchSneakers = async () => {
    try {
      console.log('Fetching sneakers from /sneakers/all...')
      const response = await axios.get('/sneakers/all')
      console.log('Response received:', response.data.length, 'sneakers')
      setSneakers(response.data)
      setTimeout(() => setShowContent(true), 100)
    } catch (error) {
      console.error('Failed to fetch sneakers:', error)
      console.error('Error details:', error.response?.data || error.message)
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
      <div className="relative bg-black text-white py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
          }}></div>
        </div>

        {/* Image Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80"
            alt="Sneakers Background"
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-block mb-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <span className="text-xs uppercase tracking-widest font-bold">PREMIUM MARKETPLACE</span>
              </div>
            </div>
            
            <h1 className={`text-display text-8xl md:text-9xl lg:text-[12rem] font-bold mb-6 leading-none transition-all duration-1000 delay-200 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              KICK IT UP
            </h1>
            
            <p className={`text-lg md:text-xl uppercase tracking-wider mb-12 font-semibold max-w-2xl mx-auto transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              DISCOVER, BUY & SELL AUTHENTIC SNEAKERS
            </p>
            
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="SEARCH FOR YOUR NEXT PAIR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-8 py-6 rounded-full bg-white text-black border-2 border-white focus:outline-none text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl focus:shadow-2xl"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black rounded-full p-3 group-hover:scale-110 transition-transform">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Filters */}
      <div className={`border-b-2 border-black py-12 bg-gray-50 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-display text-3xl font-bold mb-2 uppercase">FILTER BY BRAND</h3>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-8 py-4 rounded-full border-2 border-black font-bold uppercase text-sm tracking-wider transition-all hover:scale-105 ${
                  selectedBrands.includes(brand) ? 'bg-black text-white shadow-lg' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-display text-3xl font-bold mb-2 uppercase">CONDITION</h3>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {conditions.map(condition => (
              <button
                key={condition}
                onClick={() => setSelectedCondition(condition)}
                className={`px-8 py-4 rounded-full border-2 border-black font-bold uppercase text-sm tracking-wider transition-all hover:scale-105 ${
                  selectedCondition === condition ? 'bg-black text-white shadow-lg' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`text-center mb-16 transition-all duration-1000 delay-900 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-display text-7xl font-bold mb-4 uppercase">OUR COLLECTION</h2>
          <div className="w-32 h-2 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 uppercase text-sm tracking-wider font-semibold">
            {filteredSneakers.length} PREMIUM SNEAKERS AVAILABLE
          </p>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-6"></div>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">LOADING COLLECTION...</p>
          </div>
        ) : filteredSneakers.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-block p-8 border-2 border-black rounded-full mb-8">
              <Search className="h-20 w-20 text-black" />
            </div>
            <p className="text-display text-4xl font-bold uppercase tracking-wider mb-6">NO SNEAKERS FOUND</p>
            <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-8">TRY ADJUSTING YOUR FILTERS</p>
            <button onClick={() => { setSelectedBrands([]); setSelectedCondition('ALL'); setSearchTerm('') }} className="btn-primary">
              CLEAR ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="sneaker-grid">
            {filteredSneakers.map((sneaker, index) => {
              const isOwnListing = user && sneaker.seller?.username === user.username
              const isExpanded = expandedCard === sneaker.id
              const isBlurred = expandedCard && expandedCard !== sneaker.id
              
              return (
                <div
                  key={sneaker.id}
                  className={`relative transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isBlurred ? 'depth-blur' : ''} ${isExpanded ? 'col-span-1 lg:col-span-2 row-span-2' : ''}`}
                  style={{transitionDelay: `${1000 + index * 100}ms`}}
                  onMouseEnter={() => {
                    const cleanup = handleCardHover(sneaker.id)
                    sneaker._cleanup = cleanup
                  }}
                  onMouseLeave={() => {
                    if (sneaker._cleanup) sneaker._cleanup()
                    setExpandedCard(null)
                    setCurrentImageIndex(0)
                  }}
                >
                  <Link
                    to={`/sneaker/${sneaker.id}`}
                    className={`card group block h-full ${isExpanded ? 'depth-focus' : 'hover:scale-105'}`}
                  >
                    {isOwnListing && (
                      <div className="absolute top-4 right-4 z-10 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        YOUR LISTING
                      </div>
                    )}
                    <div className={`${isExpanded ? 'aspect-video' : 'aspect-square'} bg-gray-100 overflow-hidden relative transition-all duration-500`}>
                      <img
                        src={isExpanded && sneaker.imageUrls?.length > 1 
                          ? sneaker.imageUrls[currentImageIndex] 
                          : sneaker.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}
                        alt={sneaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      {isExpanded && sneaker.imageUrls?.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {sneaker.imageUrls.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">{sneaker.brand}</p>
                        <h3 className="font-bold text-xl uppercase tracking-wide break-words group-hover:text-gray-700 transition-colors">{sneaker.name}</h3>
                      </div>
                      {sneaker.averageRating > 0 && (
                        <div className="flex items-center space-x-1 bg-black text-white px-3 py-1 rounded-full flex-shrink-0 shadow-md">
                          <Star className="h-4 w-4 fill-white" />
                          <span className="text-sm font-bold">{sneaker.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 uppercase tracking-wider font-semibold">
                      SIZE {sneaker.size} • {sneaker.condition}
                    </p>
                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{sneaker.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 uppercase tracking-wider">
                          <span>SIZE: {sneaker.size}</span>
                          <span>•</span>
                          <span>{sneaker.condition}</span>
                          <span>•</span>
                          <span>STOCK: {sneaker.stock}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <p className="text-3xl font-bold">{formatPrice(sneaker.price)}</p>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        sneaker.status === 'AVAILABLE' 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {sneaker.status}
                      </span>
                    </div>
                  </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-black text-white py-20 border-t-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display text-6xl font-bold mb-6 uppercase">READY TO SELL?</h2>
          <p className="text-lg uppercase tracking-wider mb-10 font-semibold">
            LIST YOUR SNEAKERS AND REACH THOUSANDS OF BUYERS
          </p>
          <Link to="/create-sneaker" className="inline-block bg-white text-black px-12 py-5 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all border-2 border-white hover:scale-105 shadow-lg">
            START SELLING NOW
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home