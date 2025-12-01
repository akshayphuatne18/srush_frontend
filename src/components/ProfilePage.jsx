import React, { useState, useEffect } from 'react'
import { User, Settings, History, Star, TrendingUp } from 'lucide-react'
import { profileAPI, bookingAPI } from '../utils/api'

const ProfilePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState({ flights: [], hotels: [] })
  const [feedbackInsights, setFeedbackInsights] = useState(null)
  const [preferences, setPreferences] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      const [statsRes, bookingsRes, insightsRes, prefsRes] = await Promise.all([
        profileAPI.getStats(),
        bookingAPI.getBookings(),
        bookingAPI.getFeedbackInsights(),
        profileAPI.getPreferences()
      ])

      setStats(statsRes.data)
      setBookings(bookingsRes.data)
      setFeedbackInsights(insightsRes.data)
      setPreferences(prefsRes.data.preferences)
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <p className="text-sm text-primary-700 mb-1">Name</p>
                  <p className="text-lg font-semibold text-primary-900">{user.name}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg">
                  <p className="text-sm text-secondary-700 mb-1">Email</p>
                  <p className="text-lg font-semibold text-secondary-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Travel Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary-600">{stats.total_bookings}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-secondary-600">{stats.total_flights}</p>
                    <p className="text-sm text-gray-600 mt-1">Flights</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.total_hotels}</p>
                    <p className="text-sm text-gray-600 mt-1">Hotels</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">
                      ₹{Math.round(stats.total_spent_inr / 1000)}K
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            
            {/* Flight Bookings */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flights</h3>
              {bookings.flights.length === 0 ? (
                <p className="text-gray-500">No flight bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.flights.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">Booking ID: {booking.booking_id}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.segments.length} segment{booking.segments.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Booked on: {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            ₹{booking.price_inr.toLocaleString()}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hotel Bookings */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hotels</h3>
              {bookings.hotels.length === 0 ? (
                <p className="text-gray-500">No hotel bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.hotels.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">Booking ID: {booking.booking_id}</p>
                          <p className="text-sm text-gray-600 mt-1">{booking.hotel.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Booked on: {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary-600">
                            ₹{booking.price_inr.toLocaleString()}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'insights' && feedbackInsights && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Feedback & Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-6 w-6 text-primary-600" />
                  <p className="text-sm text-primary-700">Average Rating</p>
                </div>
                <p className="text-4xl font-bold text-primary-900">
                  {feedbackInsights.average_rating.toFixed(1)}
                </p>
                <p className="text-sm text-primary-700 mt-1">
                  Based on {feedbackInsights.total_feedbacks} review{feedbackInsights.total_feedbacks !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
                <p className="text-sm text-secondary-700 mb-3">Insights</p>
                {feedbackInsights.insights.length === 0 ? (
                  <p className="text-secondary-900">No insights yet. Leave more feedback to get personalized recommendations!</p>
                ) : (
                  <ul className="space-y-2">
                    {feedbackInsights.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-secondary-900">• {insight}</li>
                    ))}
                  </ul>
                )}
              </div>
              </div>

            {/* Recent Feedback */}
            {feedbackInsights.recent_feedbacks && feedbackInsights.recent_feedbacks.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Recent Feedback</h3>
                <div className="space-y-3">
                  {feedbackInsights.recent_feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900">{feedback.booking_ref}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {feedback.comments && (
                        <p className="text-sm text-gray-600">{feedback.comments}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Preferences</h2>
            <p className="text-gray-600">These preferences are automatically learned from your feedback and booking history.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Price Sensitivity</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(preferences.price_sensitivity || 0.5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {preferences.price_sensitivity > 0.7 ? 'High' : preferences.price_sensitivity > 0.4 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Comfort Preference</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary-500 h-2 rounded-full"
                      style={{ width: `${(preferences.comfort_preference || 0.5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {preferences.comfort_preference > 0.7 ? 'High' : preferences.comfort_preference > 0.4 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>

              {preferences.preferred_airlines && Object.keys(preferences.preferred_airlines).length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Preferred Airlines</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(preferences.preferred_airlines).map(([airline, score]) => (
                      <span
                        key={airline}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {airline} ({(score * 5).toFixed(1)}★)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {preferences.avoid_hotel_chains && preferences.avoid_hotel_chains.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Hotels to Avoid</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.avoid_hotel_chains.map((chain) => (
                      <span
                        key={chain}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Based on your feedback</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage