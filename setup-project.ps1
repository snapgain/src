# Script PowerShell para configuração completa do projeto
# Execute com: .\setup-project.ps1

Write-Host "🚀 Configurando projeto com Supabase Edge Functions..." -ForegroundColor Green

# Verificar se o Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o npm está disponível
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências do projeto..." -ForegroundColor Yellow
npm install

Write-Host "📦 Instalando Supabase CLI..." -ForegroundColor Yellow
npm install -g supabase

# Verificar se a instalação foi bem-sucedida
if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Falha na instalação do Supabase CLI." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Supabase CLI instalado com sucesso!" -ForegroundColor Green

# Configurar variáveis de ambiente
Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Yellow

if (!(Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "📋 Arquivo .env.local criado. Configure suas variáveis de ambiente!" -ForegroundColor Cyan
    Write-Host "Edit .env.local com seus valores do Supabase" -ForegroundColor Cyan
}

# Configurar Edge Functions
Write-Host "🔧 Configurando Edge Functions..." -ForegroundColor Yellow

if (!(Test-Path "edge-functions\.env.local")) {
    Copy-Item "edge-functions\.env.example" "edge-functions\.env.local" -ErrorAction SilentlyContinue
}

Write-Host "✅ Configuração inicial concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure o arquivo .env.local com suas credenciais do Supabase" -ForegroundColor White
Write-Host "2. Execute 'supabase login' para autenticar" -ForegroundColor White
Write-Host "3. Execute 'supabase init' para inicializar o projeto" -ForegroundColor White
Write-Host "4. Execute o script de deploy: .\edge-functions\deploy.bat" -ForegroundColor White
Write-Host "5. Execute 'npm run dev' para iniciar o desenvolvimento" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Links úteis:" -ForegroundColor Cyan
Write-Host "- Supabase Dashboard: https://app.supabase.com" -ForegroundColor White
Write-Host "- Documentação: https://supabase.com/docs" -ForegroundColor White
