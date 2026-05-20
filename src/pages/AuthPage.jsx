import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

function AuthPage() {
  const { mode } = useParams();

  // Trial-first policy (Alt A): visitors can sign up free with email +
  // phone. They get a 7-day trial with comparison engine + 1 strategy
  // unlocked. Subscription gates the other 8 strategies and advanced
  // features.
  if (mode !== 'login' && mode !== 'signup') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 p-4">
      <AuthForm mode={mode} />
    </div>
  );
}

export default AuthPage;
