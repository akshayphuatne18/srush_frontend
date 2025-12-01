import React from 'react'
import { Link } from 'react-router-dom'
import { Plane, Hotel, Map, Sparkles, CheckCircle, MessageCircle } from 'lucide-react'

const Home = ({ user }) => {
  const features = [
    {
      icon: Plane,
      title: 'Smart Flight Search',
      description: 'Find direct or connecting flights across India with AI-powered recommendations'
    },
    {
      icon: Hotel,
      title: 'Hotel Booking',
      description: 'Discover perfect accommodations tailored to your preferences and budget'
    },
    {
      icon: Map,
      title: 'Complete Itineraries',
      description: 'Get multi-day trip plans with flights, hotels, and daily activities'
    },
    {
      icon: Sparkles,
      title: 'Seasonal Recommendations',
      description: 'AI suggests best destinations based on season and travel month'
    },
    {
      icon: CheckCircle,
      title: 'Easy Seat Selection',
      description: 'Choose your perfect seat with interactive seat maps'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Talk naturally with our AI to plan your entire trip'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-header text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Intelligent Travel Companion
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Plan perfect trips with AI-powered flight and hotel booking for domestic India travel
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Everything You Need to Travel
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            FlyMate7 combines AI intelligence with personalized recommendations to make travel planning effortless
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="p-6 bg-gradient-card rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tell Us Your Plans</h3>
              <p className="text-gray-600">
                Chat with our AI assistant or use the search form to describe your trip
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-secondary-600">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Smart Suggestions</h3>
              <p className="text-gray-600">
                AI analyzes your preferences, budget, and season to recommend perfect options
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Book & Travel</h3>
              <p className="text-gray-600">
                Select seats, confirm bookings, and receive tickets via email instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of travelers who trust FlyMate7 for their domestic India trips
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold text-white">FlyMate7</span>
          </div>
          <p className="mb-4">Your AI-powered travel assistant for domestic India journeys</p>
          <p className="text-sm">© 2024 FlyMate7. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home