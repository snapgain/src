#!/bin/bash
# Script de inicialização para SnapGain

echo "🚀 Configurando SnapGain para VS Code Online..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar variáveis de ambiente
if [ ! -f ".env.local" ]; then
    echo "🔧 Configurando variáveis de ambiente..."
    cp src/.env.local .env.local
fi

# Criar arquivo de configuração do VS Code para Codespaces
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
    "eslint.enable": false,
    "typescript.preferences.includePackageJsonAutoImports": "off",
    "editor.formatOnSave": false,
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000
}
EOF

# Verificar se o Vite config existe
if [ ! -f "vite.config.js" ]; then
    echo "⚙️ Criando configuração do Vite..."
    # O arquivo já foi criado anteriormente
fi

echo "✅ Configuração concluída!"
echo "🌐 Para iniciar o projeto, execute: npm run dev"
echo "📖 Consulte README.md para mais informações"
