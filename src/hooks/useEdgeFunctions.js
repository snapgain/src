// Hooks React para Edge Functions
import { useState, useCallback } from 'react';
import { edgeFunctionsService } from '../lib/edgeFunctionsService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/use-toast';

// Hook para autenticação
export const useAuthCallback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthCallback = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await edgeFunctionsService.handleAuthCallback(params);
      toast({
        title: "Autenticação bem-sucedida",
        description: "Você foi autenticado com sucesso!"
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro na autenticação",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleAuthCallback, loading, error };
};

// Hook para registro de usuário
export const useUserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = useCallback(async (email, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await edgeFunctionsService.registerUser(email, userData);
      toast({
        title: "Usuário registrado",
        description: "Conta criada com sucesso!"
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro no registro",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerUser, loading, error };
};

// Hook para comparação de plataformas
export const usePlatformComparison = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const comparePlatforms = useCallback(async (platforms, criteria) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await edgeFunctionsService.comparePlatforms(platforms, criteria);
      setResults(result.results);
      toast({
        title: "Comparação concluída",
        description: `${result.results.length} plataformas comparadas`
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro na comparação",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { comparePlatforms, loading, error, results, clearResults };
};

// Hook para gerenciamento de assinatura
export const useSubscriptionHandler = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubscription = useCallback(async (subscriptionType, paymentData) => {
    if (!user) {
      throw new Error('Usuário deve estar autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await edgeFunctionsService.handleSubscription(
        user.id, 
        subscriptionType, 
        paymentData
      );
      toast({
        title: "Assinatura ativada",
        description: `Plano ${subscriptionType} ativado com sucesso!`
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro na assinatura",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { handleSubscription, loading, error };
};

// Hook genérico para Edge Functions
export const useEdgeFunction = (functionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callFunction = useCallback(async (payload, authRequired = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await edgeFunctionsService.callEdgeFunction(
        functionName, 
        payload, 
        authRequired
      );
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Erro na função",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [functionName]);

  return { callFunction, loading, error, data };
};
