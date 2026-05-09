Write-Host "🚀 Iniciando configuração do projeto..." -ForegroundColor Green

# Definir o caminho correto do projeto
$projectPath = "C:\Users\babif\OneDrive\AppData\Área de Trabalho\Projeto GitHub\Estrutura de Pastas e Arquivos Essenciais\src"

# Navegar para o diretório do projeto
Write-Host "📍 Navegando para: $projectPath" -ForegroundColor Cyan
Set-Location -Path $projectPath

# Verificar diretório atual
Write-Host "📂 Diretório atual: $(Get-Location)" -ForegroundColor Yellow

# Listar arquivos para verificar
Write-Host "📄 Arquivos no diretório:" -ForegroundColor Yellow
Get-ChildItem

# Verificar se package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado!" -ForegroundColor Green
    
    # Instalar dependências
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    
    # Verificar se a instalação foi bem-sucedida
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
        
        # Iniciar o projeto
        Write-Host "🚀 Iniciando o servidor de desenvolvimento..." -ForegroundColor Green
        npm run dev
    } else {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json não encontrado!" -ForegroundColor Red
    Write-Host "🔧 Criando package.json básico..." -ForegroundColor Yellow
    
    # Criar package.json básico
    $packageContent = @"
{
  "name": "snapgain",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
"@
    
    $packageContent | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Host "✅ package.json criado!" -ForegroundColor Green
    
    # Instalar dependências
    npm install

    # Verificar se a instalação foi bem-sucedida
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
        # Iniciar o projeto
        Write-Host "🚀 Iniciando o servidor de desenvolvimento..." -ForegroundColor Green
        npm run dev
    } else {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    }
}