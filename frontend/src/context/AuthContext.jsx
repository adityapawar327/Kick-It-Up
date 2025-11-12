import { createContext, useState, useContext, useEffect } from 'react'
import axios from '../utils/axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        return null
      }
    }
    return null
  })
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify token and user on mount
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    console.log('AuthContext initialized:', { 
      hasToken: !!savedToken, 
      hasUser: !!savedUser,
      tokenPreview: savedToken ? savedToken.substring(0, 20) + '...' : 'none',
      user: savedUser ? JSON.parse(savedUser) : null
    })
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(userData)
        console.log('Auth state restored from localStorage')
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    } else {
      console.log('No saved auth state found')
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await axios.post('/auth/login', { username, password })
    const { token: authToken, username: userName, email } = response.data
    
    const userData = { username: userName, email }
    
    console.log('Login successful:', { username: userName, email })
    
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(authToken)
    setUser(userData)
    
    console.log('User state updated:', userData)
    
    return response.data
  }

  const register = async (userData) => {
    const response = await axios.post('/auth/register', userData)
    const { token: authToken, username, email } = response.data
    
    const userInfo = { username, email }
    
    console.log('Registration successful:', { username, email })
    
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setToken(authToken)
    setUser(userInfo)
    
    console.log('User state updated after registration:', userInfo)
    
    return response.data
  }

  const logout = () => {
    console.log('Logging out user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, register, logout, loading }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  )
}
