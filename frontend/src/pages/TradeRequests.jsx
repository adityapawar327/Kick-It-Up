import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Repeat2, Check, X, MessageCircle, Clock } from 'lucide-react'

const TradeRequests = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('received') // received, sent
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchTrades()
  }, [activeTab, token])

  const fetchTrades = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'received' ? '/trades/received' : '/trades/sent'
      const response = await axios.get(endpoint)
      setTrades(response.data)
    } catch (error) {
      console.error('Failed to fetch trades:', error)
      showToast('Failed to load trade requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTradeAction = async (tradeId, action) => {
    try {
      await axios.patch(`/trades/${tradeId}/${action}`)
      showToast(`Trade ${action}ed successfully!`, 'success')
      fetchTrades()
    } catch (error) {
      console.error(`Failed to ${action} trade:`, error)
      showToast(`Failed to ${action} trade`, 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-300'
      case 'DECLINED': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-8xl font-bold mb-4">TRADE REQUESTS</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            MANAGE YOUR SNEAKER TRADES
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-4 rounded-full border-2 border-black font-bold uppercase text-sm tracking-wider transition-all ${
              activeTab === 'received' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            RECEIVED REQUESTS
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-4 rounded-full border-2 border-black font-bold uppercase text-sm tracking-wider transition-all ${
              activeTab === 'sent' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            SENT REQUESTS
          </button>
        </div>

        {/* Trade List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
            <p className="text-sm uppercase tracking-wider font-semibold">LOADING TRADES...</p>
          </div>
        ) : trades.length === 0 ? (
          <div className="card p-12 text-center">
            <Repeat2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-display text-2xl font-bold mb-2">NO TRADE REQUESTS</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'received' 
                ? 'You haven\'t received any trade requests yet' 
                : 'You haven\'t sent any trade requests yet'}
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              BROWSE SNEAKERS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {trades.map((trade) => (
              <div key={trade.id} className="card p-6 animate-slideUp hover:shadow-2xl transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Offered Sneaker */}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                      {activeTab === 'received' ? 'THEY OFFER' : 'YOU OFFER'}
                    </p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={trade.offeredSneaker?.imageUrls?.[0] || 'https://via.placeholder.com/100'}
                        alt={trade.offeredSneaker?.name}
                        className="w-20 h-20 object-cover rounded-2xl border-2 border-black"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg uppercase">{trade.offeredSneaker?.name}</h3>
                        <p className="text-sm text-gray-600">Size: {trade.offeredSneaker?.size}</p>
                        <p className="text-sm text-gray-600">Condition: {trade.offeredSneaker?.condition}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trade Icon */}
                  <div className="flex items-center justify-center">
                    <Repeat2 className="h-8 w-8 text-black" />
                  </div>

                  {/* Requested Sneaker */}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                      {activeTab === 'received' ? 'FOR YOUR' : 'FOR THEIR'}
                    </p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={trade.requestedSneaker?.imageUrls?.[0] || 'https://via.placeholder.com/100'}
                        alt={trade.requestedSneaker?.name}
                        className="w-20 h-20 object-cover rounded-2xl border-2 border-black"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg uppercase">{trade.requestedSneaker?.name}</h3>
                        <p className="text-sm text-gray-600">Size: {trade.requestedSneaker?.size}</p>
                        <p className="text-sm text-gray-600">Condition: {trade.requestedSneaker?.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Info */}
                <div className="mt-6 pt-6 border-t-2 border-black flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full border-2 text-xs font-bold uppercase tracking-wider ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                    <p className="text-sm text-gray-600">
                      {activeTab === 'received' ? `From: ${trade.requester?.username}` : `To: ${trade.owner?.username}`}
                    </p>
                  </div>

                  {/* Actions */}
                  {activeTab === 'received' && trade.status === 'PENDING' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleTradeAction(trade.id, 'accept')}
                        className="px-4 py-2 bg-green-600 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-green-700 transition-all flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>ACCEPT</span>
                      </button>
                      <button
                        onClick={() => handleTradeAction(trade.id, 'decline')}
                        className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>DECLINE</span>
                      </button>
                    </div>
                  )}

                  {trade.status === 'PENDING' && activeTab === 'sent' && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-bold uppercase">AWAITING RESPONSE</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                {trade.message && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">MESSAGE</p>
                    <p className="text-sm text-gray-700">{trade.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TradeRequests
