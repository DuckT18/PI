import { z } from 'zod';
import * as sensorService from '../services/sensorService.js';

const schema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('presence'), deviceId: z.string().uuid() }),
  z.object({ kind: z.literal('consumption'), deviceId: z.string().uuid(), kwh: z.number().positive() }),
]);

export const simulate = async (req, res) => {
  res.status(201).json(await sensorService.simulate(req.user.id, schema.parse(req.body)));
};
