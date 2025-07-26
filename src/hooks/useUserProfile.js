import { useState, useEffect } from 'react';
import { getUserProfile } from '../firebase/config';

export const useUserProfile = (uid) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching user profile for UID:', uid);
        const profile = await getUserProfile(uid);
        console.log('User profile fetched:', profile);
        setUserProfile(profile);
        
        // If no profile exists, create a default one
        if (!profile) {
          console.log('No profile found, user may need to complete registration');
          setUserProfile({
            name: 'New User',
            role: 'customer',
            email: '',
            phone: '',
            kycStatus: 'pending',
            rating: 0,
            totalDeliveries: 0,
            points: 0
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err);
        // Set a default profile on error
        setUserProfile({
          name: 'User',
          role: 'customer',
          email: '',
          phone: '',
          kycStatus: 'pending',
          rating: 0,
          totalDeliveries: 0,
          points: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  return { userProfile, loading, error };
};
