# Automate — Backend

API REST em Node.js (Express) com Prisma e PostgreSQL. Consumida pelo frontend Next.js da raiz do repositório.

## Rodando

```bash
cd backend
docker compose up --build      # PostgreSQL + API em http://localhost:3001 (migrations e seed automáticos)
```

Sem Docker: copie `.env.example` para `.env`, suba um PostgreSQL e rode:

```bash
npm install
npx prisma migrate deploy && npm run seed
npm run dev
```

Login de demonstração (criado pelo seed): `arthur.melo@automate.io` / `automate123`.

## Estrutura

```
src/
  routes/        URL -> controller (JWT aplicado a tudo, exceto /auth/login)
  controllers/   validação de entrada (Zod) e resposta HTTP
  services/      regras de negócio e acesso ao banco (Prisma)
  middlewares/   auth (JWT) e tratamento de erros
  lib/           prisma, erros, serializers (formato do frontend), tempo relativo
prisma/          schema, migrations e seed
```

## Endpoints (`/api`)

| Método | Rota | Substitui no frontend |
|---|---|---|
| POST | `/auth/login` | — (novo) |
| GET | `/auth/me` | `mockUser` |
| GET | `/rooms` | `rooms` |
| GET | `/devices` | `devices` |
| PATCH | `/devices/:id` `{ isOn, value? }` | toggle local de dispositivo |
| GET | `/activity` | `recentActivity` |
| GET | `/energy` | `weeklyEnergy`, `energyByRoom`, `energyStats` |
| GET | `/security` → `{ devices, events }` | `securityDevices`, `securityEvents` |
| POST | `/sensors/simulate` | — (simulador de hardware) |

As respostas seguem os tipos de `data/mockData.ts` (mesmos nomes de campos), então a troca nas telas é feita
com `fetch` + `Authorization: Bearer <token>`, sem mudar os componentes.

Simular sensores (use o token do login):

```bash
# presença (RNE-001 / RNE-003) — deviceId do "Sensor de Movimento" vem de GET /api/security
curl -X POST localhost:3001/api/sensors/simulate -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"kind":"presence","deviceId":"<id>"}'
# consumo
curl -X POST localhost:3001/api/sensors/simulate -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"kind":"consumption","deviceId":"<id>","kwh":1.5}'
```

## Regras de negócio

- **RNE-001** — presença acende as luzes do cômodo; um job (a cada 30 s) desliga as luzes de cômodos sem presença há `AUTO_OFF_MINUTES` e registra o evento. Luzes de cômodos que nunca registraram presença não são desligadas.
- **RNE-002** — todas as rotas, exceto o login, exigem JWT; cada consulta é filtrada pelo dono dos dados.
- **RNE-003** — com o "Sistema de Alarme" armado, presença gera evento `alarm/warning`; a lista de eventos de segurança coloca esses alertas no topo.

## Variáveis de ambiente

Ver `.env.example`.
