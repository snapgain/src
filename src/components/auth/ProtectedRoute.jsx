
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children, requireRegistration = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // Só redireciona para registro se explicitamente requerido (como na página dashboard)
  if (requireRegistration && !user.isRegistered && location.pathname !== '/auth/register') {
      return <Navigate to="/auth/register" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
