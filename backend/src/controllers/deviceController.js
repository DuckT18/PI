import { z } from 'zod';
import * as deviceService from '../services/deviceService.js';

const createSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  room: z.string().trim().min(1, 'Cômodo obrigatório'),
  type: z.enum([
    'light',
    'ac',
    'tv',
    'speaker',
    'camera',
    'lock',
    'sensor',
    'plug',
    'fan',
    'curtain',
    'portable',
  ]),
  isOn: z.boolean().optional(),
  value: z.string().optional(),
  productCode: z.string().trim().optional(),
  connectionType: z.enum(['wifi', 'bluetooth', 'dongle', 'other']).optional(),
});

const updateSchema = z.object({ isOn: z.boolean(), value: z.string().optional() });

export const list = async (req, res) => res.json(await deviceService.list(req.user.id));
export const create = async (req, res) => {
  res.status(201).json(await deviceService.create(req.user.id, createSchema.parse(req.body)));
};
export const update = async (req, res) => {
  res.json(await deviceService.update(req.user.id, req.params.id, updateSchema.parse(req.body)));
};
export const activity = async (req, res) => res.json(await deviceService.recentActivity(req.user.id));
