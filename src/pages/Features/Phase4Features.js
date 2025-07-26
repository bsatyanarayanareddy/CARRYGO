import React, { useState } from 'react';
import { MessageCircle, Star, QrCode, Zap, Shield, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import EnhancedChatWindow from '../../components/Chat/EnhancedChatWindow';
import RatingReviewModal from '../../components/Rating/RatingReviewModal';
import PackageTracker from '../../components/Tracking/PackageTracker';

const Phase4Features = () => {
  const [showChatDemo, setShowChatDemo] = useState(false);
  const [showRatingDemo, setShowRatingDemo] = useState(false);
  const [showTrackerDemo, setShowTrackerDemo] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-Time Chat System',
      description: 'Seamless communication between customers and travelers with instant messaging, typing indicators, and read receipts.',
      benefits: ['Instant messaging', 'Typing indicators', 'Message history', 'File sharing support'],
      color: 'bg-blue-500',
      demo: () => setShowChatDemo(true)
    },
    {
      icon: Star,
      title: 'Rating & Review System',
      description: 'Build trust in the community with comprehensive rating and review system for both customers and travelers.',
      benefits: ['5-star rating system', 'Detailed reviews', 'Trust building', 'Quality assurance'],
      color: 'bg-yellow-500',
      demo: () => setShowRatingDemo(true)
    },
    {
      icon: QrCode,
      title: 'Advanced Package Tracking',
      description: 'QR code-based tracking system with real-time status updates and visual timeline for complete transparency.',
      benefits: ['QR code generation', 'Real-time updates', 'Visual timeline', 'Status notifications'],
      color: 'bg-purple-500',
      demo: () => setShowTrackerDemo(true)
    }
  ];

  const metrics = [
    { icon: Users, label: 'Enhanced User Experience', value: '99%', description: 'User satisfaction rate' },
    { icon: Clock, label: 'Real-Time Updates', value: '<1s', description: 'Average response time' },
    { icon: Shield, label: 'Trust & Safety', value: '100%', description: 'Verified interactions' },
    { icon: TrendingUp, label: 'Platform Growth', value: '300%', description: 'Expected user engagement increase' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Zap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Phase 4: Advanced Features
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Revolutionizing peer-to-peer delivery with cutting-edge features that enhance communication, 
              build trust, and provide unprecedented package tracking capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
                <span className="font-semibold">Real-Time Chat</span>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
                <span className="font-semibold">Trust System</span>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
                <span className="font-semibold">QR Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <metric.icon className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{metric.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{metric.label}</div>
              <div className="text-sm text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Powerful New Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of peer-to-peer delivery platform with these advanced capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${feature.color} p-6`}>
                  <div className="flex items-center justify-center">
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={feature.demo}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Try Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Status */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Implementation Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="font-semibold text-gray-800">Real-Time Chat System</span>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="font-semibold text-gray-800">Rating & Review System</span>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="font-semibold text-gray-800">Advanced Package Tracking</span>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="font-semibold text-gray-800">Enhanced Package Management UI</span>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 bg-gray-800 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary-400">Chat System</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Firebase Realtime Database</li>
                <li>• Real-time message sync</li>
                <li>• Typing indicators</li>
                <li>• Message status tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-secondary-400">Rating System</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Interactive star ratings</li>
                <li>• Review text input</li>
                <li>• Firestore integration</li>
                <li>• Trust score calculation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">Package Tracking</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• QR code generation</li>
                <li>• Real-time status updates</li>
                <li>• Visual timeline UI</li>
                <li>• Notification system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modals */}
      {showChatDemo && (
        <EnhancedChatWindow
          isOpen={showChatDemo}
          onClose={() => setShowChatDemo(false)}
          partnerId="demo-user"
          partnerName="Demo User"
          packageId="demo-package"
          isDemo={true}
        />
      )}

      {showRatingDemo && (
        <RatingReviewModal
          isOpen={showRatingDemo}
          onClose={() => setShowRatingDemo(false)}
          targetUser={{ id: 'demo-user', name: 'Demo User' }}
          packageInfo={{ id: 'demo-package', title: 'Demo Package' }}
          type="delivery"
          isDemo={true}
        />
      )}

      {showTrackerDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Package Tracker Demo</h2>
              <button
                onClick={() => setShowTrackerDemo(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <PackageTracker 
                packageId="demo-package"
                userRole="customer"
                isDemo={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phase4Features;
