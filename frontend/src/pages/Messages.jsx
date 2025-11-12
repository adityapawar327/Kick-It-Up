import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { MessageCircle, Send, User, ArrowLeft, Image, Video, Mic, Paperclip, X } from 'lucide-react'

const Messages = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  
  const [partners, setPartners] = useState([])
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchUsername, setSearchUsername] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    
    console.log('Messages page mounted, fetching partners...')
    fetchPartners()
    
    // Check if there's a userId in URL params
    const userId = searchParams.get('userId')
    if (userId) {
      console.log('URL has userId parameter:', userId)
      selectPartnerById(parseInt(userId))
    }
  }, [token, searchParams])
  
  // Force refresh partners when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        console.log('Page became visible, refreshing partners...')
        fetchPartners()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [token])

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages()
      markAsRead()
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedPartner])

  // Poll for new conversation partners every 5 seconds
  useEffect(() => {
    if (token) {
      const interval = setInterval(fetchPartners, 5000)
      return () => clearInterval(interval)
    }
  }, [token])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchPartners = async (retryCount = 0) => {
    try {
      const response = await axios.get('/messages/partners')
      console.log('Fetched partners from API:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        // Validate partner data
        const validPartners = response.data.filter(p => 
          p && p.id && p.username
        )
        setPartners(validPartners)
        console.log('Partners state updated with', validPartners.length, 'partners')
      } else {
        console.warn('Invalid partners data format:', response.data)
        setPartners([])
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
      
      // Retry logic for network errors
      if (retryCount < 2 && error.code === 'ERR_NETWORK') {
        console.log(`Retrying... (${retryCount + 1}/2)`)
        setTimeout(() => fetchPartners(retryCount + 1), 1000)
      } else if (error.response?.status === 401) {
        // Token expired, redirect to login
        showToast('Session expired. Please login again.', 'error')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const selectPartnerById = async (userId) => {
    if (!userId || isNaN(userId)) {
      console.error('Invalid user ID:', userId)
      showToast('Invalid user ID', 'error')
      return
    }
    
    try {
      console.log('Selecting partner by ID:', userId)
      
      // Check if partner already in list
      const partner = partners.find(p => p.id === userId)
      if (partner) {
        console.log('Partner found in list:', partner)
        setSelectedPartner(partner)
        return
      }
      
      // Fetch user details from backend
      try {
        const response = await axios.get(`/users/${userId}`)
        
        if (!response.data || !response.data.id) {
          throw new Error('Invalid user data received')
        }
        
        const newPartner = { 
          ...response.data, 
          unreadCount: 0,
          fullName: response.data.fullName || '',
          profileImage: response.data.profileImage || ''
        }
        
        console.log('Fetched partner from API:', newPartner)
        setSelectedPartner(newPartner)
        
        // Add to partners list
        setPartners(prev => {
          const exists = prev.find(p => p.id === newPartner.id)
          if (!exists) {
            console.log('Adding partner from URL to list')
            return [newPartner, ...prev]
          }
          return prev
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        
        if (error.response?.status === 404) {
          showToast('User not found', 'error')
        } else if (error.response?.status === 401) {
          showToast('Session expired', 'error')
          navigate('/login')
        } else {
          showToast('Failed to load user details', 'error')
        }
        
        // Navigate back to messages list
        navigate('/messages')
      }
    } catch (error) {
      console.error('Failed to select partner:', error)
      showToast('An error occurred', 'error')
    }
  }

  const handleSearchUser = async (e) => {
    e.preventDefault()
    
    const username = searchUsername.trim()
    
    // Validation
    if (!username) {
      showToast('Please enter a username', 'error')
      return
    }
    
    if (username.length < 2) {
      showToast('Username must be at least 2 characters', 'error')
      return
    }
    
    if (username.length > 50) {
      showToast('Username is too long', 'error')
      return
    }
    
    // Check if searching for self
    if (username.toLowerCase() === user.username.toLowerCase()) {
      showToast('You cannot message yourself', 'error')
      return
    }

    setSearchLoading(true)
    try {
      const response = await axios.get(`/users/search?username=${encodeURIComponent(username)}`)
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid user data')
      }
      
      const newPartner = { 
        ...response.data, 
        unreadCount: 0,
        fullName: response.data.fullName || '',
        profileImage: response.data.profileImage || ''
      }
      
      console.log('Found user:', newPartner)
      setSelectedPartner(newPartner)
      
      // Add to partners list if not already there
      setPartners(prev => {
        const exists = prev.find(p => p.id === newPartner.id)
        if (!exists) {
          console.log('Adding searched user to partners list')
          return [newPartner, ...prev]
        }
        return prev
      })
      
      setSearchUsername('')
      showToast('User found! Start chatting', 'success')
    } catch (error) {
      console.error('Search error:', error)
      
      if (error.response?.status === 404) {
        showToast(`User "${username}" not found`, 'error')
      } else if (error.response?.status === 401) {
        showToast('Session expired', 'error')
        navigate('/login')
      } else if (error.code === 'ERR_NETWORK') {
        showToast('Network error. Please check your connection.', 'error')
      } else {
        showToast(error.response?.data?.error || 'Failed to search user', 'error')
      }
    } finally {
      setSearchLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedPartner || !selectedPartner.id) {
      console.warn('Cannot fetch messages: no partner selected')
      return
    }
    
    try {
      const response = await axios.get(`/messages/conversation/${selectedPartner.id}`)
      
      if (response.data && Array.isArray(response.data)) {
        // Validate message data
        const validMessages = response.data.filter(m => 
          m && m.id && m.content && m.senderId && m.receiverId
        )
        setMessages(validMessages)
      } else {
        console.warn('Invalid messages data format')
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      if (error.response?.status === 404) {
        // Conversation not found, start fresh
        setMessages([])
      } else if (error.response?.status === 401) {
        showToast('Session expired', 'error')
        navigate('/login')
      }
    }
  }

  const markAsRead = async () => {
    if (!selectedPartner || !selectedPartner.id) return
    
    try {
      await axios.patch(`/messages/conversation/${selectedPartner.id}/read`)
      
      // Update local state to reflect read status
      setMessages(prev => prev.map(m => 
        m.receiverId === user.id && m.senderId === selectedPartner.id
          ? { ...m, isRead: true }
          : m
      ))
      
      // Update unread count in partners list
      setPartners(prev => prev.map(p =>
        p.id === selectedPartner.id
          ? { ...p, unreadCount: 0 }
          : p
      ))
    } catch (error) {
      console.error('Failed to mark as read:', error)
      // Non-critical error, don't show to user
    }
  }

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      showToast('File size must be less than 10MB', 'error')
      return
    }

    // File type validation
    const validTypes = {
      IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
      AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    }

    if (!validTypes[type].includes(file.type)) {
      showToast(`Invalid ${type.toLowerCase()} file type`, 'error')
      return
    }

    setSelectedFile({ file, type })
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setShowMediaOptions(false)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!selectedFile && (!newMessage || !newMessage.trim())) {
      showToast('Please enter a message or select a file', 'error')
      return
    }
    
    if (newMessage && newMessage.trim().length > 1000) {
      showToast('Message is too long (max 1000 characters)', 'error')
      return
    }
    
    if (!selectedPartner || !selectedPartner.id) {
      showToast('Please select a conversation', 'error')
      return
    }

    const messageContent = newMessage.trim()
    setSending(true)
    
    try {
      const messageData = {
        receiverId: selectedPartner.id,
        content: messageContent || (selectedFile ? `Sent a ${selectedFile.type.toLowerCase()}` : '')
      }

      // If there's a file, add media data
      if (selectedFile) {
        messageData.messageType = selectedFile.type
        messageData.mediaUrl = filePreview // Base64 encoded
        messageData.mediaFileName = selectedFile.file.name
        messageData.mediaMimeType = selectedFile.file.type
        messageData.mediaSize = selectedFile.file.size
      }

      const response = await axios.post('/messages', messageData)
      
      console.log('Message sent:', response.data)
      setNewMessage('')
      clearSelectedFile()
      
      // Optimistically add message to UI
      const optimisticMessage = {
        ...response.data,
        senderUsername: user.username,
        receiverUsername: selectedPartner.username
      }
      setMessages(prev => [...prev, optimisticMessage])
      
      // IMMEDIATELY add partner to list if not there
      setPartners(prev => {
        const exists = prev.find(p => p.id === selectedPartner.id)
        if (!exists) {
          console.log('Adding partner to list:', selectedPartner)
          return [{ ...selectedPartner, unreadCount: 0 }, ...prev]
        }
        return prev
      })
      
      // Refresh to get server state
      setTimeout(() => {
        fetchMessages()
        fetchPartners()
      }, 500)
    } catch (error) {
      console.error('Send message error:', error)
      
      // Specific error messages
      if (error.response?.status === 400) {
        showToast(error.response.data.error || 'Invalid message', 'error')
      } else if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error')
        navigate('/login')
      } else if (error.response?.status === 404) {
        showToast('Recipient not found', 'error')
      } else if (error.code === 'ERR_NETWORK') {
        showToast('Network error. Please check your connection.', 'error')
      } else {
        showToast('Failed to send message. Please try again.', 'error')
      }
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-display text-8xl font-bold mb-4">MESSAGES</h1>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
            CHAT WITH BUYERS AND SELLERS
          </p>
        </div>

        <div className="card overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${selectedPartner ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r-2 border-black overflow-y-auto`}>
              <div className="p-6 border-b-2 border-black bg-gray-50">
                <h2 className="text-display text-2xl font-bold uppercase mb-4">CONVERSATIONS</h2>
                
                {/* Search User */}
                <form onSubmit={handleSearchUser} className="flex space-x-2">
                  <input
                    type="text"
                    id="searchUsername"
                    name="searchUsername"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="SEARCH USERNAME..."
                    className="flex-1 px-4 py-2 bg-white border-2 border-black rounded-full focus:outline-none text-xs font-semibold uppercase"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="px-4 py-2 bg-black text-white rounded-full font-bold text-xs uppercase hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {searchLoading ? '...' : 'GO'}
                  </button>
                </form>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
                </div>
              ) : partners.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 uppercase text-sm font-semibold">NO CONVERSATIONS YET</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-black">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner)}
                      className={`w-full p-6 text-left hover:bg-gray-50 transition-all relative ${
                        selectedPartner?.id === partner.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center flex-shrink-0 relative">
                          {partner.profileImage ? (
                            <img src={partner.profileImage} alt={partner.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="h-6 w-6" />
                          )}
                          {partner.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {partner.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold uppercase text-sm truncate">{partner.username}</p>
                          <p className="text-xs text-gray-600 truncate">{partner.fullName}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className={`${selectedPartner ? 'block' : 'hidden lg:block'} w-full lg:w-2/3 flex flex-col`}>
              {selectedPartner ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b-2 border-black bg-gray-50 flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="lg:hidden w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="w-12 h-12 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center flex-shrink-0">
                      {selectedPartner.profileImage ? (
                        <img src={selectedPartner.profileImage} alt={selectedPartner.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold uppercase text-lg">{selectedPartner.username}</p>
                      <p className="text-xs text-gray-600">{selectedPartner.fullName}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 uppercase text-sm font-semibold">NO MESSAGES YET</p>
                        <p className="text-xs text-gray-500 mt-2">START THE CONVERSATION!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        // Multiple comparison methods for reliability
                        const isMyMessage = 
                          message.senderUsername?.toLowerCase() === user.username?.toLowerCase() ||
                          String(message.senderId) === String(user.id) ||
                          Number(message.senderId) === Number(user.id)
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                              {/* Sender Name Label */}
                              <p className={`text-xs font-bold uppercase tracking-wider mb-1 px-2 ${
                                isMyMessage ? 'text-gray-600' : 'text-gray-500'
                              }`}>
                                {isMyMessage ? 'YOU' : message.senderUsername}
                              </p>
                              
                              {/* Message Bubble */}
                              <div
                                className={`w-full px-6 py-4 rounded-3xl ${
                                  isMyMessage
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 border-2 border-black'
                                }`}
                              >
                                {/* Media Content */}
                                {message.messageType === 'IMAGE' && message.mediaUrl && (
                                  <img 
                                    src={message.mediaUrl} 
                                    alt="Shared image" 
                                    className="rounded-2xl mb-2 max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(message.mediaUrl, '_blank')}
                                  />
                                )}
                                
                                {message.messageType === 'VIDEO' && message.mediaUrl && (
                                  <video 
                                    controls 
                                    className="rounded-2xl mb-2 max-w-full h-auto"
                                    src={message.mediaUrl}
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                
                                {message.messageType === 'AUDIO' && message.mediaUrl && (
                                  <audio 
                                    controls 
                                    className="w-full mb-2"
                                    src={message.mediaUrl}
                                  >
                                    Your browser does not support the audio tag.
                                  </audio>
                                )}
                                
                                {/* Text Content */}
                                {message.content && (
                                  <p className="text-sm break-words">{message.content}</p>
                                )}
                                
                                <div className={`flex items-center justify-between mt-2 text-xs ${isMyMessage ? 'text-gray-300' : 'text-gray-500'}`}>
                                  <span>{formatTime(message.createdAt)}</span>
                                  {isMyMessage && (
                                    <span className="ml-2 font-bold">
                                      {message.isRead ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-6 border-t-2 border-black bg-gray-50">
                    {/* File Preview */}
                    {selectedFile && filePreview && (
                      <div className="mb-4 relative inline-block">
                        <div className="relative border-2 border-black rounded-2xl overflow-hidden bg-white">
                          {selectedFile.type === 'IMAGE' && (
                            <img src={filePreview} alt="Preview" className="max-h-32 max-w-xs" />
                          )}
                          {selectedFile.type === 'VIDEO' && (
                            <video src={filePreview} className="max-h-32 max-w-xs" />
                          )}
                          {selectedFile.type === 'AUDIO' && (
                            <div className="p-4 flex items-center space-x-2">
                              <Mic className="h-6 w-6" />
                              <span className="text-sm font-semibold">{selectedFile.file.name}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={clearSelectedFile}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      {/* Media Options Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowMediaOptions(!showMediaOptions)}
                          className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-all flex-shrink-0"
                          title="Attach media"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>
                        
                        {/* Media Options Dropdown */}
                        {showMediaOptions && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white border-2 border-black rounded-2xl shadow-2xl p-2 space-y-1">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*,video/*,audio/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  if (file.type.startsWith('image/')) handleFileSelect(e, 'IMAGE')
                                  else if (file.type.startsWith('video/')) handleFileSelect(e, 'VIDEO')
                                  else if (file.type.startsWith('audio/')) handleFileSelect(e, 'AUDIO')
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                fileInputRef.current.accept = 'image/*'
                                fileInputRef.current.click()
                              }}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl w-full text-left"
                            >
                              <Image className="h-5 w-5" />
                              <span className="text-sm font-semibold uppercase">Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                fileInputRef.current.accept = 'video/*'
                                fileInputRef.current.click()
                              }}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl w-full text-left"
                            >
                              <Video className="h-5 w-5" />
                              <span className="text-sm font-semibold uppercase">Video</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                fileInputRef.current.accept = 'audio/*'
                                fileInputRef.current.click()
                              }}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl w-full text-left"
                            >
                              <Mic className="h-5 w-5" />
                              <span className="text-sm font-semibold uppercase">Audio</span>
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        id="newMessage"
                        name="newMessage"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="TYPE YOUR MESSAGE..."
                        className="flex-1 px-6 py-4 bg-white border-2 border-black rounded-full focus:outline-none focus:ring-0 transition-all text-sm font-medium"
                        maxLength={1000}
                      />
                      <button
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || sending}
                        className="w-14 h-14 rounded-full bg-black text-white border-2 border-black flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <Send className="h-6 w-6" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="h-20 w-20 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 uppercase text-lg font-semibold">SELECT A CONVERSATION</p>
                    <p className="text-xs text-gray-500 mt-2">CHOOSE A CONTACT TO START MESSAGING</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
