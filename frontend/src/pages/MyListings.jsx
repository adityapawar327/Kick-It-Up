import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'
import { Edit, Trash2, Package, DollarSign, Eye, X, Plus, Upload, Link as LinkIcon } from 'lucide-react'

const MyListings = () => {
  const { token } = useAuth()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const toast = useToast()
  const [sneakers, setSneakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSneaker, setEditingSneaker] = useState(null)
  const [formData, setFormData] = useState({})
  const [uploadedImages, setUploadedImages] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchMySneakers()
  }, [token, navigate])

  const fetchMySneakers = async () => {
    try {
      const response = await axios.get('/sneakers/my-sneakers')
      setSneakers(response.data)
    } catch (error) {
      console.error('Failed to fetch sneakers:', error)
      toast.error('FAILED TO LOAD LISTINGS')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sneaker) => {
    setEditingSneaker(sneaker)
    setUploadedImages([])
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('IMAGE SIZE MUST BE LESS THAN 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      // Combine URL images and uploaded images
      const urlImages = formData.imageUrls.filter(url => url.trim() !== '')
      const allImages = [...urlImages, ...uploadedImages]

      const updatedData = {
        ...formData,
        imageUrls: allImages
      }

      await axios.put(`/sneakers/${editingSneaker.id}`, updatedData)
      toast.success('SNEAKER UPDATED SUCCESSFULLY!')
      setEditingSneaker(null)
      setUploadedImages([])
      fetchMySneakers()
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'FAILED TO UPDATE SNEAKER'
      toast.error(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`/sneakers/${deleteConfirm}`)
      toast.success('SNEAKER DELETED SUCCESSFULLY!')
      setDeleteConfirm(null)
      fetchMySneakers()
    } catch (error) {
      toast.error(error.response?.data?.error || 'FAILED TO DELETE SNEAKER')
      setDeleteConfirm(null)
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold">LOADING YOUR LISTINGS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 animate-slideUp">
          <div className="text-center md:text-left">
            <h1 className="text-display text-8xl font-bold mb-4">MY LISTINGS</h1>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
              MANAGE YOUR SNEAKER LISTINGS
            </p>
          </div>
          <button
            onClick={() => navigate('/create-sneaker')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>ADD NEW LISTING</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">TOTAL LISTINGS</p>
                <p className="text-5xl font-bold">{sneakers.length}</p>
              </div>
              <Package className="h-16 w-16 text-black" />
            </div>
          </div>
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">AVAILABLE</p>
                <p className="text-5xl font-bold">
                  {sneakers.filter(s => s.status === 'AVAILABLE').length}
                </p>
              </div>
              <Eye className="h-16 w-16 text-black" />
            </div>
          </div>
          <div className="card p-8 animate-slideUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">TOTAL VALUE</p>
                <p className="text-5xl font-bold">
                  {formatPrice(sneakers.reduce((sum, s) => sum + (s.price * s.stock), 0))}
                </p>
              </div>
              <DollarSign className="h-16 w-16 text-black" />
            </div>
          </div>
        </div>

        {sneakers.length === 0 ? (
          <div className="card p-16 text-center animate-scaleIn">
            <div className="inline-block p-8 border-2 border-black rounded-full mb-8">
              <Package className="h-20 w-20 text-black" />
            </div>
            <h2 className="text-display text-4xl font-bold mb-6">NO LISTINGS YET</h2>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600 mb-8">
              CREATE YOUR FIRST LISTING TO START SELLING
            </p>
            <button onClick={() => navigate('/create-sneaker')} className="btn-primary">
              CREATE YOUR FIRST LISTING
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sneakers.map((sneaker, index) => (
              <div key={sneaker.id} className="card p-8 animate-slideUp hover:shadow-2xl" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image */}
                  <div className="w-full lg:w-64 h-64 flex-shrink-0 bg-gray-100 rounded-3xl overflow-hidden border-2 border-black">
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
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">{sneaker.brand}</p>
                        <h3 className="text-3xl font-bold mb-2 break-words uppercase">{sneaker.name}</h3>
                        <p className="text-gray-600 break-words">{sneaker.description}</p>
                      </div>
                      <span className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                        sneaker.status === 'AVAILABLE' 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {sneaker.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">PRICE</p>
                        <p className="text-2xl font-bold">
                          {formatPrice(sneaker.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">SIZE</p>
                        <p className="text-2xl font-bold">{sneaker.size}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">CONDITION</p>
                        <p className="text-xl font-bold uppercase break-words">{sneaker.condition}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">STOCK</p>
                        <p className="text-2xl font-bold">{sneaker.stock}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(sneaker)}
                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-bold uppercase text-sm tracking-wider"
                      >
                        <Edit className="h-5 w-5" />
                        <span>EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sneaker.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-100 transition-all font-bold uppercase text-sm tracking-wider"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>DELETE</span>
                      </button>
                      <button
                        onClick={() => navigate(`/sneaker/${sneaker.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-100 transition-all font-bold uppercase text-sm tracking-wider"
                      >
                        <Eye className="h-5 w-5" />
                        <span>VIEW</span>
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
            <div className="bg-white border-2 border-black rounded-3xl p-8 max-w-4xl w-full my-8 animate-scaleIn">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-display text-4xl font-bold uppercase">
                  EDIT SNEAKER
                </h2>
                <button
                  onClick={() => setEditingSneaker(null)}
                  className="w-10 h-10 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">NAME *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">BRAND *</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">PRICE ($) *</label>
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
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">SIZE *</label>
                    <input
                      type="text"
                      required
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">COLOR *</label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">CONDITION *</label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="input-field"
                    >
                      <option value="New">NEW</option>
                      <option value="Like New">LIKE NEW</option>
                      <option value="Used">USED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">STOCK *</label>
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
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">DESCRIPTION *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                    rows="4"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    <Upload className="inline h-4 w-4 mr-2" />
                    UPLOAD NEW IMAGES
                  </label>
                  <div className="border-2 border-dashed border-black rounded-3xl p-6 text-center hover:bg-gray-50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="edit-file-upload"
                    />
                    <label htmlFor="edit-file-upload" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto mb-3 text-black" />
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">CLICK TO UPLOAD</p>
                      <p className="text-xs uppercase tracking-wider text-gray-600">PNG, JPG (MAX 5MB)</p>
                    </label>
                  </div>

                  {/* Preview Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-2xl border-2 border-black"
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image URL Section */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    <LinkIcon className="inline h-4 w-4 mr-2" />
                    OR KEEP/ADD IMAGE URLS
                  </label>
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="input-field"
                        placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                      />
                      {formData.imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="p-2 bg-white border-2 border-black rounded-full hover:bg-black hover:text-white transition-all"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="text-black hover:underline font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    ADD ANOTHER URL
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    SAVE CHANGES
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSneaker(null)}
                    className="flex-1 btn-secondary"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <ConfirmDialog
            title="KICK IT UP SAYS"
            message="ARE YOU SURE YOU WANT TO DELETE THIS SNEAKER?"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirm(null)}
            confirmText="DELETE"
            cancelText="CANCEL"
          />
        )}
      </div>
    </div>
  )
}

export default MyListings
