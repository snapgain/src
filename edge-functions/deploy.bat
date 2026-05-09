@echo off
REM Script para deploy das Edge Functions no Supabase (Windows)
echo 🚀 Iniciando deploy das Edge Functions...

REM Verificar se o Supabase CLI está instalado
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI não encontrado. Instale com:
    echo npm install -g supabase
    exit /b 1
)

REM Deploy de cada Edge Function
echo 📦 Fazendo deploy da função auth-callback...
supabase functions deploy auth-callback

echo 📦 Fazendo deploy da função user-registration...
supabase functions deploy user-registration

echo 📦 Fazendo deploy da função platform-comparison...
supabase functions deploy platform-comparison

echo 📦 Fazendo deploy da função subscription-handler...
supabase functions deploy subscription-handler

echo ✅ Deploy das Edge Functions concluído!
echo.
echo 📝 Próximos passos:
echo 1. Configure as variáveis de ambiente no Supabase Dashboard
echo 2. Teste as funções no dashboard ou localmente
echo 3. Integre com o frontend React
