# SnapGain UK - Deploy Edge Functions to Supabase
# Este script faz deploy das funções do Reino Unido (TopCashback, JamDoughnut, Amazon UK)

param(
    [string]$SupabaseProject = "ffowgyjdbgkphsflxybk",
    [switch]$All = $false
)

Write-Host "🇬🇧 SnapGain UK - Deploying Edge Functions" -ForegroundColor Green
Write-Host "Project: $SupabaseProject" -ForegroundColor Cyan

# Verificar se Supabase CLI está instalado
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI encontrado: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI não encontrado. Instale com: npm install -g supabase" -ForegroundColor Red
    exit 1
}

# Funções a serem deployadas
$functions = @(
    @{ name = "topcashback-uk"; description = "TopCashback UK integration" },
    @{ name = "jamdoughnut-uk"; description = "JamDoughnut student cashback" },
    @{ name = "amazon-uk"; description = "Amazon UK marketplace integration" }
)

if ($All) {
    $functions += @(
        @{ name = "auth-callback"; description = "Authentication callback" },
        @{ name = "user-registration"; description = "User registration" },
        @{ name = "platform-comparison"; description = "Platform comparison" },
        @{ name = "subscription-handler"; description = "Subscription management" }
    )
}

# Login no Supabase
Write-Host "🔐 Fazendo login no Supabase..." -ForegroundColor Yellow
try {
    supabase login
    Write-Host "✅ Login realizado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no login do Supabase" -ForegroundColor Red
    exit 1
}

# Deploy das funções
foreach ($func in $functions) {
    Write-Host "`n🚀 Deploying $($func.name): $($func.description)" -ForegroundColor Cyan
    
    try {
        $deployPath = "edge-functions\$($func.name)"
        if (Test-Path $deployPath) {
            supabase functions deploy $func.name --project-ref $SupabaseProject
            Write-Host "✅ $($func.name) deployed successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Path not found: $deployPath" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erro ao fazer deploy de $($func.name): $_" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Edge Functions disponíveis em:" -ForegroundColor Cyan
Write-Host "https://$SupabaseProject.supabase.co/functions/v1/" -ForegroundColor Blue

Write-Host "`n📝 Para testar as funções:" -ForegroundColor Yellow
Write-Host "curl -X POST https://$SupabaseProject.supabase.co/functions/v1/topcashback-uk \" -ForegroundColor Gray
Write-Host "  -H 'Content-Type: application/json' \" -ForegroundColor Gray
Write-Host "  -d '{`"produto`": `"iPhone 15`", `"limite`": 5}'" -ForegroundColor Gray
