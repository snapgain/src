import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';

import { useToast } from './hooks/use-toast';
import { ToastContainer } from './components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';

// Páginas públicas
import LandingPage from '@/pages/LandingPage';
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

// Auth
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Membros
import DashboardPage from '@/pages/DashboardPage';
import ComparePage from '@/pages/ComparePage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

// Deals (membros)
import HotDealsPage from './pages/deals/HotDealsPage';
import SupermarketDealsPage from './pages/deals/SupermarketDealsPage';
import GiftCardDealsPage from './pages/deals/GiftcardsDealsPage';
import FavoriteStoresPage from './pages/deals/FavoriteStoresPage';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';

// Página de manutenção (cria em src/pages/Maintenance.jsx)
import Maintenance from '@/pages/Maintenance';

import './styles/globals.css';

// ---------- PublicGate: se manutenção ON e user NÃO logado → mostra Maintenance ----------
function PublicGate({ children }) {
  const { user } = useAuth();
  const MAINT = import.meta.env.VITE_MAINTENANCE_MODE === '1';
  if (MAINT && !user) return <Maintenance />;
  return children;
}

// ---------- App com Toasts e Router único ----------
function AppWithToasts() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      <Router>
        <Routes>
          {/* ROTAS PÚBLICAS (GATED) */}
          <Route path="/" element={<PublicGate><LandingPage /></PublicGate>} />
          <Route path="/features" element={<PublicGate><FeaturesPage /></PublicGate>} />
          <Route path="/pricing" element={<PublicGate><PricingPage /></PublicGate>} />
          <Route path="/about" element={<PublicGate><AboutPage /></PublicGate>} />
          <Route path="/faq" element={<PublicGate><FAQPage /></PublicGate>} />
          <Route path="/contact" element={<PublicGate><ContactPage /></PublicGate>} />
          <Route path="/feedback" element={<PublicGate><FeedbackPage /></PublicGate>} />
          <Route path="/privacy" element={<PublicGate><PrivacyPage /></PublicGate>} />
          <Route path="/terms" element={<PublicGate><TermsPage /></PublicGate>} />
          <Route path="/disclaimer" element={<PublicGate><DisclaimerPage /></PublicGate>} />
          <Route path="/realtime-policy" element={<PublicGate><RealTimePolicyPage /></PublicGate>} />

          {/* AUTH (sempre acessível) */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          {/* Aliases antigos */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />

          {/* ROTAS PROTEGIDAS (ÁREA DE MEMBROS) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Deals */}
          <Route path="/deals/hot" element={<ProtectedRoute><HotDealsPage /></ProtectedRoute>} />
          <Route path="/deals/supermarket" element={<ProtectedRoute><SupermarketDealsPage /></ProtectedRoute>} />
          <Route path="/deals/giftcards" element={<ProtectedRoute><GiftCardDealsPage /></ProtectedRoute>} />
          <Route path="/deals/favorite-stores" element={<ProtectedRoute><FavoriteStoresPage /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

// ---------- App (providers) ----------
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
