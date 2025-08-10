import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ComparePage from '@/pages/ComparePage';
import AboutPage from '@/pages/AboutPage';
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import RealTimePolicyPage from '@/pages/RealTimePolicyPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';
import FeedbackPage from '@/pages/FeedbackPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import HotDealsPage from '@/pages/deals/HotDealsPage';
import SupermarketDealsPage from '@/pages/deals/SupermarketDealsPage';
import GiftcardsDealsPage from '@/pages/deals/GiftcardsDealsPage';
import FavoriteStoresPage from '@/pages/deals/FavoriteStoresPage';
import NotificationsPage from '@/pages/NotificationsPage';
import './styles/globals.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // AGUARDAR MAIS TEMPO PARA CARREGAR
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // VERIFICAR SE TEM USER OU DADOS NO LOCALSTORAGE
  const storedUser = localStorage.getItem('snapgain_user');
  
  if (!user && !storedUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignupPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/realtime-policy" element={<RealTimePolicyPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

                  {/* Deals Routes */}
                  <Route path="/deals/hot" element={<ProtectedRoute><HotDealsPage /></ProtectedRoute>} />
                  <Route path="/deals/supermarket" element={<ProtectedRoute><SupermarketDealsPage /></ProtectedRoute>} />
                  <Route path="/deals/giftcards" element={<ProtectedRoute><GiftcardsDealsPage /></ProtectedRoute>} />
                  <Route path="/deals/favorites" element={<ProtectedRoute><FavoriteStoresPage /></ProtectedRoute>} />

                  {/* Catch All */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;