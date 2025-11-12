import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCurrency } from '../context/CurrencyContext'
import { useCart } from '../context/CartContext'
import { Heart, ShoppingCart, Star, MapPin, Phone, X, MessageSquare, Repeat2, MessageCircle } from 'lucide-react'

const SneakerDetails = () => {
  const { id } = useParams()
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()
  const [sneaker, setSneaker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderData, setOrderData] = useState({ shippingAddress: '', phoneNumber: '' })
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [aiInfo, setAiInfo] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [prosAndCons, setProsAndCons] = useState(null)
  const [loadingProsAndCons, setLoadingProsAndCons] = useState(false)

  useEffect(() => {
    // Scroll to top when component mounts or ID changes
    window.scrollTo(0, 0)
    
    fetchSneakerDetails()
    fetchReviews()
    if (token) {
      checkIfFavorite()
    }
  }, [id, token])

  const fetchSneakerDetails = async () => {
    try {
      const response = await axios.get(`/sneakers/${id}`)
      console.log('Sneaker data:', response.data)
      console.log('Sneaker status:', response.data.status)
      setSneaker(response.data)
    } catch (error) {
      console.error('Failed to fetch sneaker:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews/sneaker/${id}`)
      setReviews(response.data)
      if (user) {
        const hasReviewed = response.data.some(review => review.username === user.username)
        setUserHasReviewed(hasReviewed)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const checkIfFavorite = async () => {
    if (!token) return
    try {
      const response = await axios.get(`/favorites/${id}/check`)
      setIsFavorite(response.data.isFavorite)
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const handleAddToFavorites = async () => {
    if (!token) {
      console.log('No token found, redirecting to login')
      showToast('Please login to add favorites', 'error')
      navigate('/login')
      return
    }
    try {
      const sneakerId = parseInt(id)
      console.log('Adding to favorites:', { sneakerId, token: token ? 'exists' : 'missing' })
      const response = await axios.post(`/favorites/${sneakerId}`)
      console.log('Favorite added successfully:', response.data)
      setIsFavorite(true)
      showToast('Added to favorites!', 'success')
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      let errorMsg = 'Failed to add to favorites'
      if (error.response?.status === 401) {
        errorMsg = 'Please login again - your session may have expired'
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      }
      
      showToast(errorMsg, 'error')
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      await axios.post('/orders', { sneakerId: id, ...orderData })
      showToast('Order placed successfully!', 'success')
      setShowOrderForm(false)
      setTimeout(() => navigate('/my-orders'), 1000)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to place order'
      showToast(errorMsg, 'error')
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const payload = { 
        sneakerId: parseInt(id), 
        rating: reviewData.rating, 
        comment: reviewData.comment 
      }
      await axios.post('/reviews', payload)
      showToast('Review submitted successfully!', 'success')
      setReviewData({ rating: 5, comment: '' })
      setUserHasReviewed(true)
      fetchReviews()
      fetchSneakerDetails()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to submit review'
      showToast(errorMsg, 'error')
    }
  }

  const handleAIInfo = async () => {
    setLoadingAI(true)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Please configure your Gemini API key in the .env file. Get one from: https://makersuite.google.com/app/apikey')
      }

      const prompt = `Provide detailed information about the sneaker: "${sneaker.name}" by ${sneaker.brand}. 
      
Description: ${sneaker.description}

Please provide:
1. Historical background and release information
2. Key features and technology
3. Cultural significance and popularity
4. Style tips and outfit recommendations
5. Value and collectibility insights

IMPORTANT FORMATTING RULES:
- Write in plain text paragraphs
- Do NOT use markdown symbols like **, *, ##, ###, or any other formatting symbols
- Do NOT use bullet points or numbered lists
- Write naturally in flowing paragraphs
- Keep the response informative, engaging, and under 300 words
- Use clear, descriptive language without special formatting`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error?.message || 'API request failed')
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!aiText) {
        throw new Error('No content in response')
      }
      
      setAiInfo(aiText)
      showToast('AI insights generated!', 'success')
    } catch (error) {
      console.error('AI Info error:', error)
      const errorMessage = error.message || 'Failed to generate AI insights'
      setAiInfo(`⚠️ ${errorMessage}\n\nTo enable AI features:\n1. Get a free API key from https://makersuite.google.com/app/apikey\n2. Add it to your .env file as VITE_GEMINI_API_KEY\n3. Restart the development server`)
      showToast(errorMessage, 'error')
    } finally {
      setLoadingAI(false)
    }
  }

  const generateProsAndCons = async () => {
    if (reviews.length === 0) {
      showToast('No reviews available to analyze', 'error')
      return
    }

    setLoadingProsAndCons(true)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Please configure your Gemini API key')
      }

      // Combine all review comments
      const allReviews = reviews.map(r => `${r.rating}/5 stars: ${r.comment}`).join('\n')

      const prompt = `Analyze these customer reviews for "${sneaker.name}" and extract the key pros and cons:

Reviews:
${allReviews}

Extract the top 3-5 PROS (positive aspects) and top 3-5 CONS (negative aspects or concerns) mentioned by customers.

Format your response EXACTLY as follows with NO additional text or explanations:

PROS:
- [specific pro from reviews]
- [specific pro from reviews]
- [specific pro from reviews]

CONS:
- [specific con from reviews]
- [specific con from reviews]
- [specific con from reviews]

Rules:
- Only include points actually mentioned in the reviews
- Be concise and specific
- Do NOT add any introductory text, explanations, or conclusions
- Start directly with "PROS:" and "CONS:"
- If there are no cons mentioned, write "- No significant concerns mentioned"`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate pros and cons')
      }

      const data = await response.json()
      const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!analysis) {
        throw new Error('No analysis generated')
      }
      
      setProsAndCons(analysis)
      showToast('Pros & Cons generated!', 'success')
    } catch (error) {
      console.error('Pros & Cons generation error:', error)
      setProsAndCons('⚠️ Unable to generate pros and cons analysis.\n\nTo enable this feature:\n1. Get a free API key from https://makersuite.google.com/app/apikey\n2. Add it to your .env file as VITE_GEMINI_API_KEY\n3. Restart the development server')
      showToast(error.message || 'Failed to generate analysis', 'error')
    } finally {
      setLoadingProsAndCons(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold">LOADING SNEAKER DETAILS...</p>
        </div>
      </div>
    )
  }

  if (!sneaker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-display text-4xl font-bold mb-6">SNEAKER NOT FOUND</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            BACK TO HOME
          </button>
        </div>
      </div>
    )
  }

  const isOwnListing = user && sneaker.seller?.username === user.username

  return (
    <div className="min-h-screen bg-white py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="card overflow-hidden animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border-2 border-black">
                <img
                  src={sneaker.imageUrls?.[0] || 'https://via.placeholder.com/600'}
                  alt={sneaker.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              {sneaker.imageUrls?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {sneaker.imageUrls.slice(1).map((url, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-black cursor-pointer hover:scale-105 transition-transform">
                      <img src={url} alt={`${sneaker.name} ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Header with Brand and Favorite */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">{sneaker.brand}</p>
                  <h1 className="text-display text-4xl lg:text-5xl font-bold break-words uppercase leading-tight">{sneaker.name}</h1>
                </div>
                <button 
                  onClick={handleAddToFavorites} 
                  disabled={isFavorite} 
                  className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  <Heart className={`h-7 w-7 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-5xl lg:text-6xl font-bold">
                  {formatPrice(sneaker.price)}
                </p>
              </div>

              {/* Product Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white border-2 border-black p-5 rounded-3xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">SIZE</p>
                  <p className="font-bold text-3xl">{sneaker.size}</p>
                </div>
                <div className="bg-white border-2 border-black p-5 rounded-3xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">CONDITION</p>
                  <p className="font-bold text-2xl uppercase">{sneaker.condition}</p>
                </div>
                <div className="bg-white border-2 border-black p-5 rounded-3xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">COLOR</p>
                  <p className="font-bold text-lg uppercase break-words">{sneaker.color}</p>
                </div>
                <div className="bg-white border-2 border-black p-5 rounded-3xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">STOCK</p>
                  <p className="font-bold text-3xl">{sneaker.stock}</p>
                </div>
              </div>

              {/* Seller Information */}
              <div className="mb-8 bg-white border-2 border-black rounded-3xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">SELLER INFORMATION</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {sneaker.seller?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg uppercase">{sneaker.seller?.username}</p>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">VERIFIED SELLER</p>
                  </div>
                </div>
              </div>

              {/* Reviews Summary */}
              {sneaker.averageRating > 0 && (
                <div className="mb-8 bg-white border-2 border-black rounded-3xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">CUSTOMER RATING</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < sneaker.averageRating ? 'text-black fill-black' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {sneaker.averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'REVIEW' : 'REVIEWS'})
                    </span>
                  </div>
                </div>
              )}

              {isOwnListing ? (
                <div className="bg-white border-2 border-black rounded-3xl p-6 text-center">
                  <p className="font-bold text-sm uppercase tracking-wider">THIS IS YOUR LISTING</p>
                  <p className="text-gray-600 mt-2 text-sm uppercase tracking-wider">YOU CANNOT PURCHASE YOUR OWN SNEAKERS</p>
                </div>
              ) : (sneaker.status === 'AVAILABLE' || !sneaker.status) ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/propose-trade/${id}`)}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Repeat2 className="h-5 w-5" />
                      <span>TRADE</span>
                    </button>
                    <button
                      onClick={() => navigate(`/messages?userId=${sneaker.seller.id}`)}
                      className="btn-secondary flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>CHAT</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(sneaker)
                      showToast('Added to cart!', 'success')
                    }}
                    className="w-full btn-secondary flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>ADD TO CART</span>
                  </button>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="w-full btn-primary flex items-center justify-center space-x-3"
                  >
                    <span>BUY NOW</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-gray-800 rounded-3xl p-6 text-center">
                  <p className="font-bold text-sm uppercase tracking-wider">THIS SNEAKER IS NO LONGER AVAILABLE</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-white border-2 border-black rounded-3xl p-8 max-w-md w-full animate-scaleIn">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-display text-3xl font-bold uppercase">
                    COMPLETE ORDER
                  </h3>
                  <button onClick={() => setShowOrderForm(false)} className="w-10 h-10 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleOrder} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      SHIPPING ADDRESS
                    </label>
                    <textarea
                      required
                      value={orderData.shippingAddress}
                      onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                      className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                      rows="3"
                      placeholder="ENTER YOUR FULL SHIPPING ADDRESS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      <Phone className="inline h-4 w-4 mr-1" />
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderData.phoneNumber}
                      onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                      className="input-field"
                      placeholder="YOUR CONTACT NUMBER"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="flex-1 btn-primary">PLACE ORDER</button>
                    <button type="button" onClick={() => setShowOrderForm(false)} className="flex-1 btn-secondary">CANCEL</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="border-t-2 border-black p-6 lg:p-12">
            <h3 className="text-display text-3xl font-bold uppercase mb-6">DESCRIPTION</h3>
            <p className="text-sm text-gray-700 leading-relaxed break-words max-w-4xl">{sneaker.description}</p>
          </div>

          {/* AI-Powered Sections */}
          <div className="border-t-2 border-black p-6 lg:p-12">
            <div className="mb-8">
              <h2 className="text-display text-4xl font-bold uppercase">AI-POWERED INSIGHTS</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Product Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-display text-xl font-bold uppercase">PRODUCT INSIGHTS</h3>
                  <button
                    onClick={handleAIInfo}
                    disabled={loadingAI}
                    className="px-4 py-2 bg-white border-2 border-black rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all disabled:opacity-50"
                  >
                    {loadingAI ? 'GENERATING...' : 'GENERATE'}
                  </button>
                </div>
                
                {aiInfo ? (
                  <div className="bg-white border-2 border-black rounded-3xl p-6 animate-slideUp">
                    <div className="text-gray-800 leading-relaxed space-y-3">
                      {aiInfo.split('\n\n').map((paragraph, idx) => {
                        // Remove all markdown symbols
                        let cleanText = paragraph
                          .replace(/\*\*/g, '')
                          .replace(/\*/g, '')
                          .replace(/##/g, '')
                          .replace(/###/g, '')
                          .replace(/`/g, '')
                          .trim()
                        
                        return (
                          <p key={idx} className="text-sm leading-relaxed">
                            {cleanText}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-3xl p-8 text-center">
                    <p className="text-sm text-gray-600">Click "GENERATE" to get AI-powered product insights</p>
                  </div>
                )}
              </div>

              {/* Pros & Cons from Reviews */}
              {reviews.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-display text-xl font-bold uppercase">CUSTOMER INSIGHTS</h3>
                    <button
                      onClick={generateProsAndCons}
                      disabled={loadingProsAndCons}
                      className="px-4 py-2 bg-white border-2 border-black rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all disabled:opacity-50"
                    >
                      {loadingProsAndCons ? 'ANALYZING...' : 'GENERATE'}
                    </button>
                  </div>
                  
                  {prosAndCons ? (
                    <div className="bg-white border-2 border-black rounded-3xl p-6 animate-slideUp">
                      <div className="text-gray-800 leading-relaxed">
                        {prosAndCons.split('\n').map((line, idx) => {
                          // Remove markdown symbols
                          let cleanLine = line.trim()
                            .replace(/\*\*/g, '')
                            .replace(/\*/g, '')
                            .replace(/##/g, '')
                            .replace(/###/g, '')
                            .replace(/`/g, '')
                          
                          if (cleanLine.startsWith('PROS:')) {
                            return <h4 key={idx} className="text-sm font-bold uppercase tracking-wider text-green-600 mt-4 mb-2">✓ PROS:</h4>
                          } else if (cleanLine.startsWith('CONS:')) {
                            return <h4 key={idx} className="text-sm font-bold uppercase tracking-wider text-red-600 mt-4 mb-2">✗ CONS:</h4>
                          } else if (cleanLine.startsWith('-')) {
                            return <p key={idx} className="text-sm ml-4 mb-1">{cleanLine}</p>
                          } else if (cleanLine.startsWith('⚠️')) {
                            return <p key={idx} className="text-sm text-gray-600 whitespace-pre-line">{cleanLine}</p>
                          } else if (cleanLine) {
                            return <p key={idx} className="text-sm mb-2">{cleanLine}</p>
                          }
                          return null
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-gray-300 rounded-3xl p-8 text-center">
                      <p className="text-sm text-gray-600">Click "GENERATE" to analyze customer reviews with AI</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-display text-xl font-bold uppercase mb-4">CUSTOMER INSIGHTS</h3>
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-3xl p-8 text-center">
                    <p className="text-sm text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t-2 border-black p-6 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <MessageSquare className="h-8 w-8 text-black" />
              <h2 className="text-display text-4xl font-bold uppercase">CUSTOMER REVIEWS</h2>
            </div>
            
            {token && !isOwnListing && !userHasReviewed && (
              <div className="bg-white border-2 border-black rounded-3xl p-8 mb-8 animate-slideUp">
                <h3 className="text-display text-2xl font-bold mb-6 uppercase">WRITE A REVIEW</h3>
                <form onSubmit={handleReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">RATING</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star className={`h-10 w-10 ${star <= reviewData.rating ? 'text-black fill-black' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">COMMENT</label>
                    <textarea
                      required
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                      rows="4"
                      placeholder="SHARE YOUR EXPERIENCE WITH THIS SNEAKER..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">SUBMIT REVIEW</button>
                </form>
              </div>
            )}

            {token && !isOwnListing && userHasReviewed && (
              <div className="bg-white border-2 border-black rounded-3xl p-6 mb-8 text-center">
                <p className="font-bold text-sm uppercase tracking-wider">✓ YOU HAVE ALREADY REVIEWED THIS SNEAKER</p>
                <p className="text-gray-600 mt-2 text-sm uppercase tracking-wider">THANK YOU FOR YOUR FEEDBACK!</p>
              </div>
            )}

            {!token && (
              <div className="bg-white border-2 border-black rounded-3xl p-6 mb-8 text-center">
                <p className="font-semibold mb-4 text-sm uppercase tracking-wider">PLEASE LOGIN TO WRITE A REVIEW</p>
                <button onClick={() => navigate('/login')} className="btn-primary">
                  LOGIN
                </button>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-block p-8 border-2 border-black rounded-full mb-6">
                  <MessageSquare className="h-20 w-20 text-black" />
                </div>
                <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">NO REVIEWS YET. BE THE FIRST TO REVIEW!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={review.id} className="bg-white border-2 border-black rounded-3xl p-8 animate-slideUp hover:shadow-2xl transition-shadow" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-xl uppercase">{review.username}</p>
                          <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-6 w-6 ${i < review.rating ? 'text-black fill-black' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="pl-0 sm:pl-18">
                      <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SneakerDetails
