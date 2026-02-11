import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { CampaignsPage } from '@/pages/CampaignsPage';
import { CharacterSheetPage } from '@/pages/CharacterSheetPage';
import { CharacterCreatePage } from '@/pages/CharacterCreatePage';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="font-display text-2xl text-parchment-100 font-bold tracking-wider">AETHERMOOR</div>
          <p className="text-parchment-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/character/create" element={<CharacterCreatePage />} />
        <Route path="/character/create/:campaignId" element={<CharacterCreatePage />} />
        <Route path="/character/demo" element={<CharacterSheetPage />} />
        <Route path="/character/:id" element={<CharacterSheetPage />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-ink-900">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
