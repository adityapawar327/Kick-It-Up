import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (sneaker, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === sneaker.id)
      if (existing) {
        return prev.map(item =>
          item.id === sneaker.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, sneaker.stock) }
            : item
        )
      }
      return [...prev, { ...sneaker, quantity }]
    })
  }

  const removeFromCart = (sneakerId) => {
    setCartItems(prev => prev.filter(item => item.id !== sneakerId))
  }

  const updateQuantity = (sneakerId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sneakerId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === sneakerId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
