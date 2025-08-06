# 🚀 SnapGain - Deploy no GitHub Codespaces

## 📋 **Como usar este projeto no VS Code Online:**

### **Opção 1: GitHub Codespaces (Recomendado)**

1. **Fork este repositório** para sua conta GitHub
2. **Abra o Codespace:**
   - Vá para seu fork do repositório
   - Clique no botão verde `< > Code`
   - Selecione `Codespaces`
   - Clique em `Create codespace on main/master`

3. **Configure o ambiente:**
   ```bash
   # Instalar dependências
   npm install
   
   # Configurar variáveis de ambiente
   cp src/.env.local .env.local
   
   # Iniciar o projeto
   npm run dev
   ```

### **Opção 2: VS Code Online (vscode.dev)**

1. **Abra diretamente:**
   - Vá para: `https://vscode.dev/github/{seu-usuario}/snapgain`
   - Substitua `{seu-usuario}` pelo seu username do GitHub

2. **Configurar terminal:**
   - Use o terminal integrado do VS Code
   - Execute os mesmos comandos acima

### **Opção 3: GitPod**

1. **Abra no GitPod:**
   - Vá para: `https://gitpod.io/#https://github.com/{seu-usuario}/snapgain`
   - Substitua `{seu-usuario}` pelo seu username do GitHub

## 🔧 **Arquivos de Configuração Incluídos:**

- ✅ `index.html` - Arquivo principal do Vite
- ✅ `vite.config.js` - Configuração JSX e aliases
- ✅ `package.json` - Dependências do projeto
- ✅ `.env.local` - Variáveis de ambiente do Supabase
- ✅ `.gitignore` - Ignorar arquivos desnecessários

## 🌐 **Edge Functions Supabase:**

Todas as Edge Functions estão configuradas e prontas:

- **auth-callback**: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/auth-callback`
- **user-registration**: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/user-registration`
- **platform-comparison**: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/platform-comparison`
- **subscription-handler**: `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/subscription-handler`

## 🎯 **Testando o Projeto:**

1. **Após executar `npm run dev`:**
   - A aplicação estará disponível em `http://localhost:5173`
   - No Codespaces, o VS Code irá mostrar um pop-up para abrir no navegador

2. **Funcionalidades testáveis:**
   - Sistema de autenticação mock
   - Comparação de preços (Amazon, eBay, etc.)
   - Interface responsiva
   - Integração com Edge Functions

## 📖 **Documentação Completa:**

Consulte o arquivo `src/GUIA_EDGE_FUNCTIONS.md` para documentação detalhada sobre:
- Configuração das Edge Functions
- Integração com React
- APIs disponíveis
- Monitoramento e logs

## 🛠️ **Resolução de Problemas:**

### **Se o localhost não funcionar:**
1. Verifique se o comando `npm run dev` está rodando
2. No Codespaces, use o "Ports" tab para ver URLs públicas
3. Use Ctrl+C para parar e reiniciar o servidor

### **Se houver erros de dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Se as Edge Functions não funcionarem:**
1. Verifique o arquivo `.env.local`
2. Teste as URLs das funções diretamente no navegador
3. Consulte logs no Supabase Dashboard

## 🎉 **Pronto para Desenvolvimento!**

Seu projeto SnapGain está 100% configurado para funcionar no VS Code Online com todas as integrações de backend funcionando perfeitamente!

---

**Nota:** Este projeto inclui integrações completas com Supabase Edge Functions, sistema de autenticação, e comparação de preços em tempo real.
