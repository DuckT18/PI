import jwt from 'jsonwebtoken';
import { HttpError } from '../lib/errors.js';

// RNE-002 / RNF-004: só usuários autenticados acessam o restante da API.
export function auth(req, _res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Token ausente');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new HttpError(401, 'Token inválido ou expirado');
  }
}
