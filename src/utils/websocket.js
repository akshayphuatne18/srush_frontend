import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

class WebSocketClient {
  constructor() {
    this.socket = null
    this.connected = false
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.connected = true
      this.socket.emit('join', { user_id: userId })
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.connected = false
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  sendMessage(userId, message, context = {}) {
    if (this.socket && this.connected) {
      this.socket.emit('chat_message', {
        user_id: userId,
        message,
        context,
      })
    }
  }

  onResponse(callback) {
    if (this.socket) {
      this.socket.on('chat_response', callback)
    }
  }

  offResponse(callback) {
    if (this.socket) {
      this.socket.off('chat_response', callback)
    }
  }
}

export default new WebSocketClient()