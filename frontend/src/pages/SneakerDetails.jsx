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
      // Check if current user has already reviewed
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
      console.log('Adding to favorites, sneaker ID:', sneakerId)
      console.log('Token:', token)
      console.log('Authorization header:', axios.defaults.headers.common['Authorization'])
      const response = await axios.post(`/api/favorites/${sneakerId}`)
      console.log('Favorite added successfully:', response.data)
      setIsFavorite(true)
      toast.success('Added to favorites!')
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      console.error('Error response:', error.response)
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to add to favorites'
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
      toast.success('Order placed successfully!')
      setShowOrderForm(false)
      setTimeout(() => navigate('/my-orders'), 1000)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to place order'
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
      console.log('Submitting review:', payload)
      console.log('Token:', token)
      const response = await axios.post('/api/reviews', payload)
      console.log('Review submitted successfully:', response.data)
      toast.success('Review submitted successfully!')
      setReviewData({ rating: 5, comment: '' })
      setUserHasReviewed(true)
      fetchReviews()
      fetchSneakerDetails() // Refresh to update average rating
    } catch (error) {
      console.error('Failed to submit review:', error)
      console.error('Error response:', error.response)
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit review'
      toast.error(errorMsg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading sneaker details...</p>
        </div>
      </div>
    )
  }

  if (!sneaker) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sneaker not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const isOwnListing = user && sneaker.seller?.username === user.username

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden">
                <img
                  src={sneaker.imageUrls?.[0] || 'https://via.placeholder.com/600'}
                  alt={sneaker.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              {sneaker.imageUrls?.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {sneaker.imageUrls.slice(1).map((url, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform">
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
                  <p className="text-sm font-semibold text-blue-600 mb-2">{sneaker.brand}</p>
                  <h1 className="text-5xl font-bold text-gray-900 mb-4 break-words">{sneaker.name}</h1>
                  {sneaker.averageRating > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${i < sneaker.averageRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 font-semibold">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleAddToFavorites} 
                  disabled={isFavorite} 
                  className="flex-shrink-0 p-4 rounded-full glass hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                >
                  <Heart className={`h-7 w-7 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="mb-10">
                <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                  ${sneaker.price}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-3xl">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Size</p>
                    <p className="font-bold text-3xl text-gray-900">{sneaker.size}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Condition</p>
                    <p className="font-bold text-3xl text-gray-900">{sneaker.condition}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Color</p>
                    <p className="font-bold text-3xl text-gray-900 break-words">{sneaker.color}</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Stock</p>
                    <p className="font-bold text-3xl text-gray-900">{sneaker.stock}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg break-words">{sneaker.description}</p>
              </div>

              {isOwnListing ? (
                <div className="glass rounded-3xl p-6 text-center border-2 border-blue-200">
                  <p className="text-blue-800 font-bold text-lg">This is your listing</p>
                  <p className="text-blue-600 mt-2">You cannot purchase your own sneakers</p>
                </div>
              ) : sneaker.status === 'AVAILABLE' ? (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Buy Now</span>
                </button>
              ) : (
                <div className="glass rounded-3xl p-6 text-center border-2 border-red-200">
                  <p className="text-red-800 font-bold text-lg">This sneaker is no longer available</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="glass rounded-3xl p-8 max-w-md w-full animate-scaleIn">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Complete Your Order
                  </h3>
                  <button onClick={() => setShowOrderForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleOrder} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Shipping Address
                    </label>
                    <textarea
                      required
                      value={orderData.shippingAddress}
                      onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="Enter your full shipping address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderData.phoneNumber}
                      onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                      className="input-field"
                      placeholder="Your contact number"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="flex-1 btn-primary">Place Order</button>
                    <button type="button" onClick={() => setShowOrderForm(false)} className="flex-1 btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="border-t border-gray-200/50 p-8 lg:p-12">
            <div className="flex items-center space-x-3 mb-8">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
            </div>
            
            {token && !isOwnListing && !userHasReviewed && (
              <div className="glass rounded-3xl p-8 mb-8 animate-slideUp">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Write a Review</h3>
                <form onSubmit={handleReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star className={`h-10 w-10 ${star <= reviewData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Comment</label>
                    <textarea
                      required
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      className="input-field"
                      rows="4"
                      placeholder="Share your experience with this sneaker..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">Submit Review</button>
                </form>
              </div>
            )}

            {token && !isOwnListing && userHasReviewed && (
              <div className="glass rounded-3xl p-6 mb-8 text-center border-2 border-green-200">
                <p className="text-green-800 font-bold text-lg">✓ You have already reviewed this sneaker</p>
                <p className="text-green-600 mt-2">Thank you for your feedback!</p>
              </div>
            )}

            {!token && (
              <div className="glass rounded-3xl p-6 mb-8 text-center">
                <p className="text-gray-700 font-semibold mb-4">Please login to write a review</p>
                <button onClick={() => navigate('/login')} className="btn-primary">
                  Login
                </button>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-6">
                  <MessageSquare className="h-20 w-20 text-gray-300" />
                </div>
                <p className="text-gray-500 text-xl font-semibold">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={review.id} className="glass rounded-3xl p-8 animate-slideUp hover:shadow-2xl transition-shadow" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-900">{review.username}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-6 w-6 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="pl-0 sm:pl-18">
                      <p className="text-gray-700 leading-relaxed text-lg break-words whitespace-pre-wrap">{review.comment}</p>
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
