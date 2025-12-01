import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, Minimize2, Loader } from 'lucide-react'
import { chatAPI } from '../utils/api'
import websocket from '../utils/websocket'
import FlightCard from './FlightCard'
import HotelCard from './HotelCard'
import ItineraryView from './ItineraryView'

const Chatbot = ({ user, onBookingSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDecisionLog, setShowDecisionLog] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user && isOpen) {
      loadChatHistory()
    }
  }, [user, isOpen])

  useEffect(() => {
    if (user) {
      // Connect to WebSocket
      websocket.connect(user.id)

      // Listen for responses
      websocket.onResponse(handleWebSocketResponse)

      return () => {
        websocket.offResponse(handleWebSocketResponse)
      }
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory(20)
      setMessages(response.data.history)
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const handleWebSocketResponse = (response) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString(),
      data: response
    }])
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      // Try WebSocket first, fallback to REST
      if (websocket.connected) {
        websocket.sendMessage(user.id, inputMessage)
      } else {
        const response = await chatAPI.sendMessage(inputMessage)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date().toISOString(),
          data: response.data
        }])
        setLoading(false)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }])
      setLoading(false)
    }
  }

  const handleQuickAction = (action) => {
    const actionMessages = {
      'create_itinerary': 'I want to plan a trip',
      'search_flight': 'Find me flights',
      'destination_suggestion': 'Suggest destinations for me'
    }
    setInputMessage(actionMessages[action] || '')
  }

  const renderMessageContent = (message) => {
    const data = message.data

    if (!data) {
      return <p className="text-gray-800">{message.content}</p>
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-800 whitespace-pre-line">{message.content}</p>

        {/* Flight Results */}
        {data.type === 'flight_results' && data.flights && (
          <div className="space-y-3 mt-4">
            {data.flights.slice(0, 3).map((flight, idx) => (
              <FlightCard
                key={idx}
                flight={flight}
                onBook={(flightData) => {
                  setIsOpen(false)
                  onBookingSelect && onBookingSelect('flight', flightData)
                }}
                compact
              />
            ))}
          </div>
        )}

        {/* Hotel Results */}
        {data.type === 'hotel_results' && data.hotels && (
          <div className="space-y-3 mt-4">
            {data.hotels.slice(0, 3).map((hotel, idx) => (
              <HotelCard
                key={idx}
                hotel={hotel}
                onBook={(hotelData) => {
                  setIsOpen(false)
                  onBookingSelect && onBookingSelect('hotel', hotelData)
                }}
                compact
              />
            ))}
          </div>
        )}

        {/* Itinerary Results */}
        {data.type === 'itinerary_results' && data.itinerary && (
          <ItineraryView
            itinerary={data.itinerary}
            onSelectFlight={(flight) => {
              setIsOpen(false)
              onBookingSelect && onBookingSelect('flight', flight)
            }}
            onSelectHotel={(hotel) => {
              setIsOpen(false)
              onBookingSelect && onBookingSelect('hotel', hotel)
            }}
            compact
          />
        )}

        {/* Destination Suggestions */}
        {data.type === 'destination_suggestions' && data.destinations && (
          <div className="grid grid-cols-1 gap-2 mt-4">
            {data.destinations.map((dest, idx) => (
              <div
                key={idx}
                className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200"
              >
                <h4 className="font-semibold text-primary-900">{dest.name}</h4>
                <p className="text-sm text-gray-600">
                  ₹{dest.min_budget.toLocaleString()} - ₹{dest.max_budget.toLocaleString()}
                </p>
                {dest.boosted && (
                  <span className="inline-block mt-1 px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                    Recommended for season
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {data.quick_actions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.quick_actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.action)}
                className="px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg text-sm transition"
              >
                {action.text}
              </button>
            ))}
          </div>
        )}

        {/* Decision Log */}
        {data.decision_log && data.decision_log.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowDecisionLog(!showDecisionLog)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDecisionLog ? 'Hide' : 'Show'} decision log
            </button>
            {showDecisionLog && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                {data.decision_log.map((log, idx) => (
                  <div key={idx} className="text-gray-600">
                    <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    {' - '}
                    {log.decision}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-primary text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 slide-in">
          {/* Header */}
          <div className="bg-gradient-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">FlyMate AI Assistant</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation!</p>
                <p className="text-sm mt-2">Ask me about flights, hotels, or trip planning.</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {renderMessageContent(message)}
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot