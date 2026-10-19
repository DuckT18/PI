import { timeAgo } from './time.js';

// Formatos idênticos aos tipos de data/mockData.ts do frontend.
export const toDevice = (d) => ({
  id: d.id,
  name: d.name,
  room: d.environment.slug,
  type: d.type,
  isOn: d.isOn,
  value: d.value ?? undefined,
});

export const toSecurityDevice = (d) => ({
  id: d.id,
  name: d.name,
  type: d.type,
  status: d.value ?? (d.isOn ? 'Ativo' : 'Inativo'),
  isActive: d.isOn,
  location: d.environment.name,
});

export const toSecurityEvent = (e) => ({
  id: e.id,
  type: e.type,
  title: e.title,
  description: e.description,
  time: timeAgo(e.createdAt),
  status: e.status,
});
