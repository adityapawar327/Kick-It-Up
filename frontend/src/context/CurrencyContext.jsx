import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD'
  })

  const exchangeRate = 83 // 1 USD = 83 INR (approximate)

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'INR' : 'USD')
  }

  const formatPrice = (priceInUSD) => {
    if (!priceInUSD || isNaN(priceInUSD)) {
      return currency === 'INR' ? '₹0' : '$0.00'
    }
    
    if (currency === 'INR') {
      const priceInINR = priceInUSD * exchangeRate
      return `₹${priceInINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    }
    return `$${parseFloat(priceInUSD).toFixed(2)}`
  }

  const value = {
    currency,
    setCurrency,
    toggleCurrency,
    formatPrice,
    exchangeRate
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
