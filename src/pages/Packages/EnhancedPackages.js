import React, { useState, useEffect } from 'react';
import { Package, MessageCircle, Star, QrCode, MapPin, Clock, User, ChevronRight } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedChatWindow from '../../components/Chat/EnhancedChatWindow';
import RatingReviewModal from '../../components/Rating/RatingReviewModal';
import PackageTracker from '../../components/Tracking/PackageTracker';
import toast from 'react-hot-toast';

const EnhancedPackages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);

  useEffect(() => {
    if (!user) return;

    const packagesRef = collection(db, 'packages');
    const q = query(
      packagesRef,
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const packagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPackages(packagesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredPackages = packages.filter(pkg => {
    switch (activeTab) {
      case 'active':
        return ['posted', 'accepted', 'picked_up', 'in_transit'].includes(pkg.status);
      case 'completed':
        return pkg.status === 'delivered';
      case 'cancelled':
        return pkg.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      'posted': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-yellow-100 text-yellow-800',
      'picked_up': 'bg-purple-100 text-purple-800',
      'in_transit': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'posted': 'Posted',
      'accepted': 'Accepted',
      'picked_up': 'Picked Up',
      'in_transit': 'In Transit',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return texts[status] || status;
  };

  const openChat = (pkg) => {
    const partnerId = pkg.customerId === user.uid ? pkg.travelerId : pkg.customerId;
    const partnerName = pkg.customerId === user.uid ? pkg.travelerName : pkg.customerName;
    
    setChatPartner({
      id: partnerId,
      name: partnerName,
      packageId: pkg.id
    });
    setSelectedPackage(pkg);
    setShowChat(true);
  };

  const openRating = (pkg) => {
    if (pkg.status !== 'delivered') {
      toast.error('Can only rate completed deliveries');
      return;
    }
    setSelectedPackage(pkg);
    setShowRating(true);
  };

  const openTracker = (pkg) => {
    setSelectedPackage(pkg);
    setShowTracker(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading your packages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Package Management</h1>
          <p className="text-gray-600">
            Track, communicate, and manage all your packages with advanced features
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Packages', count: packages.length },
                { key: 'active', label: 'Active', count: packages.filter(p => ['posted', 'accepted', 'picked_up', 'in_transit'].includes(p.status)).length },
                { key: 'completed', label: 'Completed', count: packages.filter(p => p.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: packages.filter(p => p.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Package List */}
        <div className="space-y-6">
          {filteredPackages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No packages found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You haven't posted or accepted any packages yet"
                  : `No ${activeTab} packages to display`
                }
              </p>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{pkg.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                        {getStatusText(pkg.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{pkg.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {pkg.pickupLocation} → {pkg.dropoffLocation}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Due: {new Date(pkg.deliveryDate?.toDate()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">
                          {pkg.customerId === user.uid 
                            ? `Traveler: ${pkg.travelerName || 'Not assigned'}`
                            : `Customer: ${pkg.customerName}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium text-primary-600">
                          ₹{pkg.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openTracker(pkg)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Track Package</span>
                  </button>

                  {pkg.travelerId && pkg.customerId && (
                    <button
                      onClick={() => openChat(pkg)}
                      className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat</span>
                    </button>
                  )}

                  {pkg.status === 'delivered' && (
                    <button
                      onClick={() => openRating(pkg)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Star className="h-4 w-4" />
                      <span>Rate & Review</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showChat && chatPartner && (
        <EnhancedChatWindow
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setChatPartner(null);
          }}
          partnerId={chatPartner.id}
          partnerName={chatPartner.name}
          packageId={chatPartner.packageId}
        />
      )}

      {showRating && selectedPackage && (
        <RatingReviewModal
          isOpen={showRating}
          onClose={() => {
            setShowRating(false);
            setSelectedPackage(null);
          }}
          targetUser={{
            id: selectedPackage.customerId === user.uid ? selectedPackage.travelerId : selectedPackage.customerId,
            name: selectedPackage.customerId === user.uid ? selectedPackage.travelerName : selectedPackage.customerName
          }}
          packageInfo={selectedPackage}
          type={selectedPackage.customerId === user.uid ? 'delivery' : 'customer'}
        />
      )}

      {showTracker && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Package Tracker</h2>
              <button
                onClick={() => {
                  setShowTracker(false);
                  setSelectedPackage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <PackageTracker 
                packageId={selectedPackage.id}
                userRole={selectedPackage.customerId === user.uid ? 'customer' : 'traveler'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPackages;
