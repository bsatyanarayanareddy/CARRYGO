import React, { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const RatingReviewModal = ({ 
  isOpen, 
  onClose, 
  targetUser, 
  packageInfo, 
  type = 'delivery', // 'delivery' or 'customer'
  isDemo = false
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (isDemo) {
      setLoading(true);
      setTimeout(() => {
        toast.success('Demo review submitted successfully!');
        onClose();
        setRating(0);
        setReview('');
        setLoading(false);
      }, 1000);
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        reviewerId: user.uid,
        reviewerName: user.displayName || 'Anonymous',
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
        packageId: packageInfo?.id,
        packageTitle: packageInfo?.title,
        rating,
        review: review.trim(),
        type, // 'delivery' or 'customer'
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      toast.success('Review submitted successfully!');
      onClose();
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        className={`transition-colors ${
          index < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
      >
        <Star className="h-8 w-8 fill-current" />
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rate {type === 'delivery' ? 'Delivery Experience' : 'Customer Experience'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {targetUser?.name?.charAt(0) || <User className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{targetUser?.name || 'User'}</p>
                <p className="text-sm text-gray-500">
                  {type === 'delivery' ? 'Traveler' : 'Customer'}
                </p>
              </div>
            </div>

            {/* Package Info */}
            {packageInfo && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Package:</p>
                <p className="text-sm text-blue-700">{packageInfo.title}</p>
              </div>
            )}

            {/* Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate this experience?
              </label>
              <div className="flex justify-center space-x-1">
                {renderStars()}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {rating === 1 ? 'Poor' : 
                   rating === 2 ? 'Fair' : 
                   rating === 3 ? 'Good' : 
                   rating === 4 ? 'Very Good' : 'Excellent'}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a review (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={`Share your experience with ${targetUser?.name || 'this user'}...`}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {review.length}/500 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component to display reviews
export const ReviewsList = ({ targetUserId, limit = 5 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading reviews (in real app, fetch from Firestore)
    const timer = setTimeout(() => {
      setReviews([]); // Empty for now - you can implement actual review fetching
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetUserId, limit]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No reviews yet</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {review.reviewerName?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.reviewerName || 'Anonymous'}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {review.review && (
              <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
            )}
            
            {review.packageTitle && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                Package: {review.packageTitle}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RatingReviewModal;
