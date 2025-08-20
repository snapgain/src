import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { useToast } from './hooks/use-toast'; // ✅ ADICIONAR
import { ToastContainer } from './components/ui/toast'; // ✅ ADICIONAR
import { useAuth } from "@/contexts/AuthContext";
import Maintenance from "@/pages/Maintenance";
import { RequireAuth, AppRouter } from './App';

// Import pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ComparePage from '@/pages/ComparePage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

// Import deals pages
import HotDealsPage from './pages/deals/HotDealsPage';
import SupermarketDealsPage from './pages/deals/SupermarketDealsPage';
import GiftCardDealsPage from './pages/deals/GiftcardsDealsPage';
import FavoriteStoresPage from './pages/deals/FavoriteStoresPage';

// ✅ ADICIONAR IMPORTS DAS PÁGINAS EXISTENTES:
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';
import FeedbackPage from '@/pages/FeedbackPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import RealTimePolicyPage from '@/pages/RealTimePolicyPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/globals.css';


export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
}

// ✅ Gate: se manutenção ON e user NÃO logado → mostra Maintenance
function PublicGate({ children }) {
  const { user } = useAuth();
  const MAINT = import.meta.env.VITE_MAINTENANCE_MODE === "1";
  if (MAINT && !user) return <Maintenance />;
  return children;
}

export  function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas (agora gated) */}
        <Route
          path="/"
          element={
            <PublicGate>
              <HomePage />
            </PublicGate>
          }
        />
        <Route
          path="/features"
          element={
            <PublicGate>
              <FeaturesPage />
            </PublicGate>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicGate>
              <PricingPage />
            </PublicGate>
          }
        />
        <Route
          path="/about"
          element={
            <PublicGate>
              <AboutPage />
            </PublicGate>
          }
        />

        {/* Auth (deixa livre para a equipa entrar) */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        {/* Aliases antigos (se existirem) */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />

        {/* Membros */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/compare"
          element={
            <RequireAuth>
              <ComparePage />
            </RequireAuth>
          }
        />

        {/* 404 opcional */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
// ✅ WRAPPER COMPONENT PARA TOASTS
function AppWithToasts() {
  const { toasts, dismiss } = useToast();
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ ADICIONAR ROTAS DAS PÁGINAS EXISTENTES */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/realtime-policy" element={<RealTimePolicyPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/compare" element={
          <ProtectedRoute>
            <ComparePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* Deals Routes */}
        <Route path="/deals/hot" element={
          <ProtectedRoute>
            <HotDealsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/deals/supermarket" element={
          <ProtectedRoute>
            <SupermarketDealsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/deals/giftcards" element={
          <ProtectedRoute>
            <GiftCardDealsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/deals/favorite-stores" element={
          <ProtectedRoute>
            <FavoriteStoresPage />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* ✅ TOAST CONTAINER */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppWithToasts />
      </ProfileProvider>
    </AuthProvider>
  );
}


export default App;