import React from 'react'
import { Hotel, MapPin, Star, Wifi, Coffee } from 'lucide-react'

const HotelCard = ({ hotel, onBook, compact = false }) => {
  const amenities = {
    wifi: { icon: Wifi, label: 'WiFi' },
    pool: { icon: Coffee, label: 'Pool' },
    breakfast: { icon: Coffee, label: 'Breakfast' }
  }

  const getAmenityIcons = () => {
    const icons = []
    if (hotel.has_wifi) icons.push('wifi')
    if (hotel.has_pool) icons.push('pool')
    if (hotel.has_breakfast) icons.push('breakfast')

    // Remove gym because we removed the icon
    return icons
  }

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Hotel className="h-5 w-5 text-secondary-600" />
            <h3 className="font-bold text-lg text-gray-900">{hotel.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{hotel.city}</span>
          </div>

          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(hotel.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({hotel.rating})</span>
          </div>

          {!compact && (
            <>
              <p className="text-sm text-gray-600 mb-3">{hotel.type}</p>

              <div className="flex flex-wrap gap-2">
                {getAmenityIcons().map((amenity) => {
                  const AmenityIcon = amenities[amenity].icon
                  return (
                    <div
                      key={amenity}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      <AmenityIcon className="h-3 w-3" />
                      <span>{amenities[amenity].label}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div className="text-right ml-4">
          <p className="text-sm text-gray-500">per night</p>
          <p className="text-2xl font-bold text-secondary-600">
            ₹{hotel.price_per_night?.toLocaleString()}
          </p>
          {hotel.nights && (
            <p className="text-sm text-gray-600 mt-1">
              {hotel.nights} night{hotel.nights > 1 ? 's' : ''}
            </p>
          )}
          {hotel.total_price && (
            <p className="text-lg font-semibold text-gray-900 mt-1">
              Total: ₹{hotel.total_price.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {onBook && (
        <button
          onClick={() => onBook(hotel)}
          className="w-full py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Select Hotel
        </button>
      )}
    </div>
  )
}

export default HotelCard
