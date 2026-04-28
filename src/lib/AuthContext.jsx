import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Auth Request para Build Nativo (Sem Proxy)
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "328194366476-frdlmfr26r74gb85e2ph1354iv9u968u.apps.googleusercontent.com",
    webClientId: "328194366476-8quic3bo20qvd69fkhu5i5b8en1f0h1p.apps.googleusercontent.com",
  }, {
    native: "com.cloudflow.app:/oauthredirect",
  });

  // Log de diagnóstico para o terminal
  useEffect(() => {
    if (response) {
      console.log("[Auth] Tipo de Resposta:", response.type);
      if (response.type === 'error') console.log("[Auth] Erro detalhado:", response.error);
    }
  }, [response]);

  // Log para sabermos o URL exato de redirecionamento
  useEffect(() => {
    if (request) {
      console.log("[Auth] Colar este URL no Google Cloud (Web Client ID):", request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, authentication } = response.params;
      // Tenta usar o id_token primeiro, se não houver, tenta o access_token do objeto authentication
      const token = id_token || authentication?.idToken;

      if (token) {
        console.log("[Auth] Token recebido, iniciando sessão no Firebase...");
        const credential = GoogleAuthProvider.credential(token);
        signInWithCredential(auth, credential)
          .then(() => {
            console.log("[Auth] Sessão iniciada com sucesso!");
            WebBrowser.dismissBrowser(); // Força o fecho do navegador
          })
          .catch(err => {
            console.error("[Auth] Firebase Google Login Error:", err);
          });
      }
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          const extraData = userDoc.exists() ? userDoc.data() : null;

          const finalUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            full_name: firebaseUser.displayName || (extraData ? extraData.full_name : '') || '',
            role: (extraData ? extraData.role : 'user') || 'user',
            points: (extraData ? extraData.points : 0) || 0,
            level: (extraData ? extraData.level : 1) || 1,
            total_checkins: (extraData ? extraData.total_checkins : 0) || 0,
            badges: (extraData ? extraData.badges : []) || [],
            user_type: (extraData ? extraData.user_type : 'Aluno') || 'Aluno',
            course: (extraData ? extraData.course : '') || '',
            favorites: (extraData ? extraData.favorites : []) || [],
          };

          setUser(finalUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[Auth] Error in callback:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("[Auth] Google Prompt Error:", error);
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
      favorites: [],
    });
  };

  const logout = () => signOut(auth);

  const updateMe = async (data) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'users', auth.currentUser.uid), data);
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateMe,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
