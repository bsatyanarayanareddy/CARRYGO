import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Check, AlertCircle, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const PackageTracker = ({ packageId, userRole = 'customer', isDemo = false }) => {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setPackageData({
        id: 'demo-package',
        title: 'Electronics Package',
        description: 'Laptop and accessories for delivery',
        status: 'in_transit',
        qrCode: 'DEMO-QR-12345',
        pickupLocation: 'New York, NY',
        dropoffLocation: 'Boston, MA',
        customerName: 'John Doe',
        travelerName: 'Jane Smith',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        timeline: [
          {
            status: 'posted',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            title: 'Package Posted',
            description: 'Package posted and waiting for traveler'
          },
          {
            status: 'accepted',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            title: 'Traveler Assigned',
            description: 'Jane Smith accepted the delivery request'
          },
          {
            status: 'picked_up',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            title: 'Package Picked Up',
            description: 'Package collected from pickup location'
          },
          {
            status: 'in_transit',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            title: 'In Transit',
            description: 'Package is on the way to destination',
            isActive: true
          }
        ]
      });
      setLoading(false);
      return;
    }

    if (!packageId) return;

    const packageRef = doc(db, 'packages', packageId);
    const unsubscribe = onSnapshot(packageRef, (doc) => {
      if (doc.exists()) {
        setPackageData({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [packageId, isDemo]);

  const updatePackageStatus = async (newStatus, location = null) => {
    try {
      const packageRef = doc(db, 'packages', packageId);
      const updateData = {
        status: newStatus,
        lastUpdated: serverTimestamp(),
        [`${newStatus}At`]: serverTimestamp()
      };

      if (location) {
        updateData.currentLocation = location;
      }

      await updateDoc(packageRef, updateData);
      toast.success(`Package status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating package status:', error);
      toast.error('Failed to update package status');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'posted': {
        icon: Package,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        label: 'Package Posted',
        description: 'Waiting for a traveler to accept'
      },
      'accepted': {
        icon: Check,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        label: 'Accepted',
        description: 'Traveler has accepted the package'
      },
      'picked_up': {
        icon: MapPin,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        label: 'Picked Up',
        description: 'Package has been collected'
      },
      'in_transit': {
        icon: Clock,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        label: 'In Transit',
        description: 'Package is on the way'
      },
      'delivered': {
        icon: Check,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Delivered',
        description: 'Package has been delivered successfully'
      },
      'cancelled': {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        label: 'Cancelled',
        description: 'Delivery has been cancelled'
      }
    };

    return statusMap[status] || statusMap['posted'];
  };

  const renderStatusTimeline = () => {
    const statuses = ['posted', 'accepted', 'picked_up', 'in_transit', 'delivered'];
    const currentStatusIndex = statuses.indexOf(packageData?.status || 'posted');

    return (
      <div className="space-y-4">
        {statuses.map((status, index) => {
          const statusInfo = getStatusInfo(status);
          const Icon = statusInfo.icon;
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const timestamp = packageData?.[`${status}At`];

          return (
            <div key={status} className="flex items-start space-x-4">
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted 
                  ? `border-green-500 bg-green-500 text-white` 
                  : 'border-gray-300 bg-white text-gray-400'
              }`}>
                <Icon className="h-4 w-4" />
                {index < statuses.length - 1 && (
                  <div className={`absolute top-8 left-1/2 w-0.5 h-12 transform -translate-x-1/2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`flex items-center space-x-2 ${isCurrent ? 'font-semibold' : ''}`}>
                  <h4 className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {statusInfo.label}
                  </h4>
                  {isCurrent && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {statusInfo.description}
                </p>
                {timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(timestamp.toDate()).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTravelerActions = () => {
    if (userRole !== 'traveler' || !packageData) return null;

    const { status } = packageData;

    return (
      <div className="mt-6 space-y-3">
        <h4 className="font-medium text-gray-900">Traveler Actions</h4>
        
        {status === 'accepted' && (
          <button
            onClick={() => updatePackageStatus('picked_up')}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Mark as Picked Up
          </button>
        )}
        
        {status === 'picked_up' && (
          <button
            onClick={() => updatePackageStatus('in_transit')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Start Transit
          </button>
        )}
        
        {status === 'in_transit' && (
          <button
            onClick={() => updatePackageStatus('delivered')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark as Delivered
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Package not found</p>
      </div>
    );
  }

  const currentStatus = getStatusInfo(packageData.status);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${currentStatus.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-white ${currentStatus.color}`}>
              <currentStatus.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{packageData.title}</h3>
              <p className={`text-sm ${currentStatus.color} font-medium`}>
                {currentStatus.label}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              title="Show QR Code"
            >
              <QrCode className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">From:</p>
            <p className="font-medium">{packageData.pickupLocation}</p>
          </div>
          <div>
            <p className="text-gray-600">To:</p>
            <p className="font-medium">{packageData.deliveryLocation}</p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h4 className="text-lg font-medium mb-4">Package QR Code</h4>
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCode
                value={JSON.stringify({
                  packageId: packageData.id,
                  title: packageData.title,
                  trackingCode: packageData.id.slice(-8).toUpperCase()
                })}
                size={200}
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Tracking Code: {packageData.id.slice(-8).toUpperCase()}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="p-6">
        <h4 className="font-medium text-gray-900 mb-4">Tracking Timeline</h4>
        {renderStatusTimeline()}
        {renderTravelerActions()}
      </div>

      {/* Package Details */}
      <div className="border-t p-6 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">Package Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Weight:</p>
            <p className="font-medium">{packageData.weight} kg</p>
          </div>
          <div>
            <p className="text-gray-600">Delivery Fee:</p>
            <p className="font-medium text-green-600">₹{packageData.deliveryFee}</p>
          </div>
          <div>
            <p className="text-gray-600">Deadline:</p>
            <p className="font-medium">
              {new Date(packageData.deliveryDeadline?.toDate?.() || packageData.deliveryDeadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Priority:</p>
            <p className={`font-medium capitalize ${
              packageData.priority === 'urgent' ? 'text-red-600' : 
              packageData.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
            }`}>
              {packageData.priority || 'Normal'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTracker;
