#!/bin/bash

# SnapGain - Configuração Automática Total
echo "🚀 Iniciando SnapGain automaticamente..."

# Aguardar container estar pronto
sleep 2

# Navegar para diretório correto
cd "Estrutura de Pastas e Arquivos Essenciais" || exit 1

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar .env.local automaticamente
echo "🔧 Configurando ambiente..."
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://ffowgyjdbgkphsflxybk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3dneWpkYmdrcGhzZmx4eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjkwNzIsImV4cCI6MjA2ODYwNTA3Mn0.nhHxBCIloaci-emq6svbD2XT3kaR85Jl-SJTW3s9eiQ
VITE_EDGE_FUNCTIONS_URL=https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1
EOF

# Corrigir permissões
chmod +x node_modules/.bin/*

# Iniciar aplicação automaticamente
echo "🌐 Iniciando SnapGain..."
npm run dev

echo "✅ SnapGain rodando em http://localhost:5173"
