import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/errors.js';
import { handlePresence } from './ruleService.js';

// Simulador de hardware: mesma entrada que o ESP32 usará futuramente.
export async function simulate(userId, input) {
  const device = await prisma.device.findFirst({
    where: { id: input.deviceId, environment: { ownerId: userId } },
    include: { environment: true },
  });
  if (!device) throw new HttpError(404, 'Dispositivo não encontrado');

  if (input.kind === 'presence') {
    if (device.type !== 'sensor') throw new HttpError(400, 'Dispositivo não é um sensor');
    await handlePresence(device);
    return { ok: true };
  }
  await prisma.energyReading.create({ data: { deviceId: device.id, kwh: input.kwh } });
  return { ok: true };
}
