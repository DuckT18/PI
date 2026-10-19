import * as roomService from '../services/roomService.js';
import * as securityService from '../services/securityService.js';
import * as energyService from '../services/energyService.js';

export const rooms = async (req, res) => res.json(await roomService.list(req.user.id));
export const security = async (req, res) => res.json(await securityService.overview(req.user.id));
export const energy = async (req, res) => res.json(await energyService.summary(req.user.id));
