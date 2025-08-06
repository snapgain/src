import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import RealTimePolicyPage from '@/pages/RealTimePolicyPage';
import AviosCalculatorPage from '@/pages/AviosCalculatorPage';

function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (!user.user_metadata?.isRegistered) {
        toast({
          title: "Welcome! 👋",
          description: "Please complete your registration to continue.",
        });
        navigate('/auth/register');
      }
    }
  }, [user, loading, navigate]);
  
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/real-time-policy" element={<RealTimePolicyPage />} />
        <Route path="/avios-calculator" element={<AviosCalculatorPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
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
      <Helmet>
        <title>SnapGain UK - Smart Cashback Comparison</title>
        <meta name="description" content="Compare TopCashback, JamDoughnut, and Amazon UK offers. Find the best cashback rates in GBP and maximize your rewards across UK retailers." />
        <meta name="keywords" content="UK cashback, TopCashback, JamDoughnut, Amazon UK, GBP rewards, British cashback comparison" />
        <meta property="og:title" content="SnapGain UK - Smart Cashback Comparison" />
        <meta property="og:description" content="UK's smart cashback comparison tool for TopCashback, JamDoughnut, and Amazon UK" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <link rel="canonical" href="https://snapgainuk.vercel.app" />
      </Helmet>
      <Toaster />
      <AppContent />
    </AuthProvider>
  );
}

export default App;