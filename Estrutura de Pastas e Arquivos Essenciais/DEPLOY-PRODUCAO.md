# SnapGain - Deploy em Produção

## 🚀 GUIA PASSO A PASSO PARA PRODUÇÃO

### **1. Vercel (Opção Recomendada)**

#### **Passo 1: Acessar Vercel**
1. Vá para: https://vercel.com
2. Clique em "Sign up" e conecte com GitHub
3. Autorize o Vercel a acessar seus repositórios

#### **Passo 2: Importar Projeto**
1. Clique em "New Project"
2. Selecione "Import Git Repository"
3. Procure por: `snapgain/src`
4. Clique em "Import"

#### **Passo 3: Configurar Build**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### **Passo 4: Variáveis de Ambiente**
Adicione estas variáveis no painel da Vercel:
```
VITE_SUPABASE_URL=https://ffowgyjdbgkphsflxybk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3dneWpkYmdrcGhzZmx4eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjkwNzIsImV4cCI6MjA2ODYwNTA3Mn0.nhHxBCIloaci-emq6svbD2XT3kaR85Jl-SJTW3s9eiQ
VITE_EDGE_FUNCTIONS_URL=https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1
```

#### **Passo 5: Deploy!**
1. Clique em "Deploy"
2. Aguarde 2-3 minutos
3. ✅ **Aplicação no ar!**

---

### **2. Netlify (Alternativa)**

#### **Deploy Direto:**
1. https://netlify.com
2. "New site from Git"
3. GitHub → snapgain/src
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Mesmas variáveis de ambiente

---

### **3. Domínio Personalizado**

#### **Após deploy no Vercel:**
1. Compre um domínio (ex: snapgain.com)
2. No painel Vercel: Settings → Domains
3. Add domain: snapgain.com
4. Configure DNS no seu provedor
5. ✅ **https://snapgain.com funcionando!**

---

### **4. Checklist Pré-Produção**

#### **✅ Antes do Deploy:**
- [ ] Codespaces funcionando
- [ ] Todas as páginas carregam
- [ ] Edge Functions funcionando
- [ ] Design responsivo
- [ ] Sem erros no console

#### **✅ Pós-Deploy:**
- [ ] Testar em produção
- [ ] Configurar Google Analytics
- [ ] Configurar domínio personalizado
- [ ] Testar em mobile
- [ ] SEO básico

---

### **🎯 CRONOGRAMA:**

**Hoje (após Codespaces funcionar):**
- ✅ Deploy no Vercel (15 min)
- ✅ Teste inicial (10 min)

**Amanhã:**
- ✅ Domínio personalizado (30 min)
- ✅ Ajustes finais (60 min)

**Result:**
🚀 **SnapGain.com LIVE para clientes!**

---

### **💡 DICAS PRO:**

1. **Performance**: Vercel tem CDN global
2. **SSL**: HTTPS automático
3. **Deploy**: Git push = deploy automático
4. **Rollback**: Voltar versão em 1 clique
5. **Analytics**: Métricas de uso grátis

**🎉 Em menos de 1 hora, SnapGain estará online para o mundo todo!**
