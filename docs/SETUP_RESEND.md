# Setup do Resend para o digest diário de boost

Este guia leva ~15 minutos. No final, a edge function `daily-boost-digest` consegue mandar email pelos usuários que favoritaram lojas que entraram em boost.

## 1. Criar conta no Resend

1. Vai em https://resend.com → **Sign up** (Google login funciona)
2. Plano free: 3.000 emails/mês, 100/dia — mais que suficiente pro início

## 2. Adicionar o domínio `snapgain.uk`

1. No dashboard do Resend → **Domains** → **Add Domain**
2. Domain: `snapgain.uk`
3. Region: **EU (Ireland)** — mais perto dos usuários UK = melhor deliverability
4. Resend vai mostrar uma lista de DNS records pra adicionar (3-5 registros: SPF, DKIM, opcionalmente MX + DMARC)

## 3. Adicionar os DNS records no provedor do `snapgain.uk`

(Onde quer que tu tenhas comprado o domínio — Namecheap, GoDaddy, Cloudflare, Vercel Domains, etc.)

Tipicamente são:
- **TXT** `send.snapgain.uk` → SPF (`v=spf1 include:amazonses.com ~all`)
- **TXT** `resend._domainkey.snapgain.uk` → DKIM (chave longa, copia inteira)
- **MX** `send.snapgain.uk` → `feedback-smtp.eu-west-1.amazonses.com` (priority 10)
- **TXT** `_dmarc.snapgain.uk` → DMARC (opcional mas recomendado: `v=DMARC1; p=none;`)

Os valores EXATOS estão na página do Resend — copia de lá, não inventa.

Propagação DNS: 5min a 1h tipicamente. O Resend re-checa automático e mostra ✓ verde quando aceita.

## 4. Pegar a API key

1. Resend dashboard → **API Keys** → **Create API Key**
2. Name: `snapgain-edge-functions`
3. Permission: **Full access** (só vamos enviar mesmo)
4. Copia a key que aparece (começa com `re_...`) — **não vais ver de novo**

## 5. Configurar os secrets no Supabase

Abre https://supabase.com/dashboard/project/ffowgyjdbgkphsflxybk/functions → tab **Secrets** (ou **Environment Variables** dependendo da versão da UI).

Adiciona estes 3:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | a key `re_...` que copiaste |
| `EMAIL_FROM` | `SnapGain <boost@snapgain.uk>` (precisa do domínio verificado em #3) |
| `INTERNAL_SYNC_KEY` | uma string aleatória longa, ex: `openssl rand -hex 32` no terminal. Usado pelo pg_cron pra autenticar |
| `APP_URL` | `https://snapgain.uk` (já pode estar setado) |

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já estão setados automaticamente pelo Supabase.

## 6. Testar com dry run

No terminal:

```bash
INTERNAL_SYNC_KEY="<a key que setaste>"
curl -X POST \
  "https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/daily-boost-digest?dry_run=1" \
  -H "X-Internal-Key: $INTERNAL_SYNC_KEY"
```

Resposta esperada:
```json
{ "ok": true, "summary": { "candidates": 5, "sent": 1, "skipped_no_events": 4, "failed": 0, "dry_run": true } }
```

`dry_run=1` cria as linhas em `boost_digest_log` com `status='dry_run'` mas **NÃO** chama o Resend. Verifica no Supabase Studio na tabela `boost_digest_log` se as linhas apareceram.

## 7. Teste real (1 email)

Quando confirmares que o dry run funciona, manda um real só pra ti:

```bash
USER_ID="<teu user_id da auth.users>"  # SELECT id FROM auth.users WHERE email='babiferreir@gmail.com';
curl -X POST \
  "https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/daily-boost-digest?user_id=$USER_ID" \
  -H "X-Internal-Key: $INTERNAL_SYNC_KEY"
```

Verifica:
- Email chega na tua inbox
- Layout HTML renderiza corretamente
- Link "Open SnapGain" leva pra https://snapgain.uk/home
- Link "Turn them off" leva pra https://snapgain.uk/settings?notifications=off → ao abrir, o toggle muda pra OFF automaticamente

## 8. Ativar o pg_cron

Quando tudo OK, ativa o schedule diário. No SQL Editor do Supabase:

```sql
SELECT cron.alter_job(
  jobid := (SELECT jobid FROM cron.job WHERE jobname = 'daily-boost-digest'),
  active := true
);
```

Pronto — a partir daí roda todo dia às **8:00 UTC** (9am UK no verão / 8am no inverno).

## 9. Monitorar

- Resend dashboard mostra logs de entrega + open rate + bounces
- `boost_digest_log` tem o histórico interno (`status`, `event_count`, `error`)
- Se um envio falhar, fica em `status='failed'` com `error` populado — pra investigar use o Resend dashboard

## Como desativar (rollback de emergência)

```sql
SELECT cron.alter_job(
  jobid := (SELECT jobid FROM cron.job WHERE jobname = 'daily-boost-digest'),
  active := false
);
```
