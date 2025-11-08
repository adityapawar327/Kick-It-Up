import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Plus, X, Upload, Link as LinkIcon } from 'lucide-react'

const CreateSneaker = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    size: '',
    color: '',
    condition: 'New',
    stock: '',
    imageUrls: ['']
  })
  const [uploadedImages, setUploadedImages] = useState([])
  const [loading, setLoading] = useState(false)

  if (!token) {
    navigate('/login')
    return null
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine URL images and uploaded images
      const urlImages = formData.imageUrls.filter(url => url.trim() !== '')
      const allImages = [...urlImages, ...uploadedImages]

      if (allImages.length === 0) {
        toast.error('PLEASE ADD AT LEAST ONE IMAGE')
        setLoading(false)
        return
      }

      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrls: allImages
      }
      await axios.post('/api/sneakers', data)
      toast.success('SNEAKER LISTED SUCCESSFULLY!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.error || 'FAILED TO CREATE LISTING')
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-8xl font-bold mb-4">LIST SNEAKER</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            ADD YOUR KICKS TO THE MARKETPLACE
          </p>
        </div>
        <div className="card p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">SNEAKER NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="AIR JORDAN 1 RETRO HIGH"
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
                  placeholder="NIKE"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">PRICE ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="250.00"
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
                  placeholder="10"
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
                  placeholder="BLACK/RED/WHITE"
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
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input-field"
                  placeholder="2"
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
                placeholder="DESCRIBE YOUR SNEAKERS..."
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                <Upload className="inline h-4 w-4 mr-2" />
                UPLOAD IMAGES FROM YOUR PC
              </label>
              <div className="border-2 border-dashed border-black rounded-3xl p-8 text-center hover:bg-gray-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-black" />
                  <p className="text-sm font-bold uppercase tracking-wider mb-2">CLICK TO UPLOAD IMAGES</p>
                  <p className="text-xs uppercase tracking-wider text-gray-600">PNG, JPG, JPEG (MAX 5MB EACH)</p>
                </label>
              </div>

              {/* Preview Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-2xl border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
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
                OR ADD IMAGE URLS
              </label>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
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
                className="flex items-center space-x-2 text-black hover:underline font-bold uppercase tracking-wider text-sm mt-3"
              >
                <Plus className="h-5 w-5" />
                <span>ADD ANOTHER URL</span>
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CREATING...' : 'LIST SNEAKER'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-secondary"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateSneaker
