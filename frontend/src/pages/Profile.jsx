import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { User, Mail, Phone, MapPin, Lock, Camera, Store, FileText } from 'lucide-react'

const Profile = () => {
  const { user: authUser, token } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    profileImage: '',
    isSeller: false,
    aboutMe: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  if (!token) {
    navigate('/login')
    return null
  }

  // Fetch full user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/users/profile')
        const userData = response.data
        setUser(userData)
        setFormData({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          profileImage: userData.profileImage || '',
          isSeller: userData.isSeller || false,
          aboutMe: userData.aboutMe || ''
        })
        setImagePreview(userData.profileImage || '')
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('FAILED TO LOAD PROFILE')
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-sm font-bold uppercase tracking-wider">LOADING PROFILE...</p>
        </div>
      </div>
    )
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('IMAGE SIZE MUST BE LESS THAN 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setImagePreview(base64String)
        setFormData({ ...formData, profileImage: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('/users/profile', formData)
      const userData = response.data
      setUser(userData)
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        profileImage: userData.profileImage || '',
        isSeller: userData.isSeller || false,
        aboutMe: userData.aboutMe || ''
      })
      setImagePreview(userData.profileImage || '')
      toast.success('PROFILE UPDATED SUCCESSFULLY!')
      setEditing(false)
    } catch (error) {
      console.error('Update error:', error)
      toast.error('FAILED TO UPDATE PROFILE')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/users/change-password', passwordData)
      toast.success('PASSWORD CHANGED SUCCESSFULLY!')
      setPasswordData({ currentPassword: '', newPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.response?.data?.error || 'FAILED TO CHANGE PASSWORD')
    }
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-8xl font-bold mb-4">PROFILE</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            MANAGE YOUR ACCOUNT SETTINGS
          </p>
        </div>

        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-6 mb-12 pb-8 border-b-2 border-black">
            <div className="relative">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {imagePreview || user?.profileImage ? (
                  <img src={imagePreview || user?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              {editing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 hover:bg-gray-800 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-display text-4xl font-bold mb-2">{user?.fullName}</h2>
              <p className="text-sm uppercase tracking-wider font-semibold text-gray-600 mb-2">@{user?.username}</p>
              {user?.isSeller && (
                <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Store className="h-3 w-3" />
                  <span>SELLER</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-display text-3xl font-bold">PROFILE INFORMATION</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-black hover:underline font-bold uppercase tracking-wider text-sm">
                  EDIT
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">FULL NAME</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field"
                    placeholder="ENTER YOUR FULL NAME"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="input-field"
                    placeholder="ENTER YOUR PHONE NUMBER"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">ADDRESS</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                    rows="3"
                    placeholder="ENTER YOUR ADDRESS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">ABOUT ME</label>
                  <textarea
                    value={formData.aboutMe}
                    onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                    className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                    rows="4"
                    placeholder="TELL US ABOUT YOURSELF"
                  />
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                  <Store className="h-6 w-6 text-black flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-wider text-black mb-1">SELLER MODE</p>
                    <p className="text-xs text-gray-600">Enable this to list and sell sneakers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSeller}
                      onChange={(e) => setFormData({ ...formData, isSeller: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">SAVE CHANGES</button>
                  <button type="button" onClick={() => { setEditing(false); setImagePreview(user?.profileImage || '') }} className="btn-secondary">CANCEL</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">EMAIL</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">PHONE</p>
                    <p className="font-semibold">{user?.phoneNumber || 'NOT SET'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">ADDRESS</p>
                    <p className="font-semibold">{user?.address || 'NOT SET'}</p>
                  </div>
                </div>
                {user?.aboutMe && (
                  <div className="flex items-start space-x-4 pt-4 border-t-2 border-gray-100">
                    <FileText className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">ABOUT ME</p>
                      <p className="font-medium text-gray-700 leading-relaxed">{user?.aboutMe}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4 pt-4 border-t-2 border-gray-100">
                  <Store className="h-6 w-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">SELLER STATUS</p>
                    <p className="font-semibold">{user?.isSeller ? 'ACTIVE SELLER' : 'BUYER ONLY'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="border-t-2 border-black pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-display text-3xl font-bold">SECURITY</h3>
              {!showPasswordForm && (
                <button onClick={() => setShowPasswordForm(true)} className="text-black hover:underline font-bold uppercase tracking-wider text-sm">
                  CHANGE PASSWORD
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">CURRENT PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="ENTER CURRENT PASSWORD"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">NEW PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="ENTER NEW PASSWORD"
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">UPDATE PASSWORD</button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-secondary">CANCEL</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
