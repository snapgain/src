Write-Host "🚀 Configurando projeto com Supabase Edge Functions..." -ForegroundColor Green

Write-Host "📦 Instalando Supabase CLI..." -ForegroundColor Yellow
npm install -g supabase

Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Yellow

if (!(Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "📋 Arquivo .env.local criado!" -ForegroundColor Cyan
}

Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure .env.local" -ForegroundColor White
Write-Host "2. Execute: supabase login" -ForegroundColor White
Write-Host "3. Execute: npm run dev" -ForegroundColor White
