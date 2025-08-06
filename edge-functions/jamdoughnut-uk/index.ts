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

    // Jam Doughnut ofertas simuladas (foco em estudantes e jovens profissionais)
    const jamDoughnutOffers = [
      {
        retailer: 'ASOS',
        cashbackRate: '4-12%',
        specialOffer: '12% cashback + student discount',
        studentDiscount: '10% extra',
        link: `https://www.jamdoughnut.com/asos/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion',
        ageGroup: 'Students & Young Professionals'
      },
      {
        retailer: 'Boohoo',
        cashbackRate: '6-15%',
        specialOffer: '15% cashback on trendy fashion',
        studentDiscount: '15% extra',
        link: `https://www.jamdoughnut.com/boohoo/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion',
        ageGroup: 'Students'
      },
      {
        retailer: 'Nike',
        cashbackRate: '2-8%',
        specialOffer: '8% cashback on sportswear',
        studentDiscount: '10% extra',
        link: `https://www.jamdoughnut.com/nike/?q=${encodeURIComponent(produto)}`,
        category: 'Sportswear',
        ageGroup: 'Students & Young Professionals'
      },
      {
        retailer: 'Pretty Little Thing',
        cashbackRate: '5-20%',
        specialOffer: '20% cashback on selected items',
        studentDiscount: '20% extra',
        link: `https://www.jamdoughnut.com/plt/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion',
        ageGroup: 'Young Women'
      },
      {
        retailer: 'Missguided',
        cashbackRate: '3-10%',
        specialOffer: '10% cashback + exclusive deals',
        studentDiscount: '15% extra',
        link: `https://www.jamdoughnut.com/missguided/?q=${encodeURIComponent(produto)}`,
        category: 'Fashion',
        ageGroup: 'Young Women'
      }
    ];

    // Simular dados com foco em demografia jovem
    const ofertas = jamDoughnutOffers.map((offer, index) => {
      const precoBase = Math.floor(Math.random() * 200) + 15; // £15-£215
      const descontoEstudante = parseInt(offer.studentDiscount) || 0;
      const precoComDesconto = precoBase * (1 - descontoEstudante / 100);
      
      return {
        id: `jd-${index}`,
        nome: `${produto} - ${offer.retailer}`,
        preco: Math.floor(precoComDesconto),
        precoOriginal: precoBase,
        desconto: descontoEstudante,
        plataforma: 'Jam Doughnut',
        retailer: offer.retailer,
        cashbackRate: offer.cashbackRate,
        specialOffer: offer.specialOffer,
        studentDiscount: offer.studentDiscount,
        targetAudience: offer.ageGroup,
        url: offer.link,
        moeda: 'GBP',
        simbolo: '£',
        categoria: offer.category,
        disponibilidade: true,
        entrega: {
          gratis: Math.random() > 0.3, // Maior chance de entrega grátis
          prazo: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2) + 2} working days`,
          custo: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
        },
        beneficiosExtras: [
          'Student discount available',
          'Exclusive young professional deals',
          'Social shopping features'
        ],
        timestamp: new Date().toISOString()
      };
    });

    // Calcular cashback e savings totais
    const results = ofertas.map(item => {
      const cashbackMin = Math.floor(item.preco * 0.02); // 2% mínimo
      const cashbackMax = Math.floor(item.preco * 0.20); // 20% máximo
      const cashbackMedio = Math.floor(item.preco * 0.08); // 8% médio
      
      return {
        ...item,
        cashbackEstimado: {
          minimo: cashbackMin,
          maximo: cashbackMax,
          medio: cashbackMedio
        },
        economiaTotal: (item.precoOriginal - item.preco) + cashbackMedio,
        valorFinal: item.preco - cashbackMedio
      };
    });

    // Ordenar por melhor economia total
    results.sort((a, b) => b.economiaTotal - a.economiaTotal);

    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        ofertas: results.slice(0, limite),
        plataforma: 'Jam Doughnut UK',
        targetAudience: 'Students & Young Professionals',
        moeda: 'GBP',
        consultaEm: new Date().toISOString(),
        melhorOferta: results[0],
        resumo: {
          economiaMedia: Math.floor(results.reduce((acc, r) => acc + r.economiaTotal, 0) / results.length),
          cashbackMedio: Math.floor(results.reduce((acc, r) => acc + r.cashbackEstimado.medio, 0) / results.length),
          descontoMedioEstudante: Math.floor(results.reduce((acc, r) => acc + r.desconto, 0) / results.length)
        },
        beneficios: [
          'Higher cashback rates for students',
          'Exclusive young professional deals',
          'Social shopping and sharing features',
          'Trend-focused retailers'
        ]
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
        plataforma: 'Jam Doughnut UK'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
