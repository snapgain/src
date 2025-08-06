import { supabase } from './customSupabaseClient'

class PriceComparisonService {
  constructor() {
    this.cache = new Map()
    this.CACHE_DURATION = 30 * 60 * 1000 // 30 minutos
  }

  // Buscar no MercadoLivre
  async buscarMercadoLivre(produto, limite = 10) {
    try {
      const { data, error } = await supabase.functions.invoke('mercadolivre-scraper', {
        body: { produto, limite }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar no MercadoLivre:', error)
      return {
        success: false,
        error: error.message,
        produtos: []
      }
    }
  }

  // Buscar em múltiplas plataformas
  async compararPrecos(produto, plataformas = ['mercadolivre']) {
    const cacheKey = `${produto}-${plataformas.join(',')}`
    
    // Verificar cache
    const cached = this.getCached(cacheKey)
    if (cached) {
      return cached
    }

    const resultados = {
      produto,
      consultaEm: new Date().toISOString(),
      plataformas: [],
      menorPreco: null,
      maiorDesconto: null,
      totalProdutos: 0
    }

    // Buscar em cada plataforma
    const promises = plataformas.map(async (plataforma) => {
      switch (plataforma) {
        case 'mercadolivre':
          return await this.buscarMercadoLivre(produto)
        
        case 'amazon':
          // TODO: Implementar Amazon
          return { success: false, error: 'Amazon em desenvolvimento', produtos: [] }
        
        case 'americanas':
          // TODO: Implementar Americanas
          return { success: false, error: 'Americanas em desenvolvimento', produtos: [] }
        
        default:
          return { success: false, error: 'Plataforma não suportada', produtos: [] }
      }
    })

    try {
      const responses = await Promise.allSettled(promises)
      
      responses.forEach((response, index) => {
        const plataforma = plataformas[index]
        
        if (response.status === 'fulfilled' && response.value.success) {
          const dados = response.value
          resultados.plataformas.push({
            nome: plataforma,
            success: true,
            produtos: dados.produtos,
            total: dados.total || dados.produtos.length
          })
          
          resultados.totalProdutos += dados.produtos.length
          
          // Encontrar menor preço
          dados.produtos.forEach(produto => {
            if (!resultados.menorPreco || produto.preco < resultados.menorPreco.preco) {
              resultados.menorPreco = produto
            }
            
            // Encontrar maior desconto
            if (produto.desconto && (!resultados.maiorDesconto || produto.desconto > resultados.maiorDesconto.desconto)) {
              resultados.maiorDesconto = produto
            }
          })
          
        } else {
          resultados.plataformas.push({
            nome: plataforma,
            success: false,
            error: response.status === 'fulfilled' ? response.value.error : response.reason.message,
            produtos: []
          })
        }
      })

      // Salvar no cache
      this.setCache(cacheKey, resultados)
      
      return resultados

    } catch (error) {
      console.error('Erro na comparação de preços:', error)
      throw error
    }
  }

  // Funções de cache
  getCached(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Limpar cache
  clearCache() {
    this.cache.clear()
  }

  // Obter produtos em promoção
  async obterPromocoes(plataformas = ['mercadolivre']) {
    const produtosPopulares = [
      'smartphone samsung',
      'iphone',
      'notebook dell',
      'smart tv 55',
      'playstation 5',
      'air fryer',
      'geladeira',
      'microondas'
    ]

    const promocoes = []

    for (const produto of produtosPopulares) {
      try {
        const resultado = await this.compararPrecos(produto, plataformas)
        
        // Encontrar produtos com desconto > 20%
        resultado.plataformas.forEach(plataforma => {
          const produtosComDesconto = plataforma.produtos.filter(p => p.desconto >= 20)
          promocoes.push(...produtosComDesconto)
        })
        
        // Delay para não sobrecarregar APIs
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Erro ao buscar promoções para ${produto}:`, error)
      }
    }

    // Ordenar por desconto
    promocoes.sort((a, b) => b.desconto - a.desconto)
    
    return promocoes.slice(0, 50) // Top 50 promoções
  }
}

export const priceComparisonService = new PriceComparisonService()
