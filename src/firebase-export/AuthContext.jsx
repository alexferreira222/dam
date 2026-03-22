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
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnapshot = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Se o utilizador sair, limpamos o snapshot e o estado
      if (unsubSnapshot) unsubSnapshot();

      if (firebaseUser) {
        // Criamos um "ouvinte" (Snapshot) em tempo real para os dados do utilizador
        unsubSnapshot = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          const extraData = docSnap.exists() ? docSnap.data() : {};
          
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
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
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
    // Aqui atualizamos o Firestore; o onSnapshot tratará de atualizar o estado local 'user'
    await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout, updateMe }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);