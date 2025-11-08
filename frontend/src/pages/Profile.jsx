import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react'

const Profile = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
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
      alert('Profile updated successfully!')
      setEditing(false)
      window.location.reload()
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/users/change-password', passwordData)
      alert('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.fullName}</h1>
              <p className="text-gray-600">@{user?.username}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-primary hover:underline">
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{user?.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{user?.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Security</h2>
              {!showPasswordForm && (
                <button onClick={() => setShowPasswordForm(true)} className="text-primary hover:underline">
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary">Update Password</button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-secondary">Cancel</button>
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
