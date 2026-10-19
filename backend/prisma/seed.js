import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados equivalentes aos mocks do frontend (data/mockData.ts). Só roda se o banco estiver vazio.
if (await prisma.user.count()) {
  await prisma.$disconnect();
  process.exit(0);
}

const user = await prisma.user.create({
  data: {
    name: 'Arthur Melo',
    email: 'arthur.melo@automate.io',
    passwordHash: await bcrypt.hash('automate123', 10),
    role: 'ADMIN',
  },
});

const roomDefs = [
  ['living', 'Sala de Estar', '#00e5a0', 35],
  ['kitchen', 'Cozinha', '#00b4d8', 25],
  ['bedroom', 'Quarto', '#7c5cfc', 20],
  ['office', 'Escritório', '#f59e0b', 12],
  ['garage', 'Garagem', '#ef4444', 8],
  ['entrance', 'Entrada', '#94a3b8', 0],
  ['hallway', 'Corredor', '#94a3b8', 0],
];
const rooms = {};
for (const [slug, name, color] of roomDefs) {
  rooms[slug] = await prisma.environment.create({ data: { slug, name, color, ownerId: user.id } });
}

// [nome, cômodo, tipo, ligado, valor]
const deviceDefs = [
  ['Ar Condicionado', 'living', 'ac', true, '22°C'],
  ['Smart TV', 'living', 'tv', true, 'Netflix'],
  ['Luz do Teto', 'living', 'light', true, '80%'],
  ['Caixa de Som', 'living', 'speaker', true, 'Tocando'],
  ['Luz Pendente', 'kitchen', 'light', true, '100%'],
  ['Tomada Inteligente', 'kitchen', 'plug', false, 'Desl.'],
  ['Exaustor', 'kitchen', 'fan', false, 'Desl.'],
  ['Abajur', 'bedroom', 'light', false, 'Desl.'],
  ['Ar Condicionado', 'bedroom', 'ac', true, '24°C'],
  ['Cortina Inteligente', 'bedroom', 'curtain', true, 'Aberta'],
  ['Luminária de Mesa', 'office', 'light', true, '60%'],
  ['Tomada Inteligente', 'office', 'plug', true, '120W'],
  ['Luz da Garagem', 'garage', 'light', false, 'Desl.'],
  ['Câmera de Segurança', 'garage', 'camera', true, 'Gravando'],
  // Segurança
  ['Porta Principal', 'entrance', 'lock', true, 'Trancada'],
  ['Porta dos Fundos', 'kitchen', 'lock', true, 'Trancada'],
  ['Câmera da Sala', 'living', 'camera', true, 'Gravando'],
  ['Câmera da Garagem', 'garage', 'camera', true, 'Gravando'],
  ['Câmera da Entrada', 'entrance', 'camera', true, 'Gravando'],
  ['Sensor de Movimento', 'hallway', 'sensor', true, 'Sem Atividade'],
  ['Sensor de Janela', 'bedroom', 'sensor', true, 'Fechada'],
  ['Sistema de Alarme', 'entrance', 'alarm', true, 'Armado'],
];
const devices = [];
for (const [name, room, type, isOn, value] of deviceDefs) {
  devices.push(await prisma.device.create({ data: { name, type, isOn, value, environmentId: rooms[room].id } }));
}

// Uma leitura por dia e por cômodo, nos últimos 60 dias (mês atual ~18 kWh/dia, anterior ~20).
const meter = Object.fromEntries(roomDefs.map(([slug]) => [slug, devices.find((d) => d.environmentId === rooms[slug].id)]));
const readings = [];
for (let i = 0; i < 60; i++) {
  const at = new Date();
  at.setDate(at.getDate() - i);
  at.setHours(12, 0, 0, 0);
  const dayTotal = (i < 30 ? 18.1 : 19.9) * (1 + 0.2 * Math.sin(i * 1.7));
  for (const [slug, , , weight] of roomDefs) {
    if (weight) readings.push({ deviceId: meter[slug].id, kwh: +((dayTotal * weight) / 100).toFixed(2), recordedAt: at });
  }
}
await prisma.energyReading.createMany({ data: readings });

// [tipo, status, título, descrição, minutos atrás]
const eventDefs = [
  ['door', 'info', 'Porta Principal Destrancada', 'Destrancada pelo app', 2],
  ['camera', 'warning', 'Movimento Detectado', 'Câmera da entrada detectou movimento', 15],
  ['system', 'success', 'Sistema Armado', 'Sistema de segurança ativado no modo Casa', 60],
  ['door', 'success', 'Porta Principal Trancada', 'Trancada automaticamente após 30 segundos', 62],
  ['motion', 'info', 'Sensor de Movimento Ativado', 'Sensor do corredor detectou movimento', 120],
  ['camera', 'warning', 'Câmera Offline', 'Câmera da garagem ficou offline brevemente', 180],
];
await prisma.event.createMany({
  data: eventDefs.map(([type, status, title, description, min]) => ({
    userId: user.id,
    type,
    status,
    title,
    description,
    createdAt: new Date(Date.now() - min * 60_000),
  })),
});

await prisma.$disconnect();
