import React from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = ({ user, userProfile }) => {
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading profile...</h2>
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-primary-100 capitalize">{userProfile.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-gray-800">{userProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-gray-800">{userProfile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">KYC Status</label>
                      <p className={`font-medium ${
                        userProfile.kycStatus === 'verified' ? 'text-green-600' : 
                        userProfile.kycStatus === 'pending' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {userProfile.kycStatus || 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Statistics</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-gray-600">Rating</label>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.rating || 0}/5</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-gray-600">Total Deliveries</label>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.totalDeliveries || 0}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm text-gray-600">Points Earned</label>
                    <p className="text-2xl font-bold text-gray-800">{userProfile.points || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
