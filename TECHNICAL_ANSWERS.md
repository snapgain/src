# SnapGain UK - Respostas Técnicas

## 1. React vs Vite
**Resposta**: Precisamos do **React** + Vite. Vite é apenas o bundler, React é o framework UI necessário para:
- Componentes reativos
- Hooks para estado e tempo real
- Context API para autenticação
- Lifecycle management para WebSockets

## 2. Tabela cashback_rates ✅
**Status**: Criada no `database-setup.sql` com estrutura:
```sql
- id (UUID, PK)
- store (VARCHAR) 
- platform (VARCHAR)
- rate (DECIMAL 5,2)
- currency (VARCHAR, default 'GBP')
- category (VARCHAR)
- special_offer (TEXT)
- is_active (BOOLEAN)
- updated_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## 3. Atualizações em Tempo Real ✅

### Implementadas:
- **Hook React**: `useRealtimeCashbackRates.js` - monitora mudanças via Supabase Realtime
- **Serviço Updater**: `cashbackRateUpdater.js` - simula APIs e atualiza rates a cada 5min
- **Componente UI**: `RealtimeRatesDisplay.jsx` - mostra rates live com notificações

### Supabase Realtime habilitado:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE cashback_rates;
```

## 4. Políticas Supabase ✅

### Row Level Security configurada:
- **Public read**: Qualquer um pode ver rates
- **Authenticated insert**: Usuários logados podem inserir
- **Service role update**: Apenas service role atualiza rates

### Triggers configurados:
- `update_cashback_rates_timestamp`: Auto-atualiza timestamp
- `log_cashback_rate_changes`: Salva histórico de mudanças

## 5. API/Scraper Strategy

### Implementado:
- **Simulador de APIs**: Para TopCashback, JamDoughnut, Amazon UK, Quidco
- **Auto-update**: Executa a cada 5 minutos
- **Rate limiting**: Delays entre requests
- **Error handling**: Fallbacks e logs

### Para produção - substituir por:
```javascript
// TopCashback API real
const response = await fetch('https://api.topcashback.co.uk/rates', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});

// JamDoughnut API real  
const response = await fetch('https://api.jamdoughnut.com/rates', {
  headers: { 'X-API-Key': 'YOUR_API_KEY' }
});
```

## 6. Real-Time Policy Criada ✅

### Política para clientes:
- **Instant Updates**: Rates atualizados em tempo real
- **Automatic Monitoring**: Sistema monitora mudanças a cada 5min
- **Smart Notifications**: Alertas de mudanças importantes
- **Update Frequency**: Verificação contínua com updates imediatos

## 7. Próximos Passos

### Necessário fazer:
1. **Deploy do SQL**: Executar `database-setup.sql` no Supabase
2. **APIs Reais**: Substituir simuladores por APIs verdadeiras
3. **Webhook Setup**: Configurar webhooks das plataformas
4. **Monitoring**: Implementar logs e métricas
5. **Caching**: Otimizar performance com Redis

### Comandos para deploy:
```bash
# 1. Aplicar schema SQL no Supabase Dashboard
# 2. Deploy da aplicação
git push origin deploy-vercel

# 3. Iniciar monitoramento em produção
# (Já configurado para auto-start)
```
