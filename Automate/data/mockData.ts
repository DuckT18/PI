// ─── Types ──────────────────────────────────────────────────────
export interface Device {
  id: string;
  name: string;
  room: string;
  type: "light" | "ac" | "tv" | "speaker" | "camera" | "lock" | "sensor" | "plug" | "fan" | "curtain";
  isOn: boolean;
  value?: string;
}

export interface Room {
  id: string;
  name: string;
  deviceCount: number;
}

export interface EnergyDay {
  day: string;
  value: number;
}

export interface EnergyRoom {
  room: string;
  percentage: number;
  kwh: number;
  color: string;
}

export interface SecurityEvent {
  id: string;
  type: "door" | "camera" | "motion" | "alarm" | "system";
  title: string;
  description: string;
  time: string;
  status: "info" | "warning" | "success";
}

export interface SecurityDevice {
  id: string;
  name: string;
  type: "lock" | "camera" | "sensor" | "alarm";
  status: string;
  isActive: boolean;
  location: string;
}

// ─── Usuário ────────────────────────────────────────────────────
export const mockUser = {
  name: "Arthur",
  email: "arthur.melo@automate.io",
  avatar: "AM",
  role: "Administrador",
};

// ─── Cômodos ────────────────────────────────────────────────────
export const rooms: Room[] = [
  { id: "all", name: "Todos", deviceCount: 14 },
  { id: "living", name: "Sala de Estar", deviceCount: 4 },
  { id: "kitchen", name: "Cozinha", deviceCount: 3 },
  { id: "bedroom", name: "Quarto", deviceCount: 3 },
  { id: "office", name: "Escritório", deviceCount: 2 },
  { id: "garage", name: "Garagem", deviceCount: 2 },
];

// ─── Dispositivos ───────────────────────────────────────────────
export const devices: Device[] = [
  { id: "d1", name: "Ar Condicionado", room: "living", type: "ac", isOn: true, value: "22°C" },
  { id: "d2", name: "Smart TV", room: "living", type: "tv", isOn: true, value: "Netflix" },
  { id: "d3", name: "Luz do Teto", room: "living", type: "light", isOn: true, value: "80%" },
  { id: "d4", name: "Caixa de Som", room: "living", type: "speaker", isOn: true, value: "Tocando" },
  { id: "d5", name: "Luz Pendente", room: "kitchen", type: "light", isOn: true, value: "100%" },
  { id: "d6", name: "Tomada Inteligente", room: "kitchen", type: "plug", isOn: false, value: "Desl." },
  { id: "d7", name: "Exaustor", room: "kitchen", type: "fan", isOn: false, value: "Desl." },
  { id: "d8", name: "Abajur", room: "bedroom", type: "light", isOn: false, value: "Desl." },
  { id: "d9", name: "Ar Condicionado", room: "bedroom", type: "ac", isOn: true, value: "24°C" },
  { id: "d10", name: "Cortina Inteligente", room: "bedroom", type: "curtain", isOn: true, value: "Aberta" },
  { id: "d11", name: "Luminária de Mesa", room: "office", type: "light", isOn: true, value: "60%" },
  { id: "d12", name: "Tomada Inteligente", room: "office", type: "plug", isOn: true, value: "120W" },
  { id: "d13", name: "Luz da Garagem", room: "garage", type: "light", isOn: false, value: "Desl." },
  { id: "d14", name: "Câmera de Segurança", room: "garage", type: "camera", isOn: true, value: "Gravando" },
];

// ─── Energia ────────────────────────────────────────────────────
export const weeklyEnergy: EnergyDay[] = [
  { day: "Seg", value: 18.2 },
  { day: "Ter", value: 14.5 },
  { day: "Qua", value: 22.1 },
  { day: "Qui", value: 16.8 },
  { day: "Sex", value: 20.4 },
  { day: "Sáb", value: 25.3 },
  { day: "Dom", value: 19.7 },
];

export const energyByRoom: EnergyRoom[] = [
  { room: "Sala de Estar", percentage: 35, kwh: 48.6, color: "#00e5a0" },
  { room: "Cozinha", percentage: 25, kwh: 34.7, color: "#00b4d8" },
  { room: "Quarto", percentage: 20, kwh: 27.8, color: "#7c5cfc" },
  { room: "Escritório", percentage: 12, kwh: 16.7, color: "#f59e0b" },
  { room: "Garagem", percentage: 8, kwh: 11.1, color: "#ef4444" },
];

