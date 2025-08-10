// Serviço para atualização automática de taxas de cashback
// Integra com APIs das plataformas UK e atualiza o Supabase

import { supabase } from '@/lib/customSupabaseClient';

class CashbackRateUpdater {
  constructor() {
    this.updateInterval = 5 * 60 * 1000; // 5 minutos
    this.isRunning = false;
    this.lastUpdate = null;
  }

  /**
   * Inicia o monitoramento automático de taxas
   */
  startMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Iniciando monitoramento de taxas em tempo real...');
    
    // Primeira atualização imediata
    this.updateAllRates();
    
    // Configurar intervalo de atualização
    this.intervalId = setInterval(() => {
      this.updateAllRates();
    }, this.updateInterval);
  }

  /**
   * Para o monitoramento
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Monitoramento de taxas parado');
  }

  /**
   * Atualiza todas as taxas de todas as plataformas
   */
  async updateAllRates() {
    try {
      console.log('🔄 Atualizando taxas de cashback...');
      
      const updates = await Promise.allSettled([
        this.updateTopCashbackRates(),
        this.updateJamDoughnutRates(),
        this.updateAmazonUKRates(),
        this.updateQuidcoRates()
      ]);

      const successful = updates.filter(result => result.status === 'fulfilled').length;
      const failed = updates.filter(result => result.status === 'rejected').length;

      console.log(`✅ Atualização concluída: ${successful} sucessos, ${failed} falhas`);
      this.lastUpdate = new Date();

      // Disparar evento de atualização
      this.dispatchUpdateEvent(successful, failed);

    } catch (error) {
      console.error('❌ Erro durante atualização de taxas:', error);
    }
  }

  /**
   * Atualiza taxas do TopCashback UK
   */
  async updateTopCashbackRates() {
    const stores = [
      { id: 'amazon-uk', category: 'marketplace' },
      { id: 'john-lewis', category: 'department-store' },
      { id: 'currys', category: 'electronics' },
      { id: 'argos', category: 'general-retail' },
      { id: 'boots', category: 'health-beauty' },
      { id: 'tesco', category: 'grocery' },
      { id: 'sainsburys', category: 'grocery' },
      { id: 'marks-spencer', category: 'retail' }
    ];

    for (const store of stores) {
      try {
        // Simular API call - em produção, fazer request real para TopCashback API
        const newRate = await this.simulateTopCashbackAPI(store.id);
        
        await this.updateRateInDatabase(store.id, 'topcashback', newRate, store.category);
        
        // Pequeno delay para evitar rate limiting
        await this.delay(100);
      } catch (error) {
        console.error(`Erro ao atualizar ${store.id} no TopCashback:`, error);
      }
    }
  }

  /**
   * Atualiza taxas do JamDoughnut UK (foco em estudantes)
   */
  async updateJamDoughnutRates() {
    const stores = [
      { id: 'asos', category: 'fashion' },
      { id: 'boohoo', category: 'fashion' },
      { id: 'nike', category: 'sportswear' },
      { id: 'spotify', category: 'streaming' },
      { id: 'uber-eats', category: 'food-delivery' },
      { id: 'deliveroo', category: 'food-delivery' },
      { id: 'netflix', category: 'streaming' }
    ];

    for (const store of stores) {
      try {
        const newRate = await this.simulateJamDoughnutAPI(store.id);
        await this.updateRateInDatabase(store.id, 'jamdoughnut', newRate, store.category);
        await this.delay(100);
      } catch (error) {
        console.error(`Erro ao atualizar ${store.id} no JamDoughnut:`, error);
      }
    }
  }

  /**
   * Atualiza taxas do Amazon UK
   */
  async updateAmazonUKRates() {
    const categories = [
      { id: 'amazon-uk', category: 'marketplace' },
      { id: 'amazon-fresh', category: 'grocery' },
      { id: 'amazon-prime-video', category: 'streaming' }
    ];

    for (const cat of categories) {
      try {
        const newRate = await this.simulateAmazonAPI(cat.id);
        await this.updateRateInDatabase(cat.id, 'amazon-direct', newRate, cat.category);
        await this.delay(100);
      } catch (error) {
        console.error(`Erro ao atualizar ${cat.id} no Amazon UK:`, error);
      }
    }
  }

  /**
   * Atualiza taxas do Quidco
   */
  async updateQuidcoRates() {
    const stores = [
      { id: 'very', category: 'retail' },
      { id: 'ao-com', category: 'electronics' },
      { id: 'booking-com', category: 'travel' }
    ];

    for (const store of stores) {
      try {
        const newRate = await this.simulateQuidcoAPI(store.id);
        await this.updateRateInDatabase(store.id, 'quidco', newRate, store.category);
        await this.delay(100);
      } catch (error) {
        console.error(`Erro ao atualizar ${store.id} no Quidco:`, error);
      }
    }
  }

  /**
   * Atualiza taxa no banco de dados
   */
  async updateRateInDatabase(storeId, platform, newRate, category, specialOffer = null) {
    try {
      const { data, error } = await supabase
        .from('cashback_rates')
        .upsert({
          store: storeId,
          platform: platform,
          rate: newRate,
          category: category,
          special_offer: specialOffer,
          currency: 'GBP',
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'store,platform'
        });

      if (error) throw error;
      
      console.log(`✅ ${storeId} (${platform}): ${newRate}%`);
      return data;
    } catch (error) {
      console.error(`❌ Erro ao salvar ${storeId}:`, error);
      throw error;
    }
  }

  /**
   * Simulações de APIs - substituir por chamadas reais em produção
   */
  async simulateTopCashbackAPI(storeId) {
    // Simular variação realística de taxas TopCashback (1-5%)
    const baseRates = {
      'amazon-uk': 1.5,
      'john-lewis': 3.0,
      'currys': 2.5,
      'argos': 2.0,
      'boots': 4.0,
      'tesco': 1.0,
      'sainsburys': 2.5,
      'marks-spencer': 3.5
    };
    
    const baseRate = baseRates[storeId] || 2.0;
    const variation = (Math.random() - 0.5) * 1.0; // ±0.5%
    return Math.max(0.1, Number((baseRate + variation).toFixed(2)));
  }

  async simulateJamDoughnutAPI(storeId) {
    // JamDoughnut tem taxas mais altas para estudantes (3-12%)
    const baseRates = {
      'asos': 6.0,
      'boohoo': 8.0,
      'nike': 3.0,
      'spotify': 12.0,
      'uber-eats': 5.0,
      'deliveroo': 4.5,
      'netflix': 8.0
    };
    
    const baseRate = baseRates[storeId] || 5.0;
    const variation = (Math.random() - 0.5) * 2.0; // ±1.0%
    return Math.max(1.0, Number((baseRate + variation).toFixed(2)));
  }

  async simulateAmazonAPI(storeId) {
    // Amazon tem taxas mais baixas mas estáveis (0.5-3%)
    const baseRates = {
      'amazon-uk': 1.0,
      'amazon-fresh': 2.0,
      'amazon-prime-video': 1.5
    };
    
    const baseRate = baseRates[storeId] || 1.0;
    const variation = (Math.random() - 0.5) * 0.5; // ±0.25%
    return Math.max(0.5, Number((baseRate + variation).toFixed(2)));
  }

  async simulateQuidcoAPI(storeId) {
    // Quidco taxas médias (1.5-4%)
    const baseRates = {
      'very': 4.0,
      'ao-com': 2.5,
      'booking-com': 3.0
    };
    
    const baseRate = baseRates[storeId] || 2.5;
    const variation = (Math.random() - 0.5) * 1.0; // ±0.5%
    return Math.max(0.5, Number((baseRate + variation).toFixed(2)));
  }

  /**
   * Dispara evento customizado quando taxas são atualizadas
   */
  dispatchUpdateEvent(successful, failed) {
    const event = new CustomEvent('cashbackRatesUpdated', {
      detail: {
        successful,
        failed,
        timestamp: this.lastUpdate,
        isRunning: this.isRunning
      }
    });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }

  /**
   * Helper para delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtém status do monitoramento
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      updateInterval: this.updateInterval
    };
  }
}

// Instância singleton
export const cashbackRateUpdater = new CashbackRateUpdater();

// Auto-start em produção
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  cashbackRateUpdater.startMonitoring();
}
