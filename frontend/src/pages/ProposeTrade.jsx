import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Repeat2, ArrowRight } from 'lucide-react'

const ProposeTrade = () => {
  const { id } = useParams() // Sneaker ID they want
  const location = useLocation()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [requestedSneaker, setRequestedSneaker] = useState(null)
  const [myListings, setMyListings] = useState([])
  const [selectedSneaker, setSelectedSneaker] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchData()
  }, [id, token])

  const fetchData = async () => {
    try {
      // Fetch the sneaker they want to trade for
      const sneakerResponse = await axios.get(`/sneakers/${id}`)
      setRequestedSneaker(sneakerResponse.data)

      // Fetch user's own listings (only with stock > 0)
      const listingsResponse = await axios.get('/sneakers/my-sneakers')
      setMyListings(listingsResponse.data.filter(s => s.stock > 0))
    } catch (error) {
      console.error('Failed to fetch data:', error)
      showToast('Failed to load trade information', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedSneaker) {
      showToast('Please select a sneaker to offer', 'error')
      return
    }
    
    if (!selectedSneaker.stock || selectedSneaker.stock <= 0) {
      showToast('Selected sneaker is out of stock', 'error')
      return
    }
    
    if (!requestedSneaker || !requestedSneaker.stock || requestedSneaker.stock <= 0) {
      showToast('Requested sneaker is no longer available', 'error')
      return
    }

    // Validate message length
    const trimmedMessage = message.trim()
    if (trimmedMessage.length > 500) {
      showToast('Message is too long (max 500 characters)', 'error')
      return
    }

    setSubmitting(true)
    try {
      const tradeData = {
        requestedSneakerId: parseInt(id),
        offeredSneakerId: selectedSneaker.id,
        message: trimmedMessage
      }
      
      console.log('Sending trade request:', tradeData)
      const response = await axios.post('/trades', tradeData)
      
      console.log('Trade request response:', response.data)
      showToast('Trade request sent successfully!', 'success')
      navigate('/trade-requests')
    } catch (error) {
      console.error('Failed to send trade request:', error)
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to send trade request'
      showToast(errorMessage, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold">LOADING...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-8xl font-bold mb-4">PROPOSE TRADE</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            OFFER YOUR SNEAKER FOR A TRADE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* What They Want */}
          <div className="card p-8">
            <h2 className="text-display text-3xl font-bold mb-6 uppercase">THEY WANT TO TRADE</h2>
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-3xl border-2 border-black">
              <img
                src={requestedSneaker?.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                alt={requestedSneaker?.name}
                className="w-32 h-32 object-cover rounded-2xl border-2 border-black"
              />
              <div className="flex-1">
                <h3 className="text-display text-2xl font-bold mb-2">{requestedSneaker?.name}</h3>
                <p className="text-sm text-gray-600 mb-1">Brand: {requestedSneaker?.brand}</p>
                <p className="text-sm text-gray-600 mb-1">Size: {requestedSneaker?.size}</p>
                <p className="text-sm text-gray-600">Condition: {requestedSneaker?.condition}</p>
              </div>
            </div>
          </div>

          {/* Select Your Sneaker */}
          <div className="card p-8">
            <h2 className="text-display text-3xl font-bold mb-6 uppercase">SELECT YOUR SNEAKER TO OFFER</h2>
            
            {myListings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-gray-300">
                <p className="text-gray-600 mb-4">You don't have any available sneakers to trade</p>
                <button
                  type="button"
                  onClick={() => navigate('/create-sneaker')}
                  className="btn-primary"
                >
                  LIST A SNEAKER
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myListings.map((sneaker) => (
                  <div
                    key={sneaker.id}
                    onClick={() => setSelectedSneaker(sneaker)}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                      selectedSneaker?.id === sneaker.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={sneaker.imageUrls?.[0] || 'https://via.placeholder.com/80'}
                        alt={sneaker.name}
                        className="w-20 h-20 object-cover rounded-2xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold uppercase text-sm mb-1">{sneaker.name}</h4>
                        <p className={`text-xs mb-1 ${selectedSneaker?.id === sneaker.id ? 'text-gray-300' : 'text-gray-600'}`}>
                          Size: {sneaker.size} | {sneaker.condition}
                        </p>
                        <p className={`text-xs ${selectedSneaker?.id === sneaker.id ? 'text-gray-300' : 'text-gray-600'}`}>
                          {sneaker.brand} | Stock: {sneaker.stock}
                        </p>
                      </div>
                      {selectedSneaker?.id === sneaker.id && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div className="card p-8">
            <h2 className="text-display text-3xl font-bold mb-6 uppercase">ADD A MESSAGE (OPTIONAL)</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
              rows="4"
              placeholder="EXPLAIN WHY THIS IS A GREAT TRADE..."
            />
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={!selectedSneaker || submitting}
              className="flex-1 btn-primary flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Repeat2 className="h-6 w-6" />
              <span>{submitting ? 'SENDING...' : 'SEND TRADE REQUEST'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary px-8"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProposeTrade
