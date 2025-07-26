# CarryGo Setup Instructions

## Prerequisites Installation

### 1. Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version for Windows
3. Run the installer and follow the setup wizard
4. Restart your terminal after installation

### 2. Verify Installation
Open a new PowerShell window and run:
```powershell
node --version
npm --version
```

### 3. Install Project Dependencies
Once Node.js is installed, run:
```powershell
cd c:\Users\Satti\Desktop\carrygo
npm install
```

### 4. Set up Firebase
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database in test mode
5. Get your config from Project Settings > General > Your apps

### 5. Configure Environment
1. Copy `.env.example` to `.env`
2. Update the Firebase configuration in `.env`
3. Update `src/firebase/config.js` with your Firebase config

### 6. Start Development Server
```powershell
npm start
```

## Alternative: Use Online Development Environment

If you prefer not to install Node.js locally, you can use:
- CodeSandbox (https://codesandbox.io/)
- Replit (https://replit.com/)
- GitPod (https://gitpod.io/)

Just upload the project files to any of these platforms and they'll handle the Node.js environment for you.

## Next Steps After Setup

1. Test the authentication system
2. Create test user accounts
3. Explore the dashboard features
4. Review the codebase structure
5. Plan Phase 2 development

## Need Help?

If you encounter any issues:
1. Check that Node.js is properly installed
2. Ensure all environment variables are set
3. Verify Firebase project configuration
4. Check the browser console for errors

Contact for support: [Add your contact information]
