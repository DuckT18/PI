import { prisma } from '../lib/prisma.js';

// Presença detectada: RNE-001 (acende luzes) e RNE-003 (alarme armado => alerta de segurança).
export async function handlePresence(sensor) {
  const env = sensor.environment;
  const base = { userId: env.ownerId, deviceId: sensor.id };

  await prisma.environment.update({ where: { id: env.id }, data: { lastPresenceAt: new Date() } });

  const armed = await prisma.device.findFirst({
    where: { type: 'alarm', isOn: true, environment: { ownerId: env.ownerId } },
  });
  if (armed) {
    return prisma.event.create({
      data: {
        ...base,
        type: 'alarm',
        status: 'warning',
        title: 'Movimento com alarme armado',
        description: `Sensor detectou presença em ${env.name}`,
      },
    });
  }

  await prisma.device.updateMany({
    where: { environmentId: env.id, type: 'light', isOn: false },
    data: { isOn: true },
  });
  return prisma.event.create({
    data: { ...base, type: 'motion', status: 'info', title: 'Movimento detectado', description: `Presença em ${env.name}` },
  });
}

// RNE-001: sem presença por AUTO_OFF_MINUTES => desliga as luzes do ambiente.
// Precisa rodar periodicamente: a ausência de presença não dispara nenhuma requisição.
export async function runAutoShutoff(now = new Date()) {
  const minutes = Number(process.env.AUTO_OFF_MINUTES ?? 5);
  const limit = new Date(now.getTime() - minutes * 60_000);

  const lamps = await prisma.device.findMany({
    where: { type: 'light', isOn: true, environment: { lastPresenceAt: { lt: limit } } },
    include: { environment: true },
  });
  if (!lamps.length) return 0;

  await prisma.$transaction([
    prisma.device.updateMany({ where: { id: { in: lamps.map((l) => l.id) } }, data: { isOn: false } }),
    prisma.event.createMany({
      data: lamps.map((l) => ({
        userId: l.environment.ownerId,
        deviceId: l.id,
        type: 'system',
        status: 'info',
        title: `${l.name} desligada`,
        description: `Sem presença em ${l.environment.name} há ${minutes} min`,
      })),
    }),
  ]);
  return lamps.length;
}

export function startAutoShutoffJob(intervalMs = 30_000) {
  return setInterval(() => runAutoShutoff().catch(console.error), intervalMs);
}
