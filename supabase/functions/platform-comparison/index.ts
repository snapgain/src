import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { platformData } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Process platform comparison logic
    const { data, error } = await supabaseClient
      .from('platforms')
      .select('*')
      .in('name', platformData.platforms)

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Perform comparison analysis
    const comparisonResults = data.map(platform => ({
      ...platform,
      score: calculatePlatformScore(platform, platformData.criteria)
    }))

    return new Response(
      JSON.stringify({ results: comparisonResults }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function calculatePlatformScore(platform: any, criteria: any) {
  // Implement your scoring logic here
  let score = 0
  
  if (criteria.pricing && platform.pricing) {
    score += platform.pricing.affordability || 0
  }
  
  if (criteria.features && platform.features) {
    score += platform.features.length * 10
  }
  
  return Math.min(score, 100)
}
