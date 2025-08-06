import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { produto, limite = 10 } = await req.json()
    
    if (!produto) {
      throw new Error('Produto é obrigatório')
    }

    // Fazer busca no MercadoLivre
    const mercadoLivreUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(produto)}&limit=${limite}`
    
    const response = await fetch(mercadoLivreUrl)
    const data = await response.json()
    
    // Processar resultados
    const produtos = data.results?.map((item: any) => ({
      id: item.id,
      nome: item.title,
      preco: item.price,
      precoOriginal: item.original_price,
      desconto: item.original_price ? Math.round(((item.original_price - item.price) / item.original_price) * 100) : 0,
      plataforma: 'MercadoLivre',
      url: item.permalink,
      imagem: item.thumbnail,
      condicao: item.condition,
      vendedor: item.seller?.nickname,
      frete: {
        gratis: item.shipping?.free_shipping || false,
        valor: 0, // MercadoLivre não retorna valor do frete na busca
        prazo: 'Consultar'
      },
      disponibilidade: item.available_quantity > 0,
      localizacao: item.address?.state_name,
      timestamp: new Date().toISOString()
    })) || []

    // Ordenar por preço
    produtos.sort((a, b) => a.preco - b.preco)

    return new Response(
      JSON.stringify({
        success: true,
        total: data.paging?.total || 0,
        produtos,
        plataforma: 'MercadoLivre',
        consultaEm: new Date().toISOString()
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
        plataforma: 'MercadoLivre'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
