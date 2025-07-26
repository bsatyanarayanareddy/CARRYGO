# CarryGo - Peer2Parcel Delivery Platform

CarryGo is a revolutionary peer-to-peer package delivery platform that connects travelers with customers, enabling a crowd-sourced, cost-effective, and real-time delivery network.

## 🚀 Phase 1 Features (Current)

### ✅ Completed Features
- **Authentication System**: Google & Email/Password login
- **User Registration**: Role selection (Customer/Traveler)
- **Firebase Integration**: Firestore database setup
- **Responsive Design**: Modern UI with Tailwind CSS
- **User Dashboard**: Role-based dashboard views
- **Profile Management**: User profile display
- **Navigation**: Protected routes and authentication guards

### 🔧 Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- A Firebase account

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd carrygo
npm install
```

### 2. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Email/Password and Google authentication

3. **Create Firestore Database**:
   - Go to Firestore Database > Create database
   - Choose "Start in test mode" (we'll secure it later)
   - Select a location closest to your users

4. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Web" icon to create a web app
   - Copy the configuration object

### 3. Environment Configuration

1. **Create Environment File**:
   ```bash
   copy .env.example .env
   ```

2. **Update Firebase Configuration**:
   Open `.env` file and replace the placeholder values with your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

3. **Update Firebase Config File**:
   Edit `src/firebase/config.js` and replace the placeholder config with your actual Firebase configuration.

### 4. Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## 🎯 How to Use (Phase 1)

### For New Users:
1. **Register**: Go to `/register` and create an account
2. **Choose Role**: Select either "Customer" (send packages) or "Traveler" (deliver packages)
3. **Complete Profile**: Fill in your details
4. **Explore Dashboard**: Access role-specific features

### For Customers:
- View dashboard with package statistics
- Access profile management
- Prepare for package posting (Phase 2)

### For Travelers:
- View dashboard with earnings potential
- Access profile and rating system
- Prepare for route matching (Phase 3)

## 🗂️ Project Structure

```
carrygo/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Navbar.js
│   │   └── UI/
│   │       └── LoadingSpinner.js
│   ├── firebase/
│   │   └── config.js
│   ├── hooks/
│   │   └── useUserProfile.js
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── Packages/
│   │   │   ├── PackageForm.js
│   │   │   └── PackageList.js
│   │   ├── Profile/
│   │   │   └── Profile.js
│   │   ├── Traveler/
│   │   │   └── TravelerDashboard.js
│   │   └── Home.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛡️ Security Considerations

### Firestore Security Rules (Add these in Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Packages - customers can create, all authenticated users can read
    match /packages/{packageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.customerId;
    }
    
    // Deliveries - involved parties can read/write
    match /deliveries/{deliveryId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.customerId || 
         request.auth.uid == resource.data.travelerId);
    }
  }
}
```

## 🚧 Upcoming Phases

### Phase 2: Core Features (Next)
- Package posting form with validation
- Package listing and management
- Basic search and filtering
- Notification system setup

### Phase 3: Maps Integration
- Google Maps API integration
- Route input and visualization
- Smart package-route matching
- Location-based services

### Phase 4: Real-time Features
- Live GPS tracking
- Real-time notifications
- WebSocket implementation
- Delivery status updates

### Phase 5: Advanced Features
- Payment gateway integration
- Rating and review system
- Loyalty points and rewards
- Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

---

**CarryGo** - Turning your journey into opportunity! 🚀
