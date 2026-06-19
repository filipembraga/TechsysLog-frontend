# TechsysLog — Frontend

Cliente web para o sistema de gerenciamento de pedidos e entregas da **TechsysLog**, desenvolvido como parte de um desafio técnico em **React + TypeScript + Tailwind CSS v4**, com suporte a notificações em tempo real via **SignalR**.

> 🇬🇧 [English summary](#english-summary) available at the bottom of this document.

> 🔗 **Backend:** [TechsysLog API](https://github.com/filipembraga/TechsysLog-api) — ASP.NET Core + MongoDB + SignalR

---

## Telas

### Painel de Pedidos

![Painel de Pedidos](./docs/screenshots/orders.png)

### Notificações em Tempo Real

![Notificações](./docs/screenshots/notifications.png)

### Novo Pedido com Auto-preenchimento de Endereço

![Novo Pedido](./docs/screenshots/new-order.png)

### Detalhe do Pedido

![Detalhe do Pedido](./docs/screenshots/order-detail.png)

---

## Stack

| Categoria           | Tecnologia                                  |
| ------------------- | ------------------------------------------- |
| Framework           | React 18 + TypeScript                       |
| Build               | Vite                                        |
| Estilização         | Tailwind CSS v4 com `@tailwindcss/vite`     |
| Roteamento          | React Router v6                             |
| Estado assíncrono   | TanStack Query v5                           |
| Formulários         | React Hook Form + Zod                       |
| Tempo real          | `@microsoft/signalr`                        |
| Internacionalização | react-i18next (PT-BR padrão, EN disponível) |
| HTTP                | Axios com interceptors JWT                  |
| Toasts              | Sonner                                      |
| Ícones              | Lucide React                                |

---

## Índice

- [Sobre](#sobre)
- [Arquitetura](#arquitetura)
- [Decisões de Arquitetura](#decisões-de-arquitetura)
- [Trade-offs](#trade-offs)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Observabilidade](#observabilidade)
- [O que Ficou de Fora](#o-que-ficou-de-fora)
- [Evolução Futura](#evolução-futura)
- [English Summary](#english-summary)

---

## Sobre

Interface web para a empresa de logística **TechsysLog**, que permite cadastrar pedidos, acompanhar status de entregas e receber notificações operacionais em tempo real.

O frontend consome a [TechsysLog API](https://github.com/filipembraga/TechsysLog) via REST e mantém uma conexão persistente com o Hub SignalR para receber eventos sem polling. A aplicação foi construída com foco em experiência operacional B2B — densidade de informação, feedback imediato e navegação eficiente.

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│                   React UI                  │
│         Pages + Components + Hooks          │
└────────────────┬────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
     ▼                       ▼
TanStack Query          useSignalR
(cache + REST)      (WebSocket persistente)
     │                       │
     ▼                       │
 Axios Client          Invalida cache
(interceptors JWT)          │
     │                       │
     └───────────┬───────────┘
                 │
                 ▼
         ASP.NET Core API
       REST + SignalR Hub
                 │
                 ▼
             MongoDB
```

O SignalR não é fonte de dados — é um sinal de invalidação. Quando um evento chega, o `useSignalR` invalida o cache do TanStack Query, que recarrega os dados via REST. O REST permanece como fonte da verdade.

---

## Decisões de Arquitetura

### Idioma do código

Todo o código, comentários e nomes de variáveis estão em inglês. O PT-BR é o idioma da interface — gerenciado via `react-i18next` — não do código-fonte. Comentários só existem quando explicam intenção não óbvia; código autodescritivo não é comentado.

---

### Tailwind CSS v4

O projeto usa Tailwind v4 com `@tailwindcss/vite`, que elimina o arquivo `tailwind.config.js` em favor de tokens definidos diretamente em CSS via `@theme`. Todos os tokens de cor, tipografia e superfície vivem em `src/styles/tokens.css` — o CSS é a fonte da verdade, não um arquivo de configuração JavaScript.

---

### TanStack Query + SignalR como camada de dados

O TanStack Query gerencia cache, loading states e invalidação. O SignalR não substitui o cache — ele o invalida. Quando um evento `ReceiveNotification` chega, o hook `useSignalR` invalida as queries relevantes e o TanStack Query recarrega os dados via REST.

```
Evento SignalR chega
  → useSignalR invalida queryKeys.notifications
    → TanStack Query recarrega GET /api/Notifications
      → UI atualiza automaticamente
```

Essa separação mantém o SignalR responsável apenas por sinalizar mudanças, e o REST como fonte da verdade dos dados.

---

### Autenticação JWT

O token JWT é armazenado em `localStorage` — technical debt documentado. O backend não implementa cookies `httpOnly`, o que seria a alternativa segura. A expiração é tratada via interceptor Axios: respostas `401` limpam o storage e redirecionam para `/login`.

Sem refresh token — o usuário precisa fazer login novamente após a expiração. Documentado como melhoria futura.

---

### Enums como `const` objects

Em vez de `enum` nativo do TypeScript (que gera código JavaScript em runtime), os status são modelados como objetos `as const` com `type` derivado:

```typescript
export const OrderStatus = {
  Pending: 'Pending',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
```

Isso garante type safety sem overhead de runtime e alinha diretamente com o contrato da API — o backend serializa enums como strings semânticas.

---

### NotificationType para i18n

As mensagens de notificação chegam do backend em inglês. Em vez de exibir texto livre da API, o frontend mapeia o campo `type` (`OrderRegistered`, `OrderDelivered`) para chaves i18n e exibe o texto no idioma correto. A `message` do backend é ignorada na UI — o contrato semântico é o `type`.

---

### Badge de urgência progressiva

O contador de notificações não lidas na sidebar usa limite de `9+` — padrão de sistemas operacionais B2B onde cada notificação representa um evento de negócio. Além do limite, a cor muda de azul para vermelho, comunicando urgência sem precisar de texto adicional.

---

### YAGNI

Nenhuma abstração foi criada sem uso imediato. Exemplos de decisões explícitas:

- Sem componente `AuthForm` base — apenas dois formulários, refatoração futura
- Sem `cva` para variantes de componente — `tailwind-merge` resolve o escopo atual
- Sem CSS Modules — Tailwind inline elimina dead CSS por design

---

## Trade-offs

### `localStorage` vs cookie `httpOnly`

O token JWT é armazenado em `localStorage` por limitação do backend do desafio, que não emite cookies `httpOnly`.

|                 | `localStorage` (atual) | Cookie `httpOnly` (preferido em produção) |
| --------------- | ---------------------- | ----------------------------------------- |
| Vulnerabilidade | XSS pode ler o token   | Inacessível via JavaScript                |
| CSRF            | Não aplicável          | Requer proteção `SameSite`                |
| Complexidade    | Baixa                  | Requer backend com suporte a cookies      |

A alternativa correta em produção seria cookie `httpOnly` + `SameSite=Strict`, eliminando a exposição via XSS. Documentado como technical debt.

---

### Broadcast vs SignalR Groups

Hoje todas as notificações chegam a todos os clientes conectados. O filtro acontece no frontend — cada usuário vê apenas suas notificações ao consultar a API REST.

O correto para escala seria SignalR Groups: o Hub adiciona cada conexão ao grupo do `userId` no handshake, e eventos são emitidos apenas para o grupo correto. Elimina tráfego desnecessário entre clientes.

---

### Internacionalização do CEP

O frontend aceita qualquer formato de CEP (mínimo 4, máximo 10 caracteres). Se o valor digitado resultar em 8 dígitos após limpeza, a consulta ao ViaCEP é tentada automaticamente. Caso contrário, o campo é enviado ao backend como digitado — permitindo endereços internacionais sem bloqueio de formato.

Um seletor de país com validação específica por região seria a evolução natural para um produto totalmente internacionalizado.

---

### CEP — Formato brasileiro vs. endereços internacionais

O campo aceita qualquer formato. Antes do envio, o valor limpo terá exatamente 8 caracteres, caso esteja no padrão brasileiro (não numéricos são removidos conforme padrão brasileiro). Caso contrário, o valor original é preservado — respeitando formatos como `SW1A 1AA` ou `10001` sem alterações. O enriquecimento ViaCEP é tentado silenciosamente para CEPs brasileiros e ignorado para todos os outros.

---

## Estrutura do Projeto

```
src/
├── api/
│   ├── client.ts          # Axios + interceptors JWT + handler 401
│   └── services.ts        # authService, ordersService, notificationsService
│
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx  # Sidebar + Outlet + useSignalR + badge de não lidas
│   └── ui/
│       ├── Button.tsx     # forwardRef, variantes, tailwind-merge
│       ├── Input.tsx      # forwardRef, label, error i18n, hint
│       ├── StatusBadge.tsx # ícone Lucide + cor semântica + texto i18n
│       └── index.ts
│
├── constants/
│   └── orderStatus.tsx    # ORDER_STATUS — mapa de status para ícone, cor e i18nKey
│
├── context/
│   └── AuthContext.tsx    # token + user + isLoaded + login/logout
│
├── hooks/
│   ├── useViaCep.ts       # debounce 600ms + auto-fill de endereço
│   └── useSignalR.ts      # conexão ao Hub + invalidação de cache + toast i18n
│
├── i18n/
│   ├── index.ts           # configuração — PT-BR padrão
│   └── locales/
│       ├── en.ts
│       └── pt-BR.ts
│
├── lib/
│   ├── queryClient.ts     # QueryClient + queryKeys centralizados
│   └── schemas.ts         # loginSchema, registerSchema, orderSchema (Zod)
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── OrdersPage.tsx         # tabela de pedidos + StatusBadge
│   ├── NewOrderPage.tsx       # formulário + ViaCEP auto-fill
│   ├── OrderDetailPage.tsx    # detalhes + Registrar Entrega
│   └── NotificationsPage.tsx  # log de notificações + marcar como lida
│
├── types/
│   └── index.ts           # OrderStatus, NotificationType, Order, AppNotification
│
└── styles/
    └── tokens.css         # @theme — tokens de cor e tipografia (fonte da verdade Tailwind v4)
```

---

## Como Executar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- [TechsysLog API](https://github.com/filipembraga/TechsysLog) rodando localmente

### Passos

**1. Clonar o repositório**

```bash
git clone https://github.com/filipembraga/TechsysLog-frontend.git
cd TechsysLog-frontend
```

**2. Instalar dependências**

```bash
npm install
```

**3. Iniciar em desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

> O backend deve estar rodando em `https://localhost:7260`. A URL base está configurada em `src/api/client.ts`.

---

## Funcionalidades

### Autenticação

- Cadastro e login com validação via Zod
- Sessão persistida em `localStorage` com rehydration automática
- Redirecionamento automático em rotas protegidas (`ProtectedRoute`) e públicas (`PublicRoute`)
- Logout com limpeza de sessão e redirecionamento

### Pedidos

- Listagem em tabela com `StatusBadge` semântico (ícone + cor + texto i18n)
- Clique na linha navega para o detalhe do pedido
- Criação com auto-preenchimento de endereço via **ViaCEP** (debounce 600ms)
- Validação de formulário em tempo real com mensagens i18n
- Registro de entrega diretamente na página de detalhe

### Notificações em Tempo Real

- Conexão persistente com Hub SignalR via WebSocket
- Token JWT enviado via `accessTokenFactory` (WebSockets não suportam headers customizados)
- Reconexão automática com backoff exponencial (`withAutomaticReconnect`)
- Toast no idioma correto ao receber evento — mapeado por `NotificationType`, não pela mensagem do backend
- Badge de não lidas na sidebar com limite de urgência: azul até 9, vermelho acima de 9+
- Log de notificações com distinção visual entre lidas e não lidas
- Clique marca como lida e navega para o pedido associado
- `readAt` exibido para auditoria de quando a notificação foi lida

---

## Observabilidade

Não implementada neste ciclo, mas a arquitetura está preparada para adoção sem refatoração de camadas.

**Erros de cliente** — o interceptor Axios centraliza todas as respostas de erro. Um serviço de monitoramento como **Sentry** ou **Application Insights** pode ser integrado em um único ponto:

```typescript
// src/api/client.ts — ponto único para captura de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error) // uma linha, zero impacto na arquitetura
    // ...
  },
)
```

**Correlação REST + SignalR** — cada notificação recebida via SignalR carrega `id` e `orderId`, permitindo correlacionar eventos de tempo real com requisições REST no log centralizado.

**OpenTelemetry** — instrumentação de frontend via `@opentelemetry/sdk-web` pode capturar traces de navegação, erros de rede e métricas de performance sem mudanças nos componentes.

**Próximos passos recomendados:** Sentry para erros de cliente, Web Vitals para performance, e correlação de `X-Correlation-Id` entre requests REST e eventos SignalR para rastreabilidade end-to-end.

---

## O que Ficou de Fora

| Item                                        | Motivo                                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Refresh token**                           | Backend não implementa — expiração tratada via `401` no interceptor. Technical debt documentado                            |
| **Formatação de datas com locale dinâmico** | Requer `date-fns` + locale dinâmico vinculado ao i18n ativo. `toLocaleString('pt-BR')` como solução provisória             |
| **`orderNumber` nas notificações**          | Payload atual tem `orderId` mas não o número legível. Exigiria mudança no contrato da API ou request extra por notificação |
| **Toast de notificações configurável**      | Hoje é global para todos os usuários. Configuração por usuário ou perfil é evolução natural                                |
| **Busca e filtros de pedidos**              | Não implementado — melhoria futura sem impacto na arquitetura atual                                                        |
| **Paginação**                               | Não implementada dado o volume esperado no contexto do desafio                                                             |
| **Cancelamento de pedido**                  | Requer modal de confirmação com cor `danger` — melhoria futura                                                             |
| **Máscara de moeda**                        | `react-number-format` seria a lib adequada — YAGNI no escopo atual                                                         |
| **Exportação XLSX**                         | SheetJS disponível no ecossistema — melhoria futura                                                                        |
| **Visão Admin**                             | Requer `role` no token JWT e guards de rota adicionais                                                                     |
| **Dark mode toggle**                        | Sistema já é dark por padrão — toggle seria configuração por usuário                                                       |
| **Testes automatizados**                    | Não implementados neste ciclo — Vitest + React Testing Library é o próximo passo natural                                   |

---

## Evolução Futura

### Testes automatizados

A arquitetura está preparada para adoção de testes sem refatoração:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Hooks como `useSignalR` e `useViaCep` são isolados e testáveis com mocks. Serviços são funções puras que recebem e retornam dados tipados.

### Internacionalização de datas

Substituir `toLocaleString('pt-BR')` hardcoded por `date-fns` com locale dinâmico vinculado ao i18n ativo:

```typescript
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

const locale = i18n.language === 'pt-BR' ? ptBR : enUS
format(new Date(date), 'dd/MM/yyyy HH:mm', { locale })
```

### SignalR por usuário

Hoje o backend faz broadcast para todos os clientes conectados. A evolução natural é SignalR Groups — o Hub adiciona cada conexão ao grupo do `userId`, e eventos são enviados apenas para o usuário correto.

### `orderNumber` nas notificações

Incluir o número legível do pedido (`ORD-00001`) no payload de notificação permitiria exibir mensagens mais contextuais na lista, sem request adicional.

---

## English Summary

Web client for the **TechsysLog** order and delivery management system, built as a technical challenge using **React 18 + TypeScript + Tailwind CSS v4**, with real-time notifications via **SignalR**.

### Architecture

The application follows a clear separation of concerns: **API layer** (Axios client with JWT interceptors + typed services), **state layer** (TanStack Query for server state, React Context for auth), **real-time layer** (`useSignalR` hook mounted at layout level), and **UI layer** (pages + reusable components with Tailwind inline styles).

Key decisions: Tailwind v4 with CSS-first token configuration (`@theme` in `tokens.css`); `const` objects over TypeScript native enums (no runtime overhead, direct API contract alignment); SignalR as a cache invalidation signal rather than a data source (REST remains the source of truth); `NotificationType` field for i18n mapping instead of consuming raw backend messages in English.

### Backend

REST API: [github.com/filipembraga/TechsysLog](https://github.com/filipembraga/TechsysLog) — ASP.NET Core + MongoDB + SignalR

### Running

```bash
git clone https://github.com/filipembraga/TechsysLog-frontend.git
cd TechsysLog-frontend
npm install
npm run dev
```

Requires the backend running at `https://localhost:7260`.