export const energyStats = {
  todayKwh: 4.2,
  weeklyKwh: 137.0,
  monthlyKwh: 542.0,
  lastMonthKwh: 598.0,
  costPerKwh: 0.85,
  monthlyCost: 460.7,
  lastMonthCost: 508.3,
};

export const energyTips = [
  {
    id: "t1",
    title: "Otimize a Temperatura do AC",
    description: "Ajustar o ar condicionado para 24°C ao invés de 22°C pode economizar até 15% nos custos de refrigeração.",
    savings: "~R$ 25/mês",
  },
  {
    id: "t2",
    title: "Agendamento Inteligente de Luzes",
    description: "Automatize as luzes para desligar entre 8h e 17h para reduzir o uso desnecessário.",
    savings: "~R$ 12/mês",
  },
  {
    id: "t3",
    title: "Consumo em Standby",
    description: "Use tomadas inteligentes para cortar o consumo standby dos aparelhos durante a noite.",
    savings: "~R$ 8/mês",
  },
];

// ─── Segurança ──────────────────────────────────────────────────
export const securityDevices: SecurityDevice[] = [
  { id: "s1", name: "Porta Principal", type: "lock", status: "Trancada", isActive: true, location: "Entrada" },
  { id: "s2", name: "Porta dos Fundos", type: "lock", status: "Trancada", isActive: true, location: "Cozinha" },
  { id: "s3", name: "Câmera da Sala", type: "camera", status: "Gravando", isActive: true, location: "Sala de Estar" },
  { id: "s4", name: "Câmera da Garagem", type: "camera", status: "Gravando", isActive: true, location: "Garagem" },
  { id: "s5", name: "Câmera da Entrada", type: "camera", status: "Gravando", isActive: true, location: "Entrada" },
  { id: "s6", name: "Sensor de Movimento", type: "sensor", status: "Sem Atividade", isActive: true, location: "Corredor" },
  { id: "s7", name: "Sensor de Janela", type: "sensor", status: "Fechada", isActive: true, location: "Quarto" },
  { id: "s8", name: "Sistema de Alarme", type: "alarm", status: "Armado", isActive: true, location: "Painel Principal" },
];

export const securityEvents: SecurityEvent[] = [
  { id: "e1", type: "door", title: "Porta Principal Destrancada", description: "Destrancada pelo app por Arthur", time: "2 min atrás", status: "info" },
  { id: "e2", type: "camera", title: "Movimento Detectado", description: "Câmera da entrada detectou movimento", time: "15 min atrás", status: "warning" },
  { id: "e3", type: "system", title: "Sistema Armado", description: "Sistema de segurança ativado no modo Casa", time: "1 h atrás", status: "success" },
  { id: "e4", type: "door", title: "Porta Principal Trancada", description: "Trancada automaticamente após 30 segundos", time: "1 h atrás", status: "success" },
  { id: "e5", type: "motion", title: "Sensor de Movimento Ativado", description: "Sensor do corredor detectou movimento", time: "2 h atrás", status: "info" },
  { id: "e6", type: "camera", title: "Câmera Offline", description: "Câmera da garagem ficou offline brevemente", time: "3 h atrás", status: "warning" },
  { id: "e7", type: "system", title: "Sistema Desarmado", description: "Desarmado pelo teclado", time: "5 h atrás", status: "info" },
  { id: "e8", type: "alarm", title: "Teste de Alarme", description: "Teste mensal do sistema de alarme concluído", time: "1 dia atrás", status: "success" },
  { id: "e9", type: "door", title: "Porta dos Fundos Aberta", description: "Porta aberta por dentro", time: "1 dia atrás", status: "info" },
  { id: "e10", type: "motion", title: "Movimento Detectado", description: "Sensor da janela do quarto ativado", time: "2 dias atrás", status: "warning" },
];

// ─── Atividades Recentes (Dashboard) ────────────────────────────
export const recentActivity = [
  { id: "a1", icon: "light" as const, text: "Luz da sala ligada", time: "2 min atrás" },
  { id: "a2", icon: "ac" as const, text: "AC do quarto ajustado para 24°C", time: "15 min atrás" },
  { id: "a3", icon: "lock" as const, text: "Porta trancada automaticamente", time: "1 h atrás" },
  { id: "a4", icon: "tv" as const, text: "Smart TV desligada", time: "2 h atrás" },
  { id: "a5", icon: "plug" as const, text: "Tomada da cozinha ativada", time: "3 h atrás" },
];
