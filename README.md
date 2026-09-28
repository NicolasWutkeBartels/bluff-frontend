# Bluff (app)

Front do Bluff, um Planning Poker: cada pessoa escolhe uma carta em segredo e todos viram juntos.
Next.js (App Router), Tailwind, shadcn, Motion, React Query, Axios, Zod e STOMP.

A API fica em outro repositório (`bluff-backend`).

## Rodar localmente

Pré-requisitos: Node 22 e a API rodando (veja o README do `bluff-backend`).

```bash
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se a API não estiver em localhost:8080
npm install
npm run dev                  # http://localhost:3000
```

| Variável | Padrão | Para quê |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | API REST. O WebSocket usa o mesmo endereço com `ws://` e `/ws`. |

Em produção, a origem do front precisa estar em `CORS_ORIGENS` na API.

## Onde está cada coisa

```
src/
  app/                    rotas: / (home) e /sala/[codigo]
  components/
    carta/                a carta e o verso Truchet (a identidade visual)
    home/                 formulários e seções da home
    sala/                 mesa, mão, painel da rodada, histórico, conexão
    ui/                   componentes do shadcn, reestilizados pelos tokens
  lib/
    api.ts                chamadas REST e leitura de erros
    ao-vivo.ts            STOMP: eventos no cache e ressincronização ao reconectar
    consultas.ts          hooks do React Query (com cache para status e baralhos)
    esquemas.ts           Zod: formulários, respostas da API e eventos
    sessao.ts             o que fica no localStorage (id do participante, sua carta)
    truchet.ts            o gerador do verso das cartas
```

## Documentação

- [docs/design.md](docs/design.md): conceito visual, cores, tipografia, layout, movimento e a revisão com capturas.
- `docs/aprendizado.md` no repositório `bluff-backend`: o caminho de um voto do clique até o banco,
  passando por este front.
