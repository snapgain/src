#!/bin/bash

# Script para deploy das Edge Functions no Supabase
echo "🚀 Iniciando deploy das Edge Functions..."

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado. Instale com:"
    echo "npm install -g supabase"
    exit 1
fi

# Verificar se está logado no Supabase
echo "📋 Verificando autenticação..."
supabase status 2>/dev/null || {
    echo "❌ Não está logado no Supabase. Execute:"
    echo "supabase login"
    exit 1
}

# Deploy de cada Edge Function
echo "📦 Fazendo deploy da função auth-callback..."
supabase functions deploy auth-callback

echo "📦 Fazendo deploy da função user-registration..."
supabase functions deploy user-registration

echo "📦 Fazendo deploy da função platform-comparison..."
supabase functions deploy platform-comparison

echo "📦 Fazendo deploy da função subscription-handler..."
supabase functions deploy subscription-handler

echo "✅ Deploy das Edge Functions concluído!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure as variáveis de ambiente no Supabase Dashboard"
echo "2. Teste as funções no dashboard ou localmente"
echo "3. Integre com o frontend React"
