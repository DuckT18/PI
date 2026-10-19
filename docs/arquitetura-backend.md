# Arquitetura — atualização da Fase 02

## 1. Evolução em relação à Fase 01

| Fase 01 | Fase 02 |
|---|---|
| Frontend Next.js com dados mockados (`data/mockData.ts`) | Frontend consome a API REST; mocks substituídos por chamadas HTTP |
| Backend apenas planejado | Backend implementado: Express + Prisma + PostgreSQL |
| Regras de negócio só descritas | RNE-001, RNE-002 e RNE-003 implementadas em `services/` |
| Sem persistência | Dispositivos, eventos e leituras de energia persistidos no PostgreSQL |
| Sem autenticação | Login com JWT (8 h) e rotas protegidas |
| Hardware previsto | Endpoint `POST /sensors/simulate` simula o ESP32 até a integração real |

## 2. Visão geral

```
Next.js (frontend, raiz do repo)
   │  HTTP/JSON + Authorization: Bearer <JWT>
   ▼
backend/  routes → controllers (Zod) → services (regras) → Prisma → PostgreSQL
                                          ▲
                       job de desligamento automático (RNE-001, a cada 30 s)
                       POST /sensors/simulate  ← (futuro: ESP32 / MQTT)
```

- **routes**: mapeia URLs e aplica o middleware JWT.
- **controllers**: valida entrada e formata a resposta HTTP, sem regra de negócio.
- **services**: concentra regras de negócio e acesso ao banco.
- **serializers**: devolvem exatamente o formato dos tipos do frontend (`Device`, `Room`, `SecurityEvent`...).

## 3. Contrato da API

| Método | Rota | Tela | Requisito |
|---|---|---|---|
| POST | `/api/auth/login` | Login | RNF-004 |
| GET | `/api/auth/me` | Sidebar, Settings | — |
| GET | `/api/rooms` | Filtro de cômodos | RF-004 |
| GET | `/api/devices` | Devices | RF-004 |
| PATCH | `/api/devices/:id` | Devices (toggle) | RF-002 |
| GET | `/api/activity` | Home | — |
| GET | `/api/energy` | Home, Energy | RF-005 |
| GET | `/api/security` | Security | RF-003 |
| POST | `/api/sensors/simulate` | — (simulador) | RF-001 |

## 4. Modelo de dados

Entidades: `User`, `Environment` (cômodo), `Device`, `Event`, `EnergyReading`.

- `Environment` ganhou `ownerId` (a relação usuário→cômodo não existia), `slug` (id usado pelo filtro do frontend), `color` e `lastPresenceAt` (RNE-001).
- `Device.tipo` e `Device.status` viraram `type` (enum) + `isOn` (boolean) + `value` (texto exibido), alinhados ao frontend. Relação Dispositivo–Cômodo corrigida para N:1.
- `Event` é o histórico (tipo, status, título, descrição) e alimenta Security e a atividade da Home.
- `EnergyReading` (nova): leituras em kWh por dispositivo, base da tela Energy.
- O **alarme** é um dispositivo (`type = alarm`): armado = `isOn`. Isso substitui um "modo ausente" separado.

## 5. Regras de negócio implementadas

- **RNE-001**: presença acende as luzes do cômodo; o job desliga as luzes de cômodos sem presença há `AUTO_OFF_MINUTES` (padrão 5) e grava evento.
- **RNE-002**: JWT obrigatório; toda consulta filtra pelo dono dos dados.
- **RNE-003**: presença com alarme armado gera evento `alarm/warning`, listado antes dos demais em `/api/security`.


