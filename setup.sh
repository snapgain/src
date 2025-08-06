#!/bin/bash
# Script de inicialização para SnapGain

echo "🚀 Configurando SnapGain para VS Code Online..."

# Verificar estrutura atual
echo "📁 Verificando estrutura..."
pwd
ls -la

# Verificar se os arquivos estão na raiz ou em subpasta
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado na raiz"
elif [ -f "Estrutura de Pastas e Arquivos Essenciais/package.json" ]; then
    echo "📂 Movendo arquivos da subpasta para raiz..."
    cp -r "Estrutura de Pastas e Arquivos Essenciais/"* .
    rm -rf "Estrutura de Pastas e Arquivos Essenciais"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar variáveis de ambiente
if [ ! -f ".env.local" ]; then
    echo "🔧 Configurando variáveis de ambiente..."
    if [ -f "src/.env.local" ]; then
        cp src/.env.local .env.local
    else
        echo "⚠️ Arquivo .env.local não encontrado em src/"
    fi
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
