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

    // Amazon UK integration com cashback via afiliados
    const amazonUkCategories = [
      {
        category: 'Electronics',
        cashbackRate: '1-3%',
        commission: 2.5,
        primeDiscount: '20% extra on Prime items'
      },
      {
        category: 'Fashion',
        cashbackRate: '2-5%',
        commission: 4,
        primeDiscount: '15% extra on Prime items'
      },
      {
        category: 'Home & Garden',
        cashbackRate: '2-6%',
        commission: 5,
        primeDiscount: '25% extra on Prime items'
      },
      {
        category: 'Books',
        cashbackRate: '3-8%',
        commission: 7,
        primeDiscount: '10% extra on Prime items'
      },
      {
        category: 'Health & Beauty',
        cashbackRate: '2-7%',
        commission: 6,
        primeDiscount: '30% extra on Prime items'
      },
      {
        category: 'Sports & Outdoors',
        cashbackRate: '1-4%',
        commission: 3,
        primeDiscount: '15% extra on Prime items'
      }
    ];

    // Simular produtos Amazon UK com cashback
    const amazonOffers = amazonUkCategories.map((cat, index) => {
      const precoBase = Math.floor(Math.random() * 500) + 10; // £10-£510
      const isPrime = Math.random() > 0.4; // 60% chance de ser Prime
      const cashbackPercent = cat.commission;
      const cashbackAmount = Math.floor(precoBase * (cashbackPercent / 100));
      
      return {
        id: `amz-uk-${index}`,
        nome: `${produto} - Amazon UK ${cat.category}`,
        preco: precoBase,
        precoOriginal: precoBase + Math.floor(Math.random() * 50),
        plataforma: 'Amazon UK',
        retailer: 'Amazon UK',
        isPrime: isPrime,
        primeDiscount: isPrime ? cat.primeDiscount : null,
        cashbackRate: cat.cashbackRate,
        cashbackAmount: cashbackAmount,
        category: cat.category,
        url: `https://amazon.co.uk/s?k=${encodeURIComponent(produto)}&ref=snapgain`,
        moeda: 'GBP',
        simbolo: '£',
        disponibilidade: Math.random() > 0.1, // 90% disponível
        estoque: Math.floor(Math.random() * 50) + 1,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        reviews: Math.floor(Math.random() * 10000) + 100,
        entrega: {
          gratis: isPrime || Math.random() > 0.3,
          prazo: isPrime ? 'Next day delivery' : `${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 2) + 3} working days`,
          custo: isPrime || Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 8) + 2
        },
        seller: Math.random() > 0.7 ? 'Amazon' : 'Marketplace Seller',
        timestamp: new Date().toISOString()
      };
    });

    // Adicionar ofertas especiais Amazon
    const specialOffers = [
      {
        id: 'amz-deal-1',
        nome: `${produto} - Lightning Deal`,
        preco: Math.floor(Math.random() * 200) + 20,
        precoOriginal: Math.floor(Math.random() * 100) + 150,
        plataforma: 'Amazon UK',
        retailer: 'Amazon UK',
        isLightningDeal: true,
        dealExpiry: new Date(Date.now() + 3600000 * 6).toISOString(), // 6 hours
        cashbackRate: '4-8%',
        cashbackAmount: Math.floor((Math.random() * 200 + 20) * 0.06),
        category: 'Special Deals',
        url: `https://amazon.co.uk/deals?k=${encodeURIComponent(produto)}`,
        moeda: 'GBP',
        simbolo: '£',
        disponibilidade: true,
        claimed: Math.floor(Math.random() * 70) + 10,
        total: 100,
        rating: '4.5',
        reviews: Math.floor(Math.random() * 5000) + 500,
        entrega: {
          gratis: true,
          prazo: 'Next day delivery',
          custo: 0
        },
        seller: 'Amazon',
        timestamp: new Date().toISOString()
      }
    ];

    const allOffers = [...amazonOffers, ...specialOffers];

    // Calcular economia total e rankings
    const results = allOffers.map(item => {
      const economiaDesconto = item.precoOriginal - item.preco;
      const economiaTotal = economiaDesconto + item.cashbackAmount;
      const valorFinal = item.preco - item.cashbackAmount;
      
      return {
        ...item,
        economiaDesconto,
        economiaTotal,
        valorFinal,
        percentualEconomia: Math.floor((economiaTotal / item.precoOriginal) * 100),
        badge: (item as any).isLightningDeal ? 'Lightning Deal' : 
               (item as any).isPrime ? 'Prime' : 
               item.cashbackAmount > 10 ? 'High Cashback' : 'Standard'
      };
    });

    // Ordenar por melhor economia
    results.sort((a, b) => b.economiaTotal - a.economiaTotal);

    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        ofertas: results.slice(0, limite),
        plataforma: 'Amazon UK',
        moeda: 'GBP',
        consultaEm: new Date().toISOString(),
        melhorOferta: results[0],
        resumo: {
          economiaMedia: Math.floor(results.reduce((acc, r) => acc + r.economiaTotal, 0) / results.length),
          cashbackMedio: Math.floor(results.reduce((acc, r) => acc + r.cashbackAmount, 0) / results.length),
          percentualPrime: Math.floor((results.filter(r => (r as any).isPrime).length / results.length) * 100),
          entregaGratisDisponivel: Math.floor((results.filter(r => r.entrega.gratis).length / results.length) * 100)
        },
        categorias: amazonUkCategories.map(cat => cat.category),
        beneficios: [
          'Prime delivery available',
          'Trusted Amazon marketplace',
          'Customer reviews and ratings',
          'Lightning deals and special offers',
          'Cashback through affiliate program'
        ],
        alertas: {
          lightningDeals: results.filter(r => (r as any).isLightningDeal).length,
          primeOffers: results.filter(r => (r as any).isPrime).length,
          lowStock: results.filter(r => (r as any).estoque && (r as any).estoque < 5).length
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
        plataforma: 'Amazon UK'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
