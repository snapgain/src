# 🚀 SnapGain - GitHub Codespaces

## ⚡ Configuração Automática

Este projeto está configurado para funcionar automaticamente no GitHub Codespaces!

### 🔧 O que acontece automaticamente:

1. **Container Setup**: Node.js 18 + extensões VS Code
2. **Estrutura Fix**: Move arquivos para raiz se necessário
3. **Dependências**: `npm install` automático
4. **Ambiente**: Copia `.env.local` do diretório `src/`
5. **Ports**: Forwards automático das portas 5173, 54321, 54323

### 🌐 Comandos rápidos:

```bash
# Iniciar o projeto
npm run dev

# Verificar dependências
npm ls

# Verificar estrutura
ls -la
```

### 🔗 Edge Functions Ativas:

- auth-callback: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/auth-callback`
- user-registration: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/user-registration`
- platform-comparison: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/platform-comparison`
- subscription-handler: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/subscription-handler`

### 🛠️ Se algo não funcionar:

```bash
# Re-executar configuração
chmod +x codespaces-setup.sh && ./codespaces-setup.sh

# Instalar dependências manualmente
npm install

# Verificar se .env.local existe
ls -la | grep env
```

### 📱 Acesso à aplicação:

Após executar `npm run dev`, o Codespaces mostrará automaticamente um pop-up para abrir a aplicação no navegador.

**🎉 Seu ambiente está pronto para desenvolvimento!**
