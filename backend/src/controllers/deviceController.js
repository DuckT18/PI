import { z } from 'zod';
import * as deviceService from '../services/deviceService.js';

const updateSchema = z.object({ isOn: z.boolean(), value: z.string().optional() });

export const list = async (req, res) => res.json(await deviceService.list(req.user.id));
export const update = async (req, res) => {
  res.json(await deviceService.update(req.user.id, req.params.id, updateSchema.parse(req.body)));
};
export const activity = async (req, res) => res.json(await deviceService.recentActivity(req.user.id));
