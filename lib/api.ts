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
  byRoom: EnergyRoom[];
  stats: EnergyStats;
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
  return body as T;
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
}

export const createDevice = (data: CreateDevicePayload) =>
  api<Device>("/devices", { method: "POST", body: JSON.stringify(data) });

export const updateDevice = (id: string, isOn: boolean) =>
  api<Device>(`/devices/${id}`, { method: "PATCH", body: JSON.stringify({ isOn }) });
