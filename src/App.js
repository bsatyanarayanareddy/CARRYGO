import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import PackageForm from './pages/Packages/PackageForm';
import PackageList from './pages/Packages/PackageList';
import EnhancedPackages from './pages/Packages/EnhancedPackages';
import TravelerDashboard from './pages/Traveler/TravelerDashboard';
import Phase4Features from './pages/Features/Phase4Features';
import Phase5Features from './pages/Features/Phase5Features';

// Hooks
import { useUserProfile } from './hooks/useUserProfile';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  if (loading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Auth error:', error);
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar user={user} userProfile={userProfile} />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/dashboard" /> : <Register />} 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard userProfile={userProfile} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile" 
                element={user ? <Profile user={user} userProfile={userProfile} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/post-package" 
                element={user ? <PackageForm user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/packages" 
                element={user ? <EnhancedPackages /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/packages-simple" 
                element={user ? <PackageList userProfile={userProfile} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/traveler" 
                element={user ? <TravelerDashboard user={user} userProfile={userProfile} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/phase4-features" 
                element={<Phase4Features />} 
              />
              <Route 
                path="/phase5-features" 
                element={<Phase5Features userProfile={userProfile} />} 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
