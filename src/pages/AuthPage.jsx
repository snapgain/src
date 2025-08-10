
import React from 'react';
import { useParams } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import RegistrationForm from '@/components/auth/RegistrationForm';
import { useAuth } from '@/contexts/AuthContext';

function AuthPage() {
  let { mode } = useParams();
  const { user } = useAuth();

  const renderContent = () => {
    if (mode === 'register') {
      if (!user) {
        // If user somehow lands on /register without being 'logged in' from signup step, redirect.
        return <AuthForm mode="signup" />;
      }
      return <RegistrationForm />;
    }
    return <AuthForm mode={mode} />;
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 p-4">
      {renderContent()}
    </div>
  );
}

export default AuthPage;
