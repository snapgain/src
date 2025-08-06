# 🚀 INTEGRAÇÃO EM TEMPO REAL - SNAPGAIN

## 📋 PLATAFORMAS PRIORITÁRIAS

### 1. **MERCADO LIVRE** 
- **API**: MercadoLibre Developers API
- **Documentação**: https://developers.mercadolivre.com.br/
- **Endpoint**: `/sites/MLB/search?q={produto}`
- **Rate Limit**: 10,000 requests/hora
- **Cadastro**: https://developers.mercadolivre.com.br/devcenter

### 2. **AMAZON**
- **API**: Product Advertising API (PA-API)
- **Documentação**: https://webservices.amazon.com/paapi5/documentation/
- **Requer**: Conta Amazon Associates
- **Rate Limit**: 8,640 requests/dia (1 req/10s)
- **Cadastro**: https://affiliate-program.amazon.com.br/

### 3. **AMERICANAS/B2W**
- **API**: B2W Marketplace API
- **Documentação**: https://developers.americanas.com/
- **Endpoint**: `/products/search`
- **Rate Limit**: 1,000 requests/hora
- **Cadastro**: Portal de desenvolvedores B2W

### 4. **MAGAZINE LUIZA**
- **API**: Magazine Luiza Marketplace API
- **Documentação**: https://dev.magazineluiza.com.br/
- **Endpoint**: `/products`
- **Rate Limit**: 500 requests/hora
- **Cadastro**: Portal de desenvolvedores Magalu

### 5. **CASAS BAHIA/VIA VAREJO**
- **API**: Via Varejo API
- **Endpoint**: `/products/search`
- **Rate Limit**: 1,000 requests/hora

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### **PASSO 1: CONFIGURAR EDGE FUNCTIONS**

Vamos usar as Edge Functions do Supabase para fazer as chamadas às APIs:

```typescript
// edge-functions/price-scraper/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { produto, plataformas } = await req.json()
  
  const results = await Promise.all(
    plataformas.map(plataforma => buscarPreco(produto, plataforma))
  )
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function buscarPreco(produto: string, plataforma: string) {
  switch(plataforma) {
    case 'mercadolivre':
      return await buscarMercadoLivre(produto)
    case 'amazon':
      return await buscarAmazon(produto)
    // ... outras plataformas
  }
}
```

### **PASSO 2: SISTEMA DE CACHE**

```typescript
// Implementar cache Redis no Supabase
const cache = new Map()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

function getCachedPrice(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}
```

### **PASSO 3: RATE LIMITING**

```typescript
// Controle de rate limiting
const rateLimiter = new Map()

function checkRateLimit(platform: string): boolean {
  const now = Date.now()
  const requests = rateLimiter.get(platform) || []
  
  // Filtrar requests da última hora
  const recentRequests = requests.filter(time => now - time < 3600000)
  
  if (recentRequests.length >= PLATFORM_LIMITS[platform]) {
    return false
  }
  
  recentRequests.push(now)
  rateLimiter.set(platform, recentRequests)
  return true
}
```

## 🔧 FERRAMENTAS ALTERNATIVAS

### **Web Scraping (Backup)**
Para plataformas sem API pública:

1. **Puppeteer/Playwright** (via Edge Functions)
2. **Proxy rotation** para evitar bloqueios
3. **User-Agent rotation**
4. **CAPTCHA solving** (2captcha, Anti-Captcha)

### **APIs de Terceiros**
- **RapidAPI**: Várias APIs de e-commerce
- **ScraperAPI**: Web scraping como serviço
- **Apify**: Atores prontos para e-commerce

## 📊 ESTRUTURA DE DADOS

```typescript
interface ProdutoComparacao {
  nome: string
  preco: number
  precoOriginal?: number
  desconto?: number
  plataforma: string
  url: string
  avaliacao?: number
  numeroAvaliacoes?: number
  disponibilidade: boolean
  frete?: {
    valor: number
    prazo: string
    gratis: boolean
  }
  timestamp: Date
}
```

## 🎯 CRONOGRAMA DE IMPLEMENTAÇÃO

### **SEMANA 1**: APIs Oficiais
- [x] Configurar projeto base
- [ ] Implementar MercadoLivre API
- [ ] Implementar Amazon PA-API
- [ ] Configurar sistema de cache

### **SEMANA 2**: Mais Plataformas
- [ ] Americanas/B2W API
- [ ] Magazine Luiza API
- [ ] Sistema de rate limiting
- [ ] Tratamento de erros

### **SEMANA 3**: Web Scraping
- [ ] Casas Bahia scraping
- [ ] Extra.com.br scraping
- [ ] Shoptime scraping
- [ ] Sistema anti-detecção

### **SEMANA 4**: Otimizações
- [ ] Cache Redis
- [ ] Proxy rotation
- [ ] Alertas de preço
- [ ] Dashboard analytics
