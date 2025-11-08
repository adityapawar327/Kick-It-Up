import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Edit, Trash2, Package, DollarSign, Eye, X, Plus, ShoppingBag } from 'lucide-react'

const MyListings = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [sneakers, setSneakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSneaker, setEditingSneaker] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchMySneakers()
  }, [token, navigate])

  const fetchMySneakers = async () => {
    try {
      const response = await axios.get('/api/sneakers/my-sneakers')
      setSneakers(response.data)
    } catch (error) {
      console.error('Failed to fetch sneakers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sneaker) => {
    setEditingSneaker(sneaker)
    setFormData({
      name: sneaker.name || '',
      brand: sneaker.brand || '',
      description: sneaker.description || '',
      price: sneaker.price || 0,
      size: sneaker.size || '',
      color: sneaker.color || '',
      condition: sneaker.condition || 'New',
      stock: sneaker.stock || 1,
      imageUrls: sneaker.imageUrls && sneaker.imageUrls.length > 0 ? sneaker.imageUrls : ['']
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/sneakers/${editingSneaker.id}`, formData)
      alert('Sneaker updated successfully!')
      setEditingSneaker(null)
      fetchMySneakers()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update sneaker'
      alert(`Error: ${errorMsg}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sneaker?')) return
    
    try {
      await axios.delete(`/api/sneakers/${id}`)
      alert('Sneaker deleted successfully!')
      fetchMySneakers()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete sneaker')
    }
  }

  const addImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] })
  }

  const removeImageUrl = (index) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index)
    setFormData({ ...formData, imageUrls: newUrls })
  }

  const updateImageUrl = (index, value) => {
    const newUrls = [...formData.imageUrls]
    newUrls[index] = value
    setFormData({ ...formData, imageUrls: newUrls })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slideUp">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Listings
              </h1>
              <p className="text-gray-600 mt-1">Manage your sneaker listings</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/create-sneaker')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Listing</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Total Listings</p>
                <p className="text-4xl font-bold text-gray-900">{sneakers.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <Package className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Available</p>
                <p className="text-4xl font-bold text-green-600">
                  {sneakers.filter(s => s.status === 'AVAILABLE').length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <Eye className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </div>
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Total Value</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${sneakers.reduce((sum, s) => sum + (s.price * s.stock), 0).toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {sneakers.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
              <Package className="h-20 w-20 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No listings yet</h2>
            <p className="text-gray-600 mb-8 text-lg">Create your first listing to start selling</p>
            <button onClick={() => navigate('/create-sneaker')} className="btn-primary">
              Create Your First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sneakers.map((sneaker, index) => (
              <div key={sneaker.id} className="card p-8 animate-slideUp hover:shadow-2xl" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image */}
                  <div className="w-full lg:w-64 h-64 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden">
                    <img
                      src={sneaker.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}
                      alt={sneaker.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-600 mb-1">{sneaker.brand}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 break-words">{sneaker.name}</h3>
                        <p className="text-gray-600 break-words">{sneaker.description}</p>
                      </div>
                      <span className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold shadow-md ${
                        sneaker.status === 'AVAILABLE' 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                      }`}>
                        {sneaker.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Price</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ${sneaker.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Size</p>
                        <p className="text-2xl font-bold text-gray-900">{sneaker.size}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Condition</p>
                        <p className="text-2xl font-bold text-gray-900 break-words">{sneaker.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Stock</p>
                        <p className="text-2xl font-bold text-gray-900">{sneaker.stock}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(sneaker)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Edit className="h-5 w-5" />
                        <span className="font-semibold">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sneaker.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="font-semibold">Delete</span>
                      </button>
                      <button
                        onClick={() => navigate(`/sneaker/${sneaker.id}`)}
                        className="flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:shadow-lg transition-all hover:scale-105"
                      >
                        <Eye className="h-5 w-5" />
                        <span className="font-semibold">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingSneaker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
            <div className="glass rounded-3xl p-8 max-w-4xl w-full my-8 animate-scaleIn">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Edit Sneaker
                </h2>
                <button
                  onClick={() => setEditingSneaker(null)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Brand *</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Size *</label>
                    <input
                      type="text"
                      required
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Color *</label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Condition *</label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="input-field"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Stock *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image URLs</label>
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Image
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSneaker(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListings
