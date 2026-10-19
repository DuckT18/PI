import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/errors.js';

const ROLE_LABEL = { ADMIN: 'Administrador', USER: 'Usuário' };

const toProfile = (u) => ({
  name: u.name,
  email: u.email,
  avatar: u.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
  role: ROLE_LABEL[u.role],
});

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, 'Credenciais inválidas');
  }
  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: user.id, expiresIn: '8h' });
  return { token, user: toProfile(user) };
}

export async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(401, 'Usuário não encontrado');
  return toProfile(user);
}
