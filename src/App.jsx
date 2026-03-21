import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// 1. Importar as peças do TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Login from '@/firebase-export/Login';
import Dashboard from '@/firebase-export/Dashboard';
import Perfil from '@/firebase-export/Perfil';
import Ranking from '@/firebase-export/Ranking';
import Favoritos from '@/firebase-export/Favoritos';
import VenueDetail from '@/firebase-export/VenueDetail';
import Admin from '@/firebase-export/Admin';
import MobileLayout from '@/layout/MobileLayout';
import PageNotFound from '@/lib/PageNotFound';

// 2. Inicializar o cliente fora do componente para evitar recriações desnecessárias
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita chamadas extra ao Firebase ao mudar de aba
      retry: 1,
    },
  },
});

function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MobileLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="favoritos" element={<Favoritos />} />
          <Route path="venue/:id" element={<VenueDetail />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    // 3. O QueryClientProvider deve ser o "pai" de todos para o Dashboard funcionar
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}