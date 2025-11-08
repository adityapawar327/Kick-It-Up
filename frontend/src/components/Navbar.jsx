import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, User } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

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
        className={`px-6 py-2 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider transition-all ${
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
          <Link to="/" className="flex items-center">
            <h1 className="text-display text-5xl font-bold tracking-wider">KICK IT UP</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/">HOME</NavLink>
                <NavLink to="/about">ABOUT</NavLink>
                <NavLink to="/favorites">FAVORITES</NavLink>
                <NavLink to="/my-orders">ORDERS</NavLink>
                <NavLink to="/my-listings">MY LISTINGS</NavLink>
                <Link to="/create-sneaker" className="btn-primary">
                  SELL
                </Link>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-all"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-3xl shadow-2xl py-2 animate-slideDown">
                      <div className="px-6 py-4 border-b-2 border-black">
                        <p className="font-bold text-sm uppercase tracking-wider">{user.username}</p>
                        <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                      </div>
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
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 hover:bg-gray-100 transition-all font-semibold text-sm uppercase tracking-wider border-t-2 border-black mt-2"
                      >
                        LOGOUT
                      </button>
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
            className="md:hidden w-12 h-12 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-all"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t-2 border-black animate-slideDown">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-4 bg-gray-100 rounded-3xl mb-4">
                  <p className="font-bold text-sm uppercase tracking-wider">{user.username}</p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                </div>
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
                  className="w-full text-left px-4 py-3 rounded-full border-2 border-black font-semibold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all mt-2"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="space-y-3">
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
