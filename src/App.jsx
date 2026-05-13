import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import SettingsPage from '@/pages/SettingsPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import StoreDetailPage from '@/pages/StoreDetailPage';
import ComparePage from '@/pages/ComparePage';
import StrategyPage from '@/pages/StrategyPage';
import SavedStrategiesPage from '@/pages/SavedStrategiesPage';
import WalletPage from '@/pages/WalletPage';
import AlertsPage from '@/pages/AlertsPage';
import LibraryPage from '@/pages/LibraryPage';
import AdminHotDealsPage from '@/pages/AdminHotDealsPage';
import MilesPage from '@/pages/MilesPage';
import CashbackPage from '@/pages/CashbackPage';
import HotDealsPage from '@/pages/HotDealsPage';
import MenuPage from '@/pages/MenuPage';
import SubscriptionSuccessPage from '@/pages/SubscriptionSuccessPage';
import OnboardingPage from '@/pages/OnboardingPage';
import ProfilePage from '@/pages/ProfilePage';
import ContactPage from '@/pages/ContactPage';
import AppsPage from '@/pages/AppsPage';
import StrategyLibraryPage from '@/pages/StrategyLibraryPage';
import { DisplaySettingsBoot } from '@/components/DisplaySettingsBoot';
import { I18nProvider } from '@/lib/i18n';

function AppContent() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        {/* OAuth callback — Supabase redirects here after Google login */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/apps" element={
          <ProtectedRoute>
            <AppsPage />
          </ProtectedRoute>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/store/:storeId" element={
          <ProtectedRoute>
            <StoreDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute>
            <ComparePage />
          </ProtectedRoute>
        } />
        <Route path="/strategy" element={
          <ProtectedRoute>
            <StrategyPage />
          </ProtectedRoute>
        } />
        <Route path="/strategies" element={
          <ProtectedRoute>
            <StrategyLibraryPage />
          </ProtectedRoute>
        } />
        <Route path="/saved-strategies" element={
          <ProtectedRoute>
            <SavedStrategiesPage />
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/hot-deals" element={
          <ProtectedRoute>
            <AdminHotDealsPage />
          </ProtectedRoute>
        } />
        <Route path="/miles" element={
          <ProtectedRoute>
            <MilesPage />
          </ProtectedRoute>
        } />
        <Route path="/cashback" element={
          <ProtectedRoute>
            <CashbackPage />
          </ProtectedRoute>
        } />
        <Route path="/hot-deals" element={
          <ProtectedRoute>
            <HotDealsPage />
          </ProtectedRoute>
        } />
        <Route path="/menu" element={
          <ProtectedRoute requirePremium={false}>
            <MenuPage />
          </ProtectedRoute>
        } />
        <Route path="/subscription/success" element={
          <ProtectedRoute requirePremium={false}>
            <SubscriptionSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute requireOnboarding={false} requirePremium={false}>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route path="/profile" element={
          <ProtectedRoute requirePremium={false}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requirePremium={false}>
            <SettingsPage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <DisplaySettingsBoot />
        <Helmet>
          <title>SnapGain - Smart Comparison App</title>
          <meta name="description" content="Compare cashback, points, and gift cards in real-time. Find the best way to pay and maximize your rewards on every purchase." />
        </Helmet>
        <Toaster />
        <AppContent />
      </I18nProvider>
    </AuthProvider>
  );
}

export default App;