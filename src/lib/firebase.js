import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration from environment variables
// For Expo, use expo-constants to access environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY || 'AIzaSyBruifXndY5sfmUQPNnmrfdS_Xv9qWl8ew',
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || 'campusflow-b41cf.firebaseapp.com',
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || 'campusflow-b41cf',
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || 'campusflow-b41cf.firebasestorage.app',
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || '18334003023',
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID || '1:18334003023:web:a9d100f053013ddc445f3a',
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
