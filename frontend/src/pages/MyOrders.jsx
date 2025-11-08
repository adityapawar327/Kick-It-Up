import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react'

const MyOrders = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [token, navigate])

  const fetchOrders = async () => {
    try {
      setError(null)
      const response = await axios.get('/api/orders/my-orders')
      console.log('Orders fetched:', response.data)
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setError(error.response?.data?.error || 'Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-7 w-7 text-yellow-500" />
      case 'SHIPPED':
        return <Truck className="h-7 w-7 text-blue-500" />
      case 'DELIVERED':
        return <CheckCircle className="h-7 w-7 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-7 w-7 text-red-500" />
      default:
        return <Package className="h-7 w-7 text-gray-500" />
    }
  }

  const activeOrders = orders.filter(order => 
    order.status === 'PENDING' || order.status === 'SHIPPED' || order.status === 'CONFIRMED'
  )
  const completedOrders = orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'CANCELLED'
  )

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-slideUp">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-600 mt-1">Track and manage your purchases</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass rounded-3xl p-6 mb-6 border-l-4 border-red-500 animate-slideDown">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="glass rounded-3xl p-2 mb-8 inline-flex space-x-2 animate-slideUp" style={{animationDelay: '0.1s'}}>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Active Orders</span>
              {activeOrders.length > 0 && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'active' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                }`}>
                  {activeOrders.length}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>Completed Orders</span>
              {completedOrders.length > 0 && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'completed' ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                }`}>
                  {completedOrders.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
              <Package className="h-20 w-20 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Start shopping to see your orders here</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-6">
              <Package className="h-20 w-20 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No {activeTab === 'active' ? 'active' : 'completed'} orders
            </h2>
            <p className="text-gray-600 text-lg">
              {activeTab === 'active' 
                ? 'Your active orders will appear here' 
                : 'Your completed orders will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="card p-8 animate-slideUp hover:shadow-2xl"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                  <div className="flex items-start space-x-5 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Order #{order.id}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 break-words">
                        {order.sneakerName}
                      </h3>
                      <p className="text-base text-gray-600">
                        Seller: <span className="font-semibold">{order.sellerUsername}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-left lg:text-right">
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                      ${order.totalPrice}
                    </p>
                    <span className={`inline-block px-5 py-2 rounded-full text-sm font-bold shadow-md ${
                      order.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                      order.status === 'SHIPPED' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
                      order.status === 'DELIVERED' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                      'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Shipping Address</p>
                    <p className="text-gray-900 font-medium break-words">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Phone Number</p>
                    <p className="text-gray-900 font-medium">{order.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Order Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
