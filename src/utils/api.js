import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Chat APIs
export const chatAPI = {
  sendMessage: (message, context) => api.post('/chat/message', { message, context }),
  getHistory: (limit = 50) => api.get('/chat/history', { params: { limit } }),
  clearHistory: () => api.post('/chat/clear'),
}

// Booking APIs
export const bookingAPI = {
  bookFlight: (flightData, selectedSeats, itineraryId) => 
    api.post('/booking/flight', { flight_data: flightData, selected_seats: selectedSeats, itinerary_id: itineraryId }),
  
  bookHotel: (hotelData, checkIn, checkOut, guests, itineraryId) => 
    api.post('/booking/hotel', { hotel_data: hotelData, check_in: checkIn, check_out: checkOut, guests, itinerary_id: itineraryId }),
  
  createItinerary: (itineraryData) => 
    api.post('/booking/itinerary', { itinerary_data: itineraryData }),
  
  getBookings: () => api.get('/booking/list'),
  
  getBookingDetails: (bookingType, bookingId) => 
    api.get(`/booking/${bookingType}/${bookingId}`),
  
  cancelBooking: (bookingId, bookingType) => 
    api.post('/booking/cancel', { booking_id: bookingId, booking_type: bookingType }),
  
  getSeatMap: (travelClass) => 
    api.get('/booking/seat-map', { params: { class: travelClass } }),
  
  submitFeedback: (bookingRef, bookingType, rating, comments) => 
    api.post('/booking/feedback', { booking_ref: bookingRef, booking_type: bookingType, rating, comments }),
  
  getFeedbackInsights: () => api.get('/booking/feedback/insights'),
}

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getPreferences: () => api.get('/profile/preferences'),
  updatePreferences: (preferences) => api.put('/profile/preferences', { preferences }),
  getHistory: () => api.get('/profile/history'),
  getStats: () => api.get('/profile/stats'),
}

export default api