# Quick Start Guide - CloudFlow React Native

## 🚀 Start Developing Now

### Step 1: Start the Expo Development Server
```bash
cd c:\Users\Alex\Desktop\CloudFlow
npm start
```

You should see:
```
> Starting Expo...
Starting packager...
Opening on Android...
```

### Step 2: Run on Your Device/Emulator

#### Option A: Android Emulator/Device
```bash
npm run android
```

#### Option B: iOS Simulator/Device  
```bash
npm run ios
```

#### Option C: Expo Go App (Fastest for Testing)
1. Install Expo Go on your phone from App Store or Google Play
2. Scan the QR code from the terminal
3. App opens instantly on your phone

---

## ✅ What's Been Fixed

1. **App.jsx** - Removed all web code (React Router, etc.)
2. **Firebase Config** - Works with Expo (using expo-constants)
3. **Dependencies** - All React Navigation packages installed and compatible
4. **Babel Config** - Configured for .native.jsx file resolution
5. **node_modules** - Cleaned and reinstalled

---

## 🧪 First Test

When the app starts, you should see:

1. **Login Screen** 
   - Shows CloudFlow logo
   - Email/Password login fields
   - Google login button
   - Error handling for auth

2. **After Login - Dashboard**
   - Bottom tab navigation
   - Venue list/cards
   - Dashboard, Favorites, Ranking, Profile tabs

---

## 📱 Testing the Full Flow

### Test Authentication
```
1. Login with email/password
2. Verify you're redirected to Dashboard
3. Check user profile loads in Perfil tab
4. Test logout
5. Verify redirect to login
```

### Test Navigation
```
1. Click each tab (Dashboard, Favoritos, Ranking, Perfil, Admin)
2. Test back button
3. Click venue to see details
4. Return to dashboard
```

### Test Data Loading
```
1. Check Dashboard shows venues
2. Check Ranking shows leaderboard
3. Check Perfil shows user badges/level
4. Check Favoritos shows saved venues
```

---

## 🐛 Troubleshooting

### "Cannot find module '@react-navigation'"
**Solution**: Run `npm install` again
```bash
npm install
```

### Port 8081 already in use
**Solution**: Kill the process or use a different port
```bash
npm start -- --port 8082
```

### "Firebase config error"
**Solution**: Check that .env.local exists with Firebase credentials
```
The app has fallback Firebase config, so it should work even without .env.local
```

### App won't reload
**Solution**: 
1. Press `r` in the terminal to reload
2. Or reload in Expo Go app

---

## 📊 Verification Checklist

Before considering the app "working":

- [ ] App starts without errors
- [ ] Login screen displays correctly
- [ ] Can type in email/password fields
- [ ] Tabs at bottom are clickable
- [ ] Navigation between screens works
- [ ] No red error screens
- [ ] Console shows no critical errors

---

## 📁 Important Files

- **Entry Point**: `index.js`
- **Main App**: `src/App.jsx`  
- **Navigation**: `src/navigation/RootNavigator.jsx`
- **Auth**: `src/lib/AuthContext.jsx` & `src/lib/firebase.js`
- **Config**: `app.json`, `babel.config.js`, `package.json`

---

## 🔧 Development Tips

### Hot Reload
The app auto-reloads when you save files. If not:
- Press `r` in terminal
- Or shake device and select "Reload"

### Debugging
React Native has built-in debugging. In Expo:
- Press `d` in terminal for debugger options
- Use Chrome DevTools (press `shift+j`)

### Building for Production
When ready to ship:
```bash
npm run build:android  # or
npm run build:ios
```

---

## 📚 Next Steps

1. **Get it running** - Follow steps above
2. **Test the flows** - Use testing checklist  
3. **Review code** - Check native components in `src/firebase-export/*.native.jsx`
4. **Customize** - Build your features
5. **Deploy** - Use EAS Build for production

---

## 💡 Remember

- This is a **React Native** app (mobile)
- Not a web app - use native APIs only
- Web components are in different files (ignored by mobile build)
- All data comes from Firebase
- Authentication is managed by FirebaseAuth

---

**You're all set!** 🎉

Run `npm start` and see your CloudFlow mobile app come to life.

