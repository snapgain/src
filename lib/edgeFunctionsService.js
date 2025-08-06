// Serviço para integração com Edge Functions do Supabase
import { supabase } from './customSupabaseClient';

const EDGE_FUNCTIONS_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

class EdgeFunctionsService {
  // Configuração base para requisições
  getRequestConfig(authRequired = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (authRequired) {
      const session = supabase.auth.getSession();
      if (session?.data?.session?.access_token) {
        headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
      }
    }

    return { headers };
  }

  // Auth Callback
  async handleAuthCallback(params) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/auth-callback`, {
        method: 'POST',
        ...this.getRequestConfig(true),
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no auth callback:', error);
      throw error;
    }
  }

  // Registro de usuário
  async registerUser(email, userData) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/user-registration`, {
        method: 'POST',
        ...this.getRequestConfig(true),
        body: JSON.stringify({ email, userData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no registro de usuário:', error);
      throw error;
    }
  }

  // Comparação de plataformas
  async comparePlatforms(platforms, criteria) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/platform-comparison`, {
        method: 'POST',
        ...this.getRequestConfig(false),
        body: JSON.stringify({
          platformData: { platforms, criteria }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na comparação de plataformas:', error);
      throw error;
    }
  }

  // Gerenciamento de assinatura
  async handleSubscription(userId, subscriptionType, paymentData) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/subscription-handler`, {
        method: 'POST',
        ...this.getRequestConfig(true),
        body: JSON.stringify({
          userId,
          subscriptionType,
          paymentData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no gerenciamento de assinatura:', error);
      throw error;
    }
  }

  // Função genérica para chamar qualquer Edge Function
  async callEdgeFunction(functionName, data, authRequired = false) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/${functionName}`, {
        method: 'POST',
        ...this.getRequestConfig(authRequired),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na Edge Function ${functionName}:`, error);
      throw error;
    }
  }
}

export const edgeFunctionsService = new EdgeFunctionsService();
