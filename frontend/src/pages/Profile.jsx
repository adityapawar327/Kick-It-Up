import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react'

const Profile = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  if (!token) {
    navigate('/login')
    return null
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await axios.put('/api/users/profile', formData)
      toast.success('PROFILE UPDATED SUCCESSFULLY!')
      setEditing(false)
      window.location.reload()
    } catch (error) {
      toast.error('FAILED TO UPDATE PROFILE')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/users/change-password', passwordData)
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
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-display text-4xl font-bold mb-2">{user?.fullName}</h2>
              <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">@{user?.username}</p>
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
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">SAVE CHANGES</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">CANCEL</button>
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
