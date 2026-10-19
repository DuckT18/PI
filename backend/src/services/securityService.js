import { prisma } from '../lib/prisma.js';
import { toSecurityDevice, toSecurityEvent } from '../lib/serializers.js';

export async function overview(userId) {
  const [devices, events] = await Promise.all([
    prisma.device.findMany({
      where: { type: { in: ['lock', 'camera', 'sensor', 'alarm'] }, environment: { ownerId: userId } },
      include: { environment: true },
      orderBy: { name: 'asc' },
    }),
    prisma.event.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
  ]);

  // RNE-003: alertas de segurança vêm antes dos eventos de rotina (sort é estável).
  const priority = (e) => (e.type === 'alarm' && e.status === 'warning' ? 0 : 1);
  events.sort((a, b) => priority(a) - priority(b));

  return { devices: devices.map(toSecurityDevice), events: events.map(toSecurityEvent) };
}
