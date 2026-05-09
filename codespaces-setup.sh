#!/bin/bash
# Script de configuração rápida para GitHub Codespaces

echo "🔧 Configuração automática do SnapGain..."

# Se os arquivos estão em subpasta, mover para raiz
if [ -d "Estrutura de Pastas e Arquivos Essenciais" ]; then
    echo "📂 Movendo arquivos para raiz..."
    mv "Estrutura de Pastas e Arquivos Essenciais"/* .
    mv "Estrutura de Pastas e Arquivos Essenciais"/.[^.]* . 2>/dev/null || true
    rmdir "Estrutura de Pastas e Arquivos Essenciais"
fi

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar .env.local
if [ ! -f ".env.local" ] && [ -f "src/.env.local" ]; then
    echo "🔧 Configurando variáveis de ambiente..."
    cp src/.env.local .env.local
fi

echo "✅ Configuração concluída!"
echo "🚀 Execute: npm run dev"
