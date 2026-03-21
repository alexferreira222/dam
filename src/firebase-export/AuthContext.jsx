// src/lib/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Carrega dados extra do Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const extraData = userDoc.exists() ? userDoc.data() : {};
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || extraData.full_name || '',
          role: extraData.role || 'user',
          points: extraData.points || 0,
          level: extraData.level || 1,
          total_checkins: extraData.total_checkins || 0,
          badges: extraData.badges || [],
          user_type: extraData.user_type || 'Aluno',
          course: extraData.course || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Cria documento do utilizador se não existir
    const userRef = doc(db, 'users', result.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        full_name: result.user.displayName,
        email: result.user.email,
        role: 'user',
        points: 0,
        level: 1,
        total_checkins: 0,
        badges: [],
        user_type: 'Aluno',
        course: '',
        created_date: new Date().toISOString(),
      });
    }
  };

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = async (email, password, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    await setDoc(doc(db, 'users', result.user.uid), {
      full_name: fullName,
      email,
      role: 'user',
      points: 0,
      level: 1,
      total_checkins: 0,
      badges: [],
      user_type: 'Aluno',
      course: '',
      created_date: new Date().toISOString(),
    });
  };

  const logout = () => signOut(auth);

  const updateMe = async (data) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout, updateMe }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);