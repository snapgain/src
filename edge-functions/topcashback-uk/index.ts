import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { produto, limite = 10 } = await req.json()
    
    if (!produto) {
      throw new Error('Product name is required')
    }

    // TopCashback ofertas simuladas (requer API key real)
    const topCashbackOffers = [
      {
        retailer: 'Amazon UK',
        cashbackRate: '1-8%',
        specialOffer: 'Up to 8% cashback on electronics',
        link: `https://www.topcashback.co.uk/amazon-uk/?q=${encodeURIComponent(produto)}`,
        category: 'Electronics'
      },
      {
        retailer: 'John Lewis',
        cashbackRate: '2-6%',
        specialOffer: '6% cashback on fashion and home',
        link: `https://www.topcashback.co.uk/john-lewis/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion & Home'
      },
      {
        retailer: 'Currys',
        cashbackRate: '1-4%',
        specialOffer: '4% cashback on technology',
        link: `https://www.topcashback.co.uk/currys/?q=${encodeURIComponent(produto)}`,
        category: 'Technology'
      },
      {
        retailer: 'Very',
        cashbackRate: '2-8%',
        specialOffer: '8% cashback on selected items',
        link: `https://www.topcashback.co.uk/very/?q=${encodeURIComponent(produto)}`,
        category: 'General'
      },
      {
        retailer: 'ASOS',
        cashbackRate: '3-7%',
        specialOffer: '7% cashback on fashion',
        link: `https://www.topcashback.co.uk/asos/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion'
      }
    ];

    // Simular dados de preços (em uma implementação real, faria scraping ou usaria APIs)
    const priceData = topCashbackOffers.map((offer, index) => ({
      id: `tcb-${index}`,
      nome: `${produto} - ${offer.retailer}`,
      preco: Math.floor(Math.random() * 500) + 20, // £20-£520
      precoOriginal: Math.floor(Math.random() * 600) + 50,
      desconto: Math.floor(Math.random() * 30) + 5,
      plataforma: 'TopCashback',
      retailer: offer.retailer,
      cashbackRate: offer.cashbackRate,
      specialOffer: offer.specialOffer,
      url: offer.link,
      moeda: 'GBP',
      simbolo: '£',
      categoria: offer.category,
      disponibilidade: true,
      entrega: {
        gratis: Math.random() > 0.5,
        prazo: `${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 3) + 3} working days`,
        custo: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 10) + 2
      },
      timestamp: new Date().toISOString()
    }));

    // Calcular cashback estimado
    const results = priceData.map(item => ({
      ...item,
      cashbackEstimado: {
        minimo: Math.floor(item.preco * 0.01), // 1% mínimo
        maximo: Math.floor(item.preco * 0.08), // 8% máximo
        medio: Math.floor(item.preco * 0.04)   // 4% médio
      }
    }));

    // Ordenar por melhor valor total (preço + cashback)
    results.sort((a, b) => {
      const valorA = a.preco - a.cashbackEstimado.maximo;
      const valorB = b.preco - b.cashbackEstimado.maximo;
      return valorA - valorB;
    });

    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        ofertas: results.slice(0, limite),
        plataforma: 'TopCashback UK',
        moeda: 'GBP',
        consultaEm: new Date().toISOString(),
        melhorOferta: results[0],
        resumo: {
          menorPreco: Math.min(...results.map(r => r.preco)),
          maiorCashback: Math.max(...results.map(r => r.cashbackEstimado.maximo)),
          economiaMedia: Math.floor(results.reduce((acc, r) => acc + r.cashbackEstimado.medio, 0) / results.length)
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        plataforma: 'TopCashback UK'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
