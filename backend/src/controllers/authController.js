import { z } from 'zod';
import * as authService from '../services/authService.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const login = async (req, res) => res.json(await authService.login(loginSchema.parse(req.body)));
export const me = async (req, res) => res.json(await authService.me(req.user.id));
