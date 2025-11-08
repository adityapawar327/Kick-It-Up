import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Heart, ShoppingCart, Star, MapPin, Phone, X, MessageSquare } from 'lucide-react'

const SneakerDetails = () => {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [sneaker, setSneaker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderData, setOrderData] = useState({ shippingAddress: '', phoneNumber: '' })
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [userHasReviewed, setUserHasReviewed] = useState(false)

  useEffect(() => {
    fetchSneakerDetails()
    fetchReviews()
  }, [id])

  const fetchSneakerDetails = async () => {
    try {
      const response = await axios.get(`/api/sneakers/${id}`)
      setSneaker(response.data)
    } catch (error) {
      console.error('Failed to fetch sneaker:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/sneaker/${id}`)
      setReviews(response.data)
      if (user) {
        const hasReviewed = response.data.some(review => review.username === user.username)
        setUserHasReviewed(hasReviewed)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const handleAddToFavorites = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const sneakerId = parseInt(id)
      await axios.post(`/api/favorites/${sneakerId}`)
      setIsFavorite(true)
      toast.success('ADDED TO FAVORITES!')
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'FAILED TO ADD TO FAVORITES'
      toast.error(errorMsg)
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }
    try {
      await axios.post('/api/orders', { sneakerId: id, ...orderData })
      toast.success('ORDER PLACED SUCCESSFULLY!')
      setShowOrderForm(false)
      setTimeout(() => navigate('/my-orders'), 1000)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'FAILED TO PLACE ORDER'
      toast.error(errorMsg)
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
      await axios.post('/api/reviews', payload)
      toast.success('REVIEW SUBMITTED SUCCESSFULLY!')
      setReviewData({ rating: 5, comment: '' })
      setUserHasReviewed(true)
      fetchReviews()
      fetchSneakerDetails()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'FAILED TO SUBMIT REVIEW'
      toast.error(errorMsg)
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
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
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
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">{sneaker.brand}</p>
                  <h1 className="text-display text-5xl font-bold mb-4 break-words uppercase">{sneaker.name}</h1>
                  {sneaker.averageRating > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${i < sneaker.averageRating ? 'text-black fill-black' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm uppercase tracking-wider font-semibold text-gray-600">
                        ({reviews.length} {reviews.length === 1 ? 'REVIEW' : 'REVIEWS'})
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAddToFavorites} 
                  disabled={isFavorite} 
                  className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  <Heart className={`h-7 w-7 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="mb-10">
                <p className="text-6xl font-bold mb-8">
                  ${sneaker.price}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-black p-6 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">SIZE</p>
                    <p className="font-bold text-3xl">{sneaker.size}</p>
                  </div>
                  <div className="bg-white border-2 border-black p-6 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">CONDITION</p>
                    <p className="font-bold text-3xl uppercase">{sneaker.condition}</p>
                  </div>
                  <div className="bg-white border-2 border-black p-6 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">COLOR</p>
                    <p className="font-bold text-xl uppercase break-words">{sneaker.color}</p>
                  </div>
                  <div className="bg-white border-2 border-black p-6 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">STOCK</p>
                    <p className="font-bold text-3xl">{sneaker.stock}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-display text-2xl font-bold mb-4 uppercase">DESCRIPTION</h3>
                <p className="text-gray-700 leading-relaxed break-words">{sneaker.description}</p>
              </div>

              {isOwnListing ? (
                <div className="bg-white border-2 border-black rounded-3xl p-6 text-center">
                  <p className="font-bold text-sm uppercase tracking-wider">THIS IS YOUR LISTING</p>
                  <p className="text-gray-600 mt-2 text-sm uppercase tracking-wider">YOU CANNOT PURCHASE YOUR OWN SNEAKERS</p>
                </div>
              ) : sneaker.status === 'AVAILABLE' ? (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-3"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>BUY NOW</span>
                </button>
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

          {/* Reviews Section */}
          <div className="border-t-2 border-black p-8 lg:p-12">
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
