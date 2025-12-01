import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User as UserIcon } from 'lucide-react'
import SearchForm from '../components/SearchForm'
import Chatbot from '../components/Chatbot'
import FlightCard from '../components/FlightCard'
import HotelCard from '../components/HotelCard'
import ProfilePage from '../components/ProfilePage'
import SeatMapModal from '../components/SeatMapModal'
import { chatAPI, bookingAPI } from '../utils/api'

const Dashboard = ({ user }) => {
  const [activeView, setActiveView] = useState('search')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showSeatMap, setShowSeatMap] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (searchData) => {
    setLoading(true)
    try {
      // Use chat API to process search
      const message = `Find flights from ${searchData.origin} to ${searchData.destination} on ${searchData.date} for ${searchData.travelers} traveler(s) in ${searchData.travelClass} class`
      const response = await chatAPI.sendMessage(message)
      
      setSearchResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSelect = (type, data) => {
    setSelectedBooking({ type, data })
    if (type === 'flight') {
      setShowSeatMap(true)
    } else {
      // Direct hotel booking
      handleConfirmBooking(data, {})
    }
  }

  const handleConfirmBooking = async (bookingData, selectedSeats) => {
    try {
      let response
      if (selectedBooking.type === 'flight') {
        response = await bookingAPI.bookFlight(bookingData, selectedSeats)
      } else {
        // Extract hotel booking parameters
        const hotelData = bookingData
        response = await bookingAPI.bookHotel(
          hotelData,
          hotelData.check_in || new Date().toISOString().split('T')[0],
          hotelData.check_out || new Date(Date.now() + 86400000).toISOString().split('T')[0],
          hotelData.guests || 1
        )
      }

      // Navigate to booking confirmation page
      navigate(`/booking/${response.data.booking.booking_id}`)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">Plan your next adventure with FlyMate7</p>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveView('search')}
          className={`px-6 py-3 font-medium transition ${
            activeView === 'search'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="inline h-5 w-5 mr-2" />
          Search
        </button>
        <button
          onClick={() => setActiveView('profile')}
          className={`px-6 py-3 font-medium transition ${
            activeView === 'profile'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserIcon className="inline h-5 w-5 mr-2" />
          Profile
        </button>
      </div>

      {/* Content */}
      {activeView === 'search' && (
        <div className="space-y-8">
          {/* Search Form */}
          <SearchForm onSearch={handleSearch} loading={loading} />

          {/* Search Results */}
          {searchResults && (
            <div className="space-y-6">
              {/* Flights */}
              {searchResults.flights && searchResults.flights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight Options</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.flights.map((flight, idx) => (
                      <FlightCard
                        key={idx}
                        flight={flight}
                        onBook={(flightData) => handleBookingSelect('flight', flightData)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {searchResults.hotels && searchResults.hotels.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Options</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.hotels.map((hotel, idx) => (
                      <HotelCard
                        key={idx}
                        hotel={hotel}
                        onBook={(hotelData) => handleBookingSelect('hotel', hotelData)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {(!searchResults.flights || searchResults.flights.length === 0) &&
               (!searchResults.hotels || searchResults.hotels.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No results found. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeView === 'profile' && <ProfilePage user={user} />}

      {/* Chatbot - Always available */}
      <Chatbot user={user} onBookingSelect={handleBookingSelect} />

      {/* Seat Map Modal */}
      {showSeatMap && selectedBooking && selectedBooking.type === 'flight' && (
        <SeatMapModal
          isOpen={showSeatMap}
          onClose={() => {
            setShowSeatMap(false)
            setSelectedBooking(null)
          }}
          travelClass={selectedBooking.data.travel_class || 'Economy'}
          segments={selectedBooking.data.segments || []}
          onConfirm={(selectedSeats) => {
            setShowSeatMap(false)
            handleConfirmBooking(selectedBooking.data, selectedSeats)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard