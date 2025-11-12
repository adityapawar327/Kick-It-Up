import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Trash2, Plus, Minus, ShoppingBag, MapPin, CreditCard, Smartphone, Banknote, X } from 'lucide-react'
import axios from '../utils/axios'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const { formatPrice } = useCurrency()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [orderData, setOrderData] = useState({
    receiverName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    shippingAddress: user?.address || '',
    paymentMethod: 'COD'
  })

  const handleGetLocation = () => {
    setLoadingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Using a reverse geocoding API (OpenStreetMap Nominatim)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const address = data.display_name || `${latitude}, ${longitude}`
            setOrderData({ ...orderData, shippingAddress: address })
            showToast('Location fetched successfully!', 'success')
          } catch (error) {
            showToast('Failed to fetch address', 'error')
          } finally {
            setLoadingLocation(false)
          }
        },
        (error) => {
          showToast('Location access denied', 'error')
          setLoadingLocation(false)
        }
      )
    } else {
      showToast('Geolocation not supported', 'error')
      setLoadingLocation(false)
    }
  }

  const handlePlaceOrder = async () => {
    // Validate all fields
    if (!orderData.receiverName || orderData.receiverName.trim().length < 2) {
      showToast('Please enter a valid receiver name', 'error')
      return
    }
    
    if (!orderData.phoneNumber || orderData.phoneNumber.trim().length < 10) {
      showToast('Please enter a valid phone number', 'error')
      return
    }
    
    if (!orderData.shippingAddress || orderData.shippingAddress.trim().length < 10) {
      showToast('Please enter a complete shipping address', 'error')
      return
    }

    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }

    setLoading(true)
    const successfulOrders = []
    const failedOrders = []
    
    try {
      // Place orders for each item in cart
      for (const item of cartItems) {
        try {
          await axios.post('/orders', {
            sneakerId: item.id,
            shippingAddress: orderData.shippingAddress.trim(),
            phoneNumber: orderData.phoneNumber.trim(),
            receiverName: orderData.receiverName.trim(),
            paymentMethod: orderData.paymentMethod
          })
          successfulOrders.push(item.name)
        } catch (error) {
          console.error(`Failed to order ${item.name}:`, error)
          failedOrders.push({
            name: item.name,
            error: error.response?.data?.error || 'Unknown error'
          })
        }
      }
      
      // Show results
      if (successfulOrders.length > 0 && failedOrders.length === 0) {
        showToast(`All ${successfulOrders.length} orders placed successfully!`, 'success')
        clearCart()
        setShowCheckout(false)
        navigate('/my-orders')
      } else if (successfulOrders.length > 0 && failedOrders.length > 0) {
        showToast(`${successfulOrders.length} orders placed. ${failedOrders.length} failed.`, 'warning')
        // Remove successful items from cart
        successfulOrders.forEach(name => {
          const item = cartItems.find(i => i.name === name)
          if (item) removeFromCart(item.id)
        })
      } else {
        showToast('All orders failed. Please try again.', 'error')
      }
    } catch (error) {
      showToast('Failed to place orders. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      showToast('Please login to checkout', 'error')
      navigate('/login')
      return
    }
    
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }

    setShowCheckout(true)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block p-8 border-2 border-black rounded-full mb-8">
            <ShoppingBag className="h-20 w-20 text-black" />
          </div>
          <h2 className="text-display text-4xl font-bold mb-4 uppercase">YOUR CART IS EMPTY</h2>
          <p className="text-gray-600 mb-8 uppercase tracking-wider text-sm">
            ADD SOME SNEAKERS TO GET STARTED
          </p>
          <Link to="/" className="btn-primary">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-display text-6xl font-bold uppercase">SHOPPING CART</h1>
          <button
            onClick={clearCart}
            className="btn-secondary text-sm"
          >
            CLEAR CART
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex gap-6">
                  <Link to={`/sneaker/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-2xl border-2 border-black"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <Link to={`/sneaker/${item.id}`}>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">
                        {item.brand}
                      </p>
                      <h3 className="text-xl font-bold uppercase mb-2 hover:underline">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>SIZE: {item.size}</span>
                      <span>•</span>
                      <span>{item.condition}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <p className="text-2xl font-bold">{formatPrice(item.price * item.quantity)}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-24">
              <h2 className="text-display text-2xl font-bold uppercase mb-6">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="uppercase tracking-wider">SUBTOTAL</span>
                  <span className="font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="uppercase tracking-wider">SHIPPING</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="border-t-2 border-black pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold uppercase">TOTAL</span>
                    <span className="text-2xl font-bold">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full mb-4"
              >
                PROCEED TO CHECKOUT
              </button>
              
              <Link to="/" className="btn-secondary w-full block text-center">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white border-2 border-black rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-display text-3xl font-bold uppercase">CHECKOUT</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-10 h-10 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="space-y-6">
                {/* Receiver Details */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    RECEIVER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.receiverName}
                    onChange={(e) => setOrderData({ ...orderData, receiverName: e.target.value })}
                    className="input-field"
                    placeholder="FULL NAME"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderData.phoneNumber}
                    onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                    className="input-field"
                    placeholder="CONTACT NUMBER"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    SHIPPING ADDRESS *
                  </label>
                  <textarea
                    required
                    value={orderData.shippingAddress}
                    onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                    className="w-full px-6 py-4 bg-white border-2 border-black rounded-3xl focus:outline-none focus:ring-0 transition-all duration-300 text-sm font-medium"
                    rows="3"
                    placeholder="ENTER YOUR FULL SHIPPING ADDRESS"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="mt-3 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{loadingLocation ? 'FETCHING LOCATION...' : 'USE MY CURRENT LOCATION'}</span>
                  </button>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                    PAYMENT METHOD *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-black rounded-3xl cursor-pointer hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={orderData.paymentMethod === 'COD'}
                        onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                        className="mr-4"
                      />
                      <Banknote className="h-5 w-5 mr-3" />
                      <span className="font-bold uppercase text-sm">CASH ON DELIVERY</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-black rounded-3xl cursor-pointer hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={orderData.paymentMethod === 'UPI'}
                        onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                        className="mr-4"
                      />
                      <Smartphone className="h-5 w-5 mr-3" />
                      <span className="font-bold uppercase text-sm">UPI PAYMENT</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-black rounded-3xl cursor-pointer hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CARD"
                        checked={orderData.paymentMethod === 'CARD'}
                        onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                        className="mr-4"
                      />
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span className="font-bold uppercase text-sm">DEBIT/CREDIT CARD</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 border-2 border-black rounded-3xl p-6">
                  <h4 className="font-bold uppercase text-sm mb-4">ORDER SUMMARY</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ITEMS ({cartItems.length})</span>
                      <span className="font-bold">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHIPPING</span>
                      <span className="font-bold">FREE</span>
                    </div>
                    <div className="border-t-2 border-black pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">TOTAL</span>
                        <span className="font-bold">{formatPrice(getCartTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 btn-secondary"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
