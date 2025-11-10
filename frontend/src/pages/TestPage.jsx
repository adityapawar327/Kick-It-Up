import { useState } from 'react'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'

const TestPage = () => {
  const { user, token, login } = useAuth()
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(false)

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, time: new Date().toLocaleTimeString() }])
  }

  const testBackend = async () => {
    try {
      const response = await axios.get('/sneakers/all')
      addResult('Backend API', true, `✓ Got ${response.data.length} sneakers`)
    } catch (error) {
      addResult('Backend API', false, `✗ ${error.message}`)
    }
  }

  const testLogin = async () => {
    try {
      await login('admin', 'password')
      addResult('Login', true, '✓ Login successful')
      // Wait a bit and check if user persists
      await new Promise(r => setTimeout(r, 100))
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      if (savedUser && savedToken) {
        addResult('Login Persistence', true, '✓ User data saved to localStorage')
      } else {
        addResult('Login Persistence', false, '✗ User data not saved')
      }
    } catch (error) {
      addResult('Login', false, `✗ ${error.message}`)
    }
  }

  const testProtectedEndpoint = async () => {
    try {
      const response = await axios.get('/orders/my-orders')
      addResult('Protected Endpoint', true, `✓ Got ${response.data.length} orders`)
    } catch (error) {
      addResult('Protected Endpoint', false, `✗ ${error.response?.status} ${error.message}`)
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setTestResults([])
    await testBackend()
    await new Promise(r => setTimeout(r, 500))
    await testLogin()
    await new Promise(r => setTimeout(r, 500))
    await testProtectedEndpoint()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">System Diagnostics</h1>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Logged In:</strong> {user ? 'Yes' : 'No'}</p>
            <p><strong>Username:</strong> {user?.username || 'Not logged in'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'No token'}</p>
            <p><strong>LocalStorage Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
            <p><strong>LocalStorage User:</strong> {localStorage.getItem('user') || 'Missing'}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Run Tests</h2>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={runAllTests} 
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Running...' : 'Run All Tests'}
            </button>
            <button 
              onClick={testBackend}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Backend
            </button>
            <button 
              onClick={testLogin}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Test Login
            </button>
            <button 
              onClick={testProtectedEndpoint}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Test Protected
            </button>
            <button 
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear & Reload
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{result.test}</p>
                      <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                        {result.message}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{result.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/" className="block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
              → Go to Home Page
            </a>
            <a href="/login" className="block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
              → Go to Login Page
            </a>
            <a href="http://localhost:8080/api/sneakers/all" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
              → Open Backend API (New Tab)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage
