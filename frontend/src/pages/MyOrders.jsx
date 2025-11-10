import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from 'lucide-react'

const MyOrders = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [token, navigate])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/my-orders')
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      showToast('Failed to load orders', 'error')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-7 w-7 text-black" />
      case 'SHIPPED':
        return <Truck className="h-7 w-7 text-black" />
      case 'DELIVERED':
        return <CheckCircle className="h-7 w-7 text-black" />
      case 'CANCELLED':
        return <XCircle className="h-7 w-7 text-black" />
      default:
        return <Package className="h-7 w-7 text-black" />
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold">LOADING ORDERS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slideUp">
          <h1 className="text-display text-8xl font-bold mb-4">MY ORDERS</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            TRACK AND MANAGE YOUR PURCHASES
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12 animate-slideUp" style={{animationDelay: '0.1s'}}>
          <div className="inline-flex border-2 border-black rounded-full p-2 space-x-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === 'active'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              ACTIVE ORDERS
              {activeOrders.length > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === 'active' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {activeOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === 'completed'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              COMPLETED
              {completedOrders.length > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === 'completed' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {completedOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-8 border-2 border-black rounded-full mb-8">
              <Package className="h-20 w-20 text-black" />
            </div>
            <h2 className="text-display text-4xl font-bold mb-6">NO ORDERS YET</h2>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600 mb-8">
              START SHOPPING TO SEE YOUR ORDERS HERE
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              START SHOPPING
            </button>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-8 border-2 border-black rounded-full mb-8">
              <Package className="h-20 w-20 text-black" />
            </div>
            <h2 className="text-display text-4xl font-bold mb-6">
              NO {activeTab === 'active' ? 'ACTIVE' : 'COMPLETED'} ORDERS
            </h2>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
              {activeTab === 'active' 
                ? 'YOUR ACTIVE ORDERS WILL APPEAR HERE' 
                : 'YOUR COMPLETED ORDERS WILL APPEAR HERE'}
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
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">ORDER #{order.id}</p>
                      <h3 className="text-3xl font-bold mb-2 break-words uppercase">
                        {order.sneakerName}
                      </h3>
                      <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
                        SELLER: {order.sellerUsername}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-left lg:text-right">
                    <p className="text-5xl font-bold mb-3">
                      ${order.totalPrice}
                    </p>
                    <span className={`inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'PENDING' ? 'bg-white border-2 border-black text-black' :
                      order.status === 'SHIPPED' ? 'bg-black text-white' :
                      order.status === 'DELIVERED' ? 'bg-black text-white' :
                      'bg-gray-200 text-gray-800 border-2 border-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">SHIPPING ADDRESS</p>
                    <p className="font-semibold break-words">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">PHONE NUMBER</p>
                    <p className="font-semibold">{order.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">ORDER DATE</p>
                    <p className="font-semibold uppercase">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
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
