import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SneakerDetails from './pages/SneakerDetails'
import Dashboard from './pages/Dashboard'
import CreateSneaker from './pages/CreateSneaker'
import Favorites from './pages/Favorites'
import MyOrders from './pages/MyOrders'
import MyListings from './pages/MyListings'
import Profile from './pages/Profile'
import AboutUs from './pages/AboutUs'
import TestPage from './pages/TestPage'
import Cart from './pages/Cart'
import TradeRequests from './pages/TradeRequests'
import ProposeTrade from './pages/ProposeTrade'
import Messages from './pages/Messages'

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/sneaker/:id" element={<SneakerDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-sneaker" element={<CreateSneaker />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/my-listings" element={<MyListings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/trade-requests" element={<TradeRequests />} />
                  <Route path="/propose-trade/:id" element={<ProposeTrade />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/test" element={<TestPage />} />
                </Routes>
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
