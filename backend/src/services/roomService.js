import { prisma } from '../lib/prisma.js';

export async function list(userId) {
  const envs = await prisma.environment.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { devices: true } } },
    orderBy: { name: 'asc' },
  });
  const rooms = envs.map((e) => ({ id: e.slug, name: e.name, deviceCount: e._count.devices }));
  return [{ id: 'all', name: 'Todos', deviceCount: rooms.reduce((s, r) => s + r.deviceCount, 0) }, ...rooms];
}
