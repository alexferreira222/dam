import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBruifXndY5sfmUQPNnmrfdS_Xv9qWl8ew",
  authDomain: "campusflow-b41cf.firebaseapp.com",
  projectId: "campusflow-b41cf",
  storageBucket: "campusflow-b41cf.firebasestorage.app",
  messagingSenderId: "18334003023",
  appId: "1:18334003023:web:a9d100f053013ddc445f3a",
  measurementId: "G-9G28FY75MS"
};

// Inicializa a aplicação
const app = initializeApp(firebaseConfig);

// EXPORTAÇÕES OBRIGATÓRIAS (É aqui que a tua app estava a falhar)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;