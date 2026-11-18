import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/errors.js';
import { toDevice } from '../lib/serializers.js';
import { timeAgo } from '../lib/time.js';

// Texto de status [ligado, desligado] e tipo de evento gerado, por tipo de dispositivo.
const LABELS = {
  lock: ['Trancada', 'Destrancada'],
  alarm: ['Armado', 'Desarmado'],
  camera: ['Gravando', 'Desligada'],
};
const EVENT_TYPE = { lock: 'door', camera: 'camera', alarm: 'alarm' };

const DEFAULT_VALUES = {
  light: '100%',
  ac: '23°C',
  tv: 'Ligada',
  speaker: 'Conectado',
  camera: 'Gravando',
  lock: 'Trancada',
  sensor: 'Ativo',
  plug: 'Ligada',
  fan: 'Médio',
  curtain: 'Aberta',
};

function resolvePortableValue(isOn, connectionType) {
  if (!isOn) return 'Desl.';
  if (connectionType === 'dongle') return 'Conectado • 2.4GHz';
  if (connectionType === 'bluetooth') return 'Conectado • BT';
  return 'Conectado';
}

function resolveDefaultValue(type, isOn, connectionType) {
  if (!isOn) return 'Desl.';
  if (type === 'portable') return resolvePortableValue(true, connectionType);
  return DEFAULT_VALUES[type] ?? 'Ativo';
}

// "alarm" não existe no tipo Device do frontend; aparece só na tela Security.
export async function list(userId) {
  const devices = await prisma.device.findMany({
    where: { type: { not: 'alarm' }, environment: { ownerId: userId } },
    include: { environment: true },
    orderBy: { name: 'asc' },
  });
  return devices.map(toDevice);
}

export async function create(userId, { name, room, type, isOn = true, value, productCode, connectionType, consumption }) {
  const env =
    room === 'portable'
      ? await prisma.environment.upsert({
          where: { ownerId_slug: { ownerId: userId, slug: 'portable' } },
          update: {},
          create: { slug: 'portable', name: 'Portátil', color: '#00e5a0', ownerId: userId },
        })
      : await prisma.environment.findUnique({
          where: { ownerId_slug: { ownerId: userId, slug: room } },
        });

  if (!env) throw new HttpError(404, 'Cômodo não encontrado');

  const resolvedValue = value ?? resolveDefaultValue(type, isOn, connectionType);

  const created = await prisma.$transaction(async (tx) => {
    const device = await tx.device.create({
      data: {
        name,
        type,
        isOn,
        value: resolvedValue,
        productCode: productCode || null,
        connectionType: connectionType || null,
        environmentId: env.id,
      },
      include: { environment: true },
    });

    if (typeof consumption === 'number' && consumption > 0) {
      await tx.energyReading.create({
        data: {
          deviceId: device.id,
          kwh: Number(consumption),
        },
      });
    }

    await tx.event.create({
      data: {
        userId,
        deviceId: device.id,
        type: EVENT_TYPE[type] ?? 'system',
        status: 'success',
        title: `${name} adicionado`,
        description: `Novo dispositivo configurado em ${env.name}`,
      },
    });

    return device;
  });

  return toDevice(created);
}

// RF-002: ligar/desligar. Cada ação vira um evento no histórico.
export async function update(userId, id, { isOn, value }) {
  const device = await prisma.device.findFirst({
    where: { id, environment: { ownerId: userId } },
    include: { environment: true },
  });
  if (!device) throw new HttpError(404, 'Dispositivo não encontrado');

  const label =
    device.type === 'portable'
      ? resolvePortableValue(isOn, device.connectionType)
      : LABELS[device.type]?.[isOn ? 0 : 1];
  const ops = [
    prisma.device.update({
      where: { id },
      data: { isOn, ...((value ?? label) !== undefined && { value: value ?? label }) },
      include: { environment: true },
    }),
    prisma.event.create({
      data: {
        userId,
        deviceId: id,
        type: EVENT_TYPE[device.type] ?? 'system',
        status: device.type === 'alarm' && isOn ? 'success' : 'info',
        title: label ? `${device.name}: ${label}` : `${device.name} ${isOn ? 'ligado' : 'desligado'}`,
        description: `Alterado pelo app em ${device.environment.name}`,
      },
    }),
  ];
  // Ligar a luz manualmente reinicia o cronômetro da RNE-001; senão o job a desligaria em seguida.
  if (device.type === 'light' && isOn) {
    ops.push(prisma.environment.update({ where: { id: device.environmentId }, data: { lastPresenceAt: new Date() } }));
  }
  const [updated] = await prisma.$transaction(ops);
  return toDevice(updated);
}

// Atividade recente da Home.
export async function recentActivity(userId, limit = 5) {
  const events = await prisma.event.findMany({
    where: { userId, deviceId: { not: null } },
    include: { device: { select: { type: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return events.map((e) => ({ id: e.id, icon: e.device.type, text: e.title, time: timeAgo(e.createdAt) }));
}
