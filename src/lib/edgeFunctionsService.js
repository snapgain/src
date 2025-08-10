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

  // TopCashback UK integration
  async getTopCashbackOffers(produto, limite = 10) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/topcashback-uk`, {
        method: 'POST',
        ...this.getRequestConfig(false),
        body: JSON.stringify({ produto, limite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no TopCashback UK:', error);
      throw error;
    }
  }

  // JamDoughnut UK integration
  async getJamDoughnutOffers(produto, limite = 10) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/jamdoughnut-uk`, {
        method: 'POST',
        ...this.getRequestConfig(false),
        body: JSON.stringify({ produto, limite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no JamDoughnut UK:', error);
      throw error;
    }
  }

  // Amazon UK integration
  async getAmazonUKOffers(produto, limite = 10) {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS_BASE_URL}/amazon-uk`, {
        method: 'POST',
        ...this.getRequestConfig(false),
        body: JSON.stringify({ produto, limite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no Amazon UK:', error);
      throw error;
    }
  }

  // UK Comparison - aggregates all UK platforms
  async compareUKOffers(produto, limite = 30) {
    try {
      const [topcashback, jamdoughnut, amazon] = await Promise.allSettled([
        this.getTopCashbackOffers(produto, limite),
        this.getJamDoughnutOffers(produto, limite),
        this.getAmazonUKOffers(produto, limite)
      ]);

      const results = {
        success: true,
        produto,
        platforms: {},
        allOffers: [],
        summary: {
          totalOffers: 0,
          bestCashback: null,
          averageDiscount: 0,
          topRetailers: []
        }
      };

      // Process TopCashback results
      if (topcashback.status === 'fulfilled' && topcashback.value.success) {
        results.platforms.topcashback = topcashback.value;
        results.allOffers.push(...topcashback.value.ofertas.map(o => ({ ...o, source: 'TopCashback' })));
      }

      // Process JamDoughnut results  
      if (jamdoughnut.status === 'fulfilled' && jamdoughnut.value.success) {
        results.platforms.jamdoughnut = jamdoughnut.value;
        results.allOffers.push(...jamdoughnut.value.ofertas.map(o => ({ ...o, source: 'JamDoughnut' })));
      }

      // Process Amazon UK results
      if (amazon.status === 'fulfilled' && amazon.value.success) {
        results.platforms.amazon = amazon.value;
        results.allOffers.push(...amazon.value.ofertas.map(o => ({ ...o, source: 'Amazon UK' })));
      }

      // Sort all offers by best value
      results.allOffers.sort((a, b) => {
        const valueA = (a.economiaTotal || a.cashbackEstimado?.medio || 0);
        const valueB = (b.economiaTotal || b.cashbackEstimado?.medio || 0);
        return valueB - valueA;
      });

      // Calculate summary
      results.summary.totalOffers = results.allOffers.length;
      results.summary.bestCashback = results.allOffers[0] || null;
      
      if (results.allOffers.length > 0) {
        const totalSavings = results.allOffers.reduce((acc, offer) => 
          acc + (offer.economiaTotal || offer.cashbackEstimado?.medio || 0), 0
        );
        results.summary.averageDiscount = Math.floor(totalSavings / results.allOffers.length);
        
        // Get top retailers
        const retailerCounts = {};
        results.allOffers.forEach(offer => {
          retailerCounts[offer.retailer] = (retailerCounts[offer.retailer] || 0) + 1;
        });
        results.summary.topRetailers = Object.entries(retailerCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([retailer, count]) => ({ retailer, count }));
      }

      return results;

    } catch (error) {
      console.error('Erro na comparação UK:', error);
      return {
        success: false,
        error: error.message,
        produto
      };
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
