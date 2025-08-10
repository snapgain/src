# Edge Functions - Supabase Integration

Este diretório contém as Edge Functions para integração com o Supabase. As Edge Functions rodam no Deno runtime e são ideais para lógica de servidor que precisa ser executada próximo aos usuários.

## Estrutura

- `auth-callback/` - Função para lidar com callbacks de autenticação
- `user-registration/` - Função para registro de usuários
- `platform-comparison/` - Função para comparação de plataformas
- `subscription-handler/` - Função para gerenciamento de assinaturas

## Configuração

### Variáveis de Ambiente Necessárias

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Deploy das Edge Functions

Para fazer deploy das Edge Functions, use o Supabase CLI:

```bash
# Deploy todas as funções
supabase functions deploy

# Deploy uma função específica
supabase functions deploy auth-callback
supabase functions deploy user-registration
supabase functions deploy platform-comparison
supabase functions deploy subscription-handler
```

### Desenvolvimento Local

Para testar localmente:

```bash
# Iniciar o servidor local
supabase start

# Servir as funções localmente
supabase functions serve
```

## Uso das Funções

### auth-callback
- **Endpoint**: `/functions/v1/auth-callback`
- **Método**: GET/POST
- **Descrição**: Processa callbacks de autenticação

### user-registration
- **Endpoint**: `/functions/v1/user-registration`
- **Método**: POST
- **Body**: `{ email: string, userData: object }`
- **Descrição**: Registra novos usuários

### platform-comparison
- **Endpoint**: `/functions/v1/platform-comparison`
- **Método**: POST
- **Body**: `{ platformData: { platforms: string[], criteria: object } }`
- **Descrição**: Compara plataformas baseado nos critérios

### subscription-handler
- **Endpoint**: `/functions/v1/subscription-handler`
- **Método**: POST
- **Body**: `{ userId: string, subscriptionType: string, paymentData: object }`
- **Descrição**: Gerencia assinaturas de usuários

## Segurança

- As funções implementam CORS headers apropriados
- Usam autenticação do Supabase
- Validam dados de entrada
- Tratam erros adequadamente

## Logs e Monitoramento

Acesse os logs das Edge Functions através do dashboard do Supabase ou usando:

```bash
supabase functions logs <function-name>
```
