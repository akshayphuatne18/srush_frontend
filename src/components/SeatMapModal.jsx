import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { bookingAPI } from '../utils/api'

const SeatMapModal = ({ isOpen, onClose, travelClass, segments, onConfirm }) => {
  const [seatMap, setSeatMap] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadSeatMap()
    }
  }, [isOpen, travelClass])

  const loadSeatMap = async () => {
    setLoading(true)
    try {
      const response = await bookingAPI.getSeatMap(travelClass)
      setSeatMap(response.data)
    } catch (error) {
      console.error('Error loading seat map:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeatSelect = (segmentIndex, seat) => {
    if (!seat.available) return

    setSelectedSeats(prev => ({
      ...prev,
      [`segment_${segmentIndex}`]: seat.seat
    }))
  }

  const handleConfirm = () => {
    onConfirm(selectedSeats)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {segments.map((segment, segmentIdx) => (
                <div key={segmentIdx} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Flight {segmentIdx + 1}: {segment.origin} → {segment.destination}
                  </h3>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-6 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-500 text-white border border-primary-600 rounded flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 border border-gray-400 rounded"></div>
                      <span>Occupied</span>
                    </div>
                  </div>

                  {/* Seat Map */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="max-w-md mx-auto space-y-2">
                      {seatMap?.rows.map((row) => (
                        <div key={row.row_number} className="flex items-center justify-center space-x-2">
                          <span className="w-8 text-sm font-medium text-gray-600">
                            {row.row_number}
                          </span>
                          <div className="flex space-x-2">
                            {row.seats.map((seat, idx) => {
                              const isSelected = selectedSeats[`segment_${segmentIdx}`] === seat.seat
                              return (
                                <React.Fragment key={seat.seat}>
                                  {idx === 3 && <div className="w-4"></div>}
                                  <button
                                    onClick={() => handleSeatSelect(segmentIdx, seat)}
                                    disabled={!seat.available}
                                    className={`w-10 h-10 rounded text-xs font-medium transition ${
                                      isSelected
                                        ? 'bg-primary-500 text-white border-primary-600'
                                        : seat.available
                                        ? 'bg-white hover:bg-primary-50 border-gray-300'
                                        : 'bg-gray-300 border-gray-400 cursor-not-allowed'
                                    } border-2`}
                                    title={seat.type}
                                  >
                                    {isSelected ? <Check className="h-4 w-4 mx-auto" /> : seat.seat.slice(-1)}
                                  </button>
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Seat Display */}
                  {selectedSeats[`segment_${segmentIdx}`] && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg text-center">
                      <p className="text-sm text-primary-900">
                        Selected seat: <span className="font-bold">{selectedSeats[`segment_${segmentIdx}`]}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={Object.keys(selectedSeats).length !== segments.length}
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Seats
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatMapModal