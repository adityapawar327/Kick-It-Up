import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, Package, DollarSign, ShoppingBag } from 'lucide-react'

const Dashboard = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
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
        axios.get('/api/dashboard/seller/stats'),
        axios.get('/api/dashboard/seller/orders')
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status?status=${status}`)
      fetchDashboard()
      alert('Order status updated!')
    } catch (error) {
      alert('Failed to update order status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Seller Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalListings || 0}</p>
              </div>
              <Package className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Sneakers</p>
                <p className="text-3xl font-bold text-green-600">{stats?.activeSneakers || 0}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Sneaker</th>
                  <th className="text-left py-3 px-4">Buyer</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">#{order.id}</td>
                    <td className="py-4 px-4">{order.sneakerName}</td>
                    <td className="py-4 px-4">{order.buyerUsername}</td>
                    <td className="py-4 px-4 font-semibold">${order.totalPrice}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          className="text-green-600 hover:underline text-sm font-medium"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center py-8 text-gray-500">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
