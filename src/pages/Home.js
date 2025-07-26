import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Shield, Clock, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 fade-in">
            Turn Your Journey Into 
            <span className="text-primary-600"> Opportunity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto fade-in">
            Connect travelers with customers for quick, affordable, and trusted package delivery. 
            Make money while you travel or send packages with people already heading your way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Link 
              to="/register" 
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105"
            >
              Start Earning Today
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 hover:text-white transition-all"
            >
              Send a Package
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How CarryGo Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* For Travelers */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-600 mb-6">For Travelers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Share Your Route</h4>
                    <p className="text-gray-600">Tell us where you're traveling from and to</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Pick Packages</h4>
                    <p className="text-gray-600">Choose packages that match your route</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Earn Rewards</h4>
                    <p className="text-gray-600">Get paid for successful deliveries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary-600 mb-6">For Customers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Post Your Package</h4>
                    <p className="text-gray-600">Describe what you want to send and where</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Find a Traveler</h4>
                    <p className="text-gray-600">Connect with verified travelers on your route</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Track Delivery</h4>
                    <p className="text-gray-600">Monitor your package in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose CarryGo?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your packages delivered faster than traditional shipping services
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                All travelers are verified and packages are insured for your peace of mind
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cost Effective</h3>
              <p className="text-gray-600">
                Save money on shipping costs while supporting fellow travelers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers and customers who trust CarryGo for their delivery needs
          </p>
          <Link 
            to="/register" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Join CarryGo Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
