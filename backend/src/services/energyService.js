import { prisma } from '../lib/prisma.js';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
const sum = (list) => list.reduce((s, r) => s + r.kwh, 0);

function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

// Tela Energy e cards da Home: série semanal, consumo por cômodo e totais.
export async function summary(userId) {
  const costPerKwh = Number(process.env.COST_PER_KWH ?? 0.85);
  const readings = await prisma.energyReading.findMany({
    where: { recordedAt: { gte: daysAgo(59) }, device: { environment: { ownerId: userId } } },
    include: { device: { select: { environment: { select: { name: true, color: true } } } } },
  });
  const between = (from, to) => readings.filter((r) => r.recordedAt >= from && r.recordedAt < to);

  const tomorrow = daysAgo(-1);
  const week = between(daysAgo(6), tomorrow);
  const month = between(daysAgo(29), tomorrow);
  const lastMonth = between(daysAgo(59), daysAgo(29));

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const from = daysAgo(6 - i);
    return { day: WEEKDAYS[from.getDay()], value: round(sum(between(from, daysAgo(5 - i)))) };
  });

  const perRoom = new Map();
  for (const r of week) {
    const { name, color } = r.device.environment;
    perRoom.set(name, { color, kwh: (perRoom.get(name)?.kwh ?? 0) + r.kwh });
  }
  const weekTotal = sum(week);
  const byRoom = [...perRoom]
    .map(([room, { kwh, color }]) => ({
      room,
      percentage: weekTotal ? Math.round((kwh / weekTotal) * 100) : 0,
      kwh: round(kwh),
      color,
    }))
    .sort((a, b) => b.kwh - a.kwh);

  const monthlyKwh = round(sum(month));
  const lastMonthKwh = round(sum(lastMonth));
  return {
    weekly,
    byRoom,
    stats: {
      todayKwh: weekly[6].value,
      weeklyKwh: round(weekTotal),
      monthlyKwh,
      lastMonthKwh,
      costPerKwh,
      monthlyCost: round(monthlyKwh * costPerKwh, 2),
      lastMonthCost: round(lastMonthKwh * costPerKwh, 2),
    },
  };
}
