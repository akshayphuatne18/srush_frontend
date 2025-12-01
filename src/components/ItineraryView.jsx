import React from 'react'
import { Calendar, MapPin, Info } from 'lucide-react'
import FlightCard from './FlightCard'
import HotelCard from './HotelCard'

const ItineraryView = ({ itinerary, onSelectFlight, onSelectHotel, compact = false }) => {
  return (
    <div className={`space-y-6 ${compact ? '' : 'bg-white rounded-2xl shadow-lg p-6'}`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {itinerary.destination} Itinerary
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            <Calendar className="inline h-4 w-4 mr-1" />
            {itinerary.start_date} to {itinerary.end_date}
          </span>
          <span>
            <MapPin className="inline h-4 w-4 mr-1" />
            {itinerary.days} days, {itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Seasonal Notes */}
      {itinerary.seasonal_notes && itinerary.seasonal_notes.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">Seasonal Recommendation</p>
              {itinerary.seasonal_notes.map((note, idx) => (
                <p key={idx} className="text-sm text-yellow-800">{note}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flights */}
      {itinerary.flights && itinerary.flights.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Flight Options</h3>
          <div className="space-y-4">
            {itinerary.flights.slice(0, compact ? 2 : 5).map((flight, idx) => (
              <FlightCard
                key={idx}
                flight={flight}
                onBook={onSelectFlight}
                compact={compact}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hotels */}
      {itinerary.hotels && itinerary.hotels.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hotel Options</h3>
          <div className="space-y-4">
            {itinerary.hotels.slice(0, compact ? 2 : 5).map((hotel, idx) => (
              <HotelCard
                key={idx}
                hotel={hotel}
                onBook={onSelectHotel}
                compact={compact}
              />
            ))}
          </div>
        </div>
      )}

      {/* Daily Plan */}
      {!compact && itinerary.daily_plan && itinerary.daily_plan.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Plan</h3>
          <div className="space-y-3">
            {itinerary.daily_plan.map((day) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{day.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {day.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
                {day.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic">{day.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Summary */}
      {itinerary.budget && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Budget Summary</h4>
          <p className="text-2xl font-bold text-primary-600">
            ₹{itinerary.budget.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total estimated budget</p>
        </div>
      )}
    </div>
  )
}

export default ItineraryView