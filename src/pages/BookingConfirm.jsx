import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Mail, Star, MessageSquare } from 'lucide-react'
import { bookingAPI } from '../utils/api'

const BookingConfirm = ({ user }) => {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [bookingType, setBookingType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedback, setFeedback] = useState({ rating: 5, comments: '' })
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    loadBookingDetails()
  }, [bookingId])

  const loadBookingDetails = async () => {
    setLoading(true)
    try {
      // Try flight first
      let response = await bookingAPI.getBookingDetails('flight', bookingId)
      if (response.data.booking) {
        setBooking(response.data.booking)
        setBookingType('flight')
      } else {
        // Try hotel
        response = await bookingAPI.getBookingDetails('hotel', bookingId)
        setBooking(response.data.booking)
        setBookingType('hotel')
      }
    } catch (error) {
      console.error('Error loading booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async () => {
    setSubmittingFeedback(true)
    try {
      await bookingAPI.submitFeedback(
        bookingId,
        bookingType,
        feedback.rating,
        feedback.comments
      )
      alert('Thank you for your feedback!')
      setShowFeedbackForm(false)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Booking not found</p>
          <Link to="/dashboard" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
        <p className="text-green-700 text-lg">
          Your {bookingType} has been successfully booked
        </p>
        <p className="text-green-600 mt-2">
          Booking ID: <span className="font-mono font-bold">{booking.booking_id}</span>
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

        {bookingType === 'flight' && (
          <div className="space-y-4">
            {booking.segments.map((segment, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  Flight {idx + 1}: {segment.origin} → {segment.destination}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Flight Number</p>
                    <p className="font-semibold">{segment.flight_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Airline</p>
                    <p className="font-semibold">{segment.airline}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Departure</p>
                    <p className="font-semibold">{segment.departure_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Arrival</p>
                    <p className="font-semibold">{segment.arrival_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Seat</p>
                    <p className="font-semibold">{segment.seat || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Class</p>
                    <p className="font-semibold">{segment.travel_class || 'Economy'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookingType === 'hotel' && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">{booking.hotel.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-semibold">{booking.hotel.location}</p>
              </div>
              <div>
                <p className="text-gray-600">Room Type</p>
                <p className="font-semibold">{booking.hotel.room_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-in</p>
                <p className="font-semibold">{booking.hotel.check_in}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out</p>
                <p className="font-semibold">{booking.hotel.check_out}</p>
              </div>
              <div>
                <p className="text-gray-600">Guests</p>
                <p className="font-semibold">{booking.hotel.guests}</p>
              </div>
              <div>
                <p className="text-gray-600">Rating</p>
                <p className="font-semibold">{booking.hotel.rating} ⭐</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Total Amount</span>
            <span className="text-3xl font-bold text-primary-600">
              ₹{booking.price_inr.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg font-semibold transition">
          <Mail className="h-5 w-5" />
          <span>Ticket sent to email</span>
        </button>
        <button className="flex items-center justify-center space-x-2 px-6 py-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-semibold transition">
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Feedback Section */}
      {!showFeedbackForm ? (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">How was your experience?</h3>
          <p className="text-gray-600 mb-4">Your feedback helps us serve you better</p>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            <MessageSquare className="inline h-5 w-5 mr-2" />
            Leave Feedback
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Leave Your Feedback</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= feedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us about your experience..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback}
                className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="mt-8 text-center">
        <Link
          to="/dashboard"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default BookingConfirm