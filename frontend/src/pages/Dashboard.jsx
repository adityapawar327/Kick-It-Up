import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { TrendingUp, Package, DollarSign, ShoppingBag } from 'lucide-react'

const Dashboard = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchDashboard()
  }, [token])

  const fetchDashboard = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        axios.get('/dashboard/seller/stats'),
        axios.get('/dashboard/seller/orders')
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
      toast.error('FAILED TO LOAD DASHBOARD')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`/orders/${orderId}/status?status=${status}`)
      fetchDashboard()
      toast.success('ORDER STATUS UPDATED!')
    } catch (error) {
      toast.error('FAILED TO UPDATE ORDER STATUS')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold">LOADING DASHBOARD...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-display text-8xl font-bold mb-4">SELLER DASHBOARD</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            MANAGE YOUR LISTINGS AND ORDERS
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-8 animate-slideUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">TOTAL LISTINGS</p>
                <p className="text-5xl font-bold">{stats?.totalListings || 0}</p>
              </div>
              <Package className="h-16 w-16 text-black" />
            </div>
          </div>

          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">ACTIVE SNEAKERS</p>
                <p className="text-5xl font-bold">{stats?.activeSneakers || 0}</p>
              </div>
              <TrendingUp className="h-16 w-16 text-black" />
            </div>
          </div>

          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">TOTAL ORDERS</p>
                <p className="text-5xl font-bold">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingBag className="h-16 w-16 text-black" />
            </div>
          </div>

          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">TOTAL REVENUE</p>
                <p className="text-5xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-16 w-16 text-black" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card p-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
          <h2 className="text-display text-4xl font-bold mb-8">RECENT ORDERS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">ORDER ID</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">SNEAKER</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">BUYER</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">PRICE</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">STATUS</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold">#{order.id}</td>
                    <td className="py-4 px-4 font-semibold">{order.sneakerName}</td>
                    <td className="py-4 px-4">{order.buyerUsername}</td>
                    <td className="py-4 px-4 font-bold text-xl">${order.totalPrice}</td>
                    <td className="py-4 px-4">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'PENDING' ? 'bg-white border-2 border-black text-black' :
                        order.status === 'SHIPPED' ? 'bg-black text-white' :
                        order.status === 'DELIVERED' ? 'bg-black text-white' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                          className="text-black hover:underline text-xs font-bold uppercase tracking-wider"
                        >
                          MARK AS SHIPPED
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          className="text-black hover:underline text-xs font-bold uppercase tracking-wider"
                        >
                          MARK AS DELIVERED
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">NO ORDERS YET</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
