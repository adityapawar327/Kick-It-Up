import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useCart } from '../context/CartContext'
import axios from '../utils/axios'
import { Menu, X, User, ShoppingCart, MessageCircle } from 'lucide-react'

const Navbar = () => {
  const { user, logout, token } = useAuth()
  const { currency, toggleCurrency } = useCurrency()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const userMenuRef = useRef(null)
  const cartCount = getCartCount()

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token || !user) return
      
      try {
        const response = await axios.get('/messages/unread-count')
        setUnreadCount(response.data.count || 0)
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
        // Silently fail - not critical
      }
    }

    fetchUnreadCount()
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000)
    
    return () => clearInterval(interval)
  }, [token, user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to
    return (
      <Link
        to={to}
        className={`px-3 xl:px-6 py-2 rounded-full border-2 border-black font-semibold uppercase text-xs xl:text-sm tracking-wider transition-all whitespace-nowrap ${
          isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
        }`}
      >
        {children}
      </Link>
    )
  }

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <h1 className="text-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider">KICK IT UP</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {user ? (
              <>
                <NavLink to="/">HOME</NavLink>
                <NavLink to="/about">ABOUT</NavLink>
                
                {/* Icon Buttons */}
                <Link 
                  to="/messages" 
                  className="relative w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-all flex-shrink-0"
                  title="Messages"
                >
                  <MessageCircle className="h-5 w-5 xl:h-6 xl:w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 xl:h-6 xl:w-6 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/cart" 
                  className="relative w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-all flex-shrink-0"
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5 xl:h-6 xl:w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 xl:h-6 xl:w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/create-sneaker" className="px-4 xl:px-6 py-2 rounded-full bg-black text-white border-2 border-black font-semibold uppercase text-xs xl:text-sm tracking-wider hover:bg-gray-800 transition-all whitespace-nowrap">
                  SELL
                </Link>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 xl:w-12 xl:h-12 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-all flex-shrink-0"
                  >
                    <User className="h-5 w-5 xl:h-6 xl:w-6" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-3xl shadow-2xl overflow-hidden animate-slideDown">
                      <div className="px-6 py-4 border-b-2 border-black bg-gray-50">
                        <p className="font-bold text-sm uppercase tracking-wider truncate">{user.username}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCurrency()
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider flex items-center justify-between"
                        >
                          <span>CURRENCY</span>
                          <span className="font-bold">{currency}</span>
                        </button>
                        <Link
                          to="/profile"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          PROFILE
                        </Link>
                        <Link
                          to="/dashboard"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          DASHBOARD
                        </Link>
                        <Link
                          to="/favorites"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          FAVORITES
                        </Link>
                        <Link
                          to="/my-orders"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          MY ORDERS
                        </Link>
                        <Link
                          to="/trade-requests"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          TRADE REQUESTS
                        </Link>
                        <Link
                          to="/my-listings"
                          className="block px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider"
                        >
                          MY LISTINGS
                        </Link>
                      </div>
                      <div className="border-t-2 border-black">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-3 hover:bg-red-50 transition-all font-semibold text-sm uppercase tracking-wider text-red-600"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/">HOME</NavLink>
                <NavLink to="/about">ABOUT</NavLink>
                <NavLink to="/login">LOGIN</NavLink>
                <Link to="/register" className="btn-primary">
                  SIGN UP
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-all flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t-2 border-black animate-slideDown">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-4 bg-gray-100 rounded-3xl mb-4">
                  <p className="font-bold text-sm uppercase tracking-wider">{user.username}</p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                </div>
                <button
                  onClick={toggleCurrency}
                  className="block w-full text-left px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all"
                >
                  CURRENCY: {currency}
                </button>
                <Link to="/" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  HOME
                </Link>
                <Link to="/about" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  ABOUT
                </Link>
                <Link to="/favorites" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  FAVORITES
                </Link>
                <Link to="/my-orders" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  ORDERS
                </Link>
                <Link to="/trade-requests" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  TRADE REQUESTS
                </Link>
                <Link to="/messages" className="relative block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  MESSAGES
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/my-listings" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  MY LISTINGS
                </Link>
                <Link to="/create-sneaker" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  SELL SNEAKER
                </Link>
                <Link to="/profile" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  PROFILE
                </Link>
                <Link to="/dashboard" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-full border-2 border-red-600 bg-red-50 text-red-600 font-semibold uppercase text-sm tracking-wider hover:bg-red-100 transition-all mt-2"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={toggleCurrency}
                  className="block w-full text-left px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all"
                >
                  CURRENCY: {currency}
                </button>
                <Link to="/" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  HOME
                </Link>
                <Link to="/about" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  ABOUT
                </Link>
                <Link to="/login" className="block px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all">
                  LOGIN
                </Link>
                <Link to="/register" className="block px-4 py-3 rounded-full bg-black text-white border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-800 transition-all text-center">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
