import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { LogIn, User, Lock, UserCircle, Eye, EyeOff } from 'lucide-react'
import axios from '../utils/axios'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, setUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      showToast('Login successful!', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.response?.data?.error || 'Invalid username or password', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/auth/guest')
      const { token, username, email } = response.data
      const guestUser = { username, email, isGuest: true }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(guestUser))
      setUser(guestUser)
      
      showToast('Browsing as guest', 'success')
      navigate('/')
    } catch (err) {
      console.error('Guest login error:', err)
      showToast(err.response?.data?.error || 'Failed to login as guest', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-display text-5xl font-bold uppercase tracking-wider mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 uppercase tracking-wider">
            Sign in to continue
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field pl-12"
                  placeholder="YOUR USERNAME"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="YOUR PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-4 bg-white text-gray-600 font-bold">Or</span>
            </div>
          </div>

          {/* Guest Login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="btn-secondary w-full"
            disabled={loading}
          >
            <UserCircle className="inline h-5 w-5 mr-2" />
            CONTINUE AS GUEST
          </button>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-sm uppercase tracking-wider">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>


      </div>
    </div>
  )
}

export default Login
