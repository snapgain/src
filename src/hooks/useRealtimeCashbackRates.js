import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Hook para monitorar taxas de cashback em tempo real
 * Utiliza Supabase Realtime para updates automáticos
 */
export function useRealtimeCashbackRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Função para buscar taxas iniciais
    const fetchInitialRates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cashback_rates')
          .select('*')
          .eq('is_active', true)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        setRates(data || []);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar taxas:', err);
      } finally {
        setLoading(false);
      }
    };

    // Buscar taxas iniciais
    fetchInitialRates();

    // Configurar listener de tempo real
    const subscription = supabase
      .channel('cashback-rates-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escutar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'cashback_rates'
        },
        (payload) => {
          console.log('Taxa atualizada em tempo real:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setRates(prev => [payload.new, ...prev]);
              break;
            
            case 'UPDATE':
              setRates(prev => 
                prev.map(rate => 
                  rate.id === payload.new.id ? payload.new : rate
                )
              );
              break;
            
            case 'DELETE':
              setRates(prev => 
                prev.filter(rate => rate.id !== payload.old.id)
              );
              break;
          }
          
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para atualizar uma taxa específica
  const updateRate = async (storeId, platform, newRate) => {
    try {
      const { error } = await supabase
        .from('cashback_rates')
        .update({ 
          rate: newRate, 
          updated_at: new Date().toISOString() 
        })
        .match({ store: storeId, platform });

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Função para obter taxa de uma loja específica
  const getRateForStore = (storeId, platform = null) => {
    if (platform) {
      return rates.find(rate => 
        rate.store === storeId && rate.platform === platform
      );
    }
    return rates.filter(rate => rate.store === storeId);
  };

  // Função para obter melhores taxas por categoria
  const getBestRatesByCategory = (category) => {
    const categoryRates = rates.filter(rate => 
      rate.category === category && rate.is_active
    );
    
    const groupedByStore = categoryRates.reduce((acc, rate) => {
      if (!acc[rate.store] || acc[rate.store].rate < rate.rate) {
        acc[rate.store] = rate;
      }
      return acc;
    }, {});

    return Object.values(groupedByStore)
      .sort((a, b) => b.rate - a.rate);
  };

  return {
    rates,
    loading,
    error,
    lastUpdate,
    updateRate,
    getRateForStore,
    getBestRatesByCategory,
    refetch: () => {
      setLoading(true);
      fetchInitialRates();
    }
  };
}

/**
 * Hook para monitorar histórico de mudanças de taxas
 */
export function useRateHistory(storeId, platform) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('rate_history')
          .select(`
            *,
            cashback_rates!inner(store, platform)
          `)
          .eq('cashback_rates.store', storeId)
          .eq('cashback_rates.platform', platform)
          .order('changed_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setHistory(data || []);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId && platform) {
      fetchHistory();
    }
  }, [storeId, platform]);

  return { history, loading };
}

/**
 * Hook para notificações de mudanças de taxa
 */
export function useRateNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel('rate-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cashback_rates'
        },
        (payload) => {
          const { old: oldRate, new: newRate } = payload;
          
          if (oldRate.rate !== newRate.rate) {
            const changePercentage = ((newRate.rate - oldRate.rate) / oldRate.rate * 100).toFixed(2);
            
            const notification = {
              id: Date.now(),
              store: newRate.store,
              platform: newRate.platform,
              oldRate: oldRate.rate,
              newRate: newRate.rate,
              changePercentage: parseFloat(changePercentage),
              timestamp: new Date(),
              isIncrease: newRate.rate > oldRate.rate
            };

            setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
            
            // Auto-remove notification after 10 seconds
            setTimeout(() => {
              setNotifications(prev => 
                prev.filter(n => n.id !== notification.id)
              );
            }, 10000);
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, dismissNotification };
}
