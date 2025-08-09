import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Aguardar um momento para o Supabase processar a sessão
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p>Processing login...</p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;