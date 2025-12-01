import React from 'react'
import { Plane, Clock, Calendar, Users, ArrowRight } from 'lucide-react'

const FlightCard = ({ flight, onBook, compact = false }) => {
  const isConnecting = flight.type === 'connecting'
  const firstSegment = flight.segments[0]
  const lastSegment = flight.segments[flight.segments.length - 1]

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Plane className="h-5 w-5 text-primary-600" />
            <span className="font-semibold text-gray-900">{firstSegment.airline}</span>
          </div>
          <p className="text-sm text-gray-500">{firstSegment.flight_number}</p>
          {isConnecting && (
            <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              1 Stop ({flight.layover_hours}h layover)
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">₹{flight.total_price?.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{flight.travel_class}</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="space-y-3">
        {flight.segments.map((segment, idx) => (
          <div key={idx}>
            {idx > 0 && (
              <div className="flex items-center justify-center py-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-3 text-xs text-gray-500">Layover: {flight.layover_hours}h</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900">{segment.origin_code}</p>
                <p className="text-sm text-gray-600">{segment.origin}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {segment.departure_time}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">{segment.duration}</p>
              </div>

              <div className="flex-1 text-right">
                <p className="text-lg font-bold text-gray-900">{segment.dest_code}</p>
                <p className="text-sm text-gray-600">{segment.destination}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {segment.arrival_time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              <Calendar className="inline h-4 w-4 mr-1" />
              {flight.date}
            </span>
            <span>
              <Users className="inline h-4 w-4 mr-1" />
              {flight.passengers} passenger{flight.passengers > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Book Button */}
      {onBook && (
        <button
          onClick={() => onBook(flight)}
          className="mt-4 w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Select Flight
        </button>
      )}
    </div>
  )
}

export default FlightCard