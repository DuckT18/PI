import type {
  Device,
  EnergyDay,
  EnergyRoom,
  Room,
  SecurityDevice,
  SecurityEvent,
} from "@/data/mockData";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002/api";

const TOKEN_KEY = "automate_token";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface EnergyStats {
  todayKwh: number;
  weeklyKwh: number;
  monthlyKwh: number;
  lastMonthKwh: number;
  costPerKwh: number;
  monthlyCost: number;
  lastMonthCost: number;
}

export interface EnergySummary {
  weekly: EnergyDay[];
  monthly?: EnergyDay[];
  byRoom: EnergyRoom[];
  stats: EnergyStats;
}

/** Retorna a série mensal por semana, com fallback calculado quando a API ainda não envia `monthly`. */
export function getMonthlySeries(energy: EnergySummary): EnergyDay[] {
  if (energy.monthly && energy.monthly.length > 0) {
    return energy.monthly;
  }

  const monthlyTotal = energy.stats.monthlyKwh;
  if (monthlyTotal <= 0) {
    return [
      { day: "Sem 1", value: 0 },
      { day: "Sem 2", value: 0 },
      { day: "Sem 3", value: 0 },
      { day: "Sem 4", value: 0 },
    ];
  }

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const sem4 = Math.min(energy.stats.weeklyKwh, monthlyTotal);
  const remaining = Math.max(0, monthlyTotal - sem4);
  const sem1 = round1(remaining * 0.32);
  const sem2 = round1(remaining * 0.36);
  const sem3 = round1(Math.max(0, remaining - sem1 - sem2));

  return [
    { day: "Sem 1", value: sem1 },
    { day: "Sem 2", value: sem2 },
    { day: "Sem 3", value: sem3 },
    { day: "Sem 4", value: round1(sem4) },
  ];
}

export interface SecuritySummary {
  devices: SecurityDevice[];
  events: SecurityEvent[];
}

export interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
}

export type { Device, Room };

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // armazenamento indisponível: a sessão vale só até recarregar a página
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor");
  }

  if (res.status === 401 && path !== "/auth/login") {
    setToken(null);
    if (typeof window !== "undefined") window.location.assign("/login");
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body?.error ?? "Erro inesperado");
  if (path === "/energy" && body && !Array.isArray((body as EnergySummary).monthly)) {
    return applyCustomDeviceConsumption(body as EnergySummary) as T;
  }
  return body as T;
}

const CUSTOM_CONSUMPTION_KEY = "automate_device_consumption";

interface StoredConsumptionEntry {
  deviceId: string;
  room: string;
  kwh: number;
}

const ROOM_NAME_MAP: Record<string, { name: string; color: string }> = {
  living: { name: "Sala de Estar", color: "#00e5a0" },
  kitchen: { name: "Cozinha", color: "#00b4d8" },
  bedroom: { name: "Quarto", color: "#7c5cfc" },
  office: { name: "Escritório", color: "#f59e0b" },
  garage: { name: "Garagem", color: "#ef4444" },
  entrance: { name: "Entrada", color: "#94a3b8" },
  hallway: { name: "Corredor", color: "#94a3b8" },
  portable: { name: "Portátil", color: "#00e5a0" },
};

export function saveDeviceConsumption(deviceId: string, room: string, kwh: number) {
  if (typeof window === "undefined" || kwh <= 0) return;
  try {
    const raw = localStorage.getItem(CUSTOM_CONSUMPTION_KEY);
    const list: StoredConsumptionEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = Array.isArray(list)
      ? list.filter((item) => item.deviceId !== deviceId)
      : [];
    filtered.push({ deviceId, room, kwh });
    localStorage.setItem(CUSTOM_CONSUMPTION_KEY, JSON.stringify(filtered));
  } catch {
    // ignore storage errors
  }
}

export function applyCustomDeviceConsumption(energy: EnergySummary): EnergySummary {
  if (typeof window === "undefined") return energy;
  try {
    const raw = localStorage.getItem(CUSTOM_CONSUMPTION_KEY);
    if (!raw) return energy;
    const entries: StoredConsumptionEntry[] = JSON.parse(raw);
    if (!Array.isArray(entries) || entries.length === 0) return energy;

    const extraTotal = entries.reduce((sum, item) => sum + (Number(item.kwh) || 0), 0);
    if (extraTotal <= 0) return energy;

    const round1 = (n: number) => Math.round(n * 10) / 10;
    const round2 = (n: number) => Math.round(n * 100) / 100;

    const weekly = energy.weekly.map((day, idx) =>
      idx === energy.weekly.length - 1 ? { ...day, value: round1(day.value + extraTotal) } : day,
    );

    const roomMap = new Map(
      energy.byRoom.map((r) => [r.room, { ...r }]),
    );
    for (const entry of entries) {
      const meta = ROOM_NAME_MAP[entry.room] ?? { name: entry.room, color: "#00e5a0" };
      const existing = roomMap.get(meta.name);
      if (existing) {
        existing.kwh = round1(existing.kwh + entry.kwh);
      } else {
        roomMap.set(meta.name, {
          room: meta.name,
          kwh: round1(entry.kwh),
          percentage: 0,
          color: meta.color,
        });
      }
    }

    const totalRoomKwh = Array.from(roomMap.values()).reduce((sum, r) => sum + r.kwh, 0);
    const byRoom = Array.from(roomMap.values())
      .map((r) => ({
        ...r,
        percentage: totalRoomKwh > 0 ? Math.round((r.kwh / totalRoomKwh) * 100) : 0,
      }))
      .sort((a, b) => b.kwh - a.kwh);

    const monthlyKwh = round1(energy.stats.monthlyKwh + extraTotal);
    return {
      ...energy,
      weekly,
      byRoom,
      stats: {
        ...energy.stats,
        todayKwh: round1(energy.stats.todayKwh + extraTotal),
        weeklyKwh: round1(energy.stats.weeklyKwh + extraTotal),
        monthlyKwh,
        monthlyCost: round2(monthlyKwh * energy.stats.costPerKwh),
      },
    };
  } catch {
    return energy;
  }
}

export async function login(email: string, password: string): Promise<UserProfile> {
  const { token, user } = await api<{ token: string; user: UserProfile }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(token);
  return user;
}

export interface CreateDevicePayload {
  name: string;
  room: string;
  type: Device["type"];
  isOn?: boolean;
  value?: string;
  productCode?: string;
  connectionType?: Device["connectionType"];
  consumption?: number;
}

export const createDevice = async (data: CreateDevicePayload) => {
  const created = await api<Device>("/devices", { method: "POST", body: JSON.stringify(data) });
  if (typeof data.consumption === "number" && data.consumption > 0) {
    saveDeviceConsumption(created.id, data.room, data.consumption);
  }
  return created;
};

export const updateDevice = (id: string, isOn: boolean) =>
  api<Device>(`/devices/${id}`, { method: "PATCH", body: JSON.stringify({ isOn }) });
