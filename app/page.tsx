"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import DeviceCard from "@/components/DeviceCard";
import BarChart from "@/components/BarChart";
import { SimpleActivityLog } from "@/components/ActivityLog";
import {
  EnergyIcon,
  ShieldIcon,
  DevicesIcon,
  ThermometerIcon,
  BellIcon,
} from "@/components/icons";
import {
  devices as initialDevices,
  weeklyEnergy,
  recentActivity,
  mockUser,
  energyStats,
} from "@/data/mockData";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  const [devices, setDevices] = useState(initialDevices);

  const onlineCount = devices.filter((d) => d.isOn).length;
  const totalCount = devices.length;

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isOn: !d.isOn, value: !d.isOn ? d.value : "Desl." } : d
      )
    );
  };

  // Favorites: first 4 devices
  const favorites = devices.slice(0, 4);

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {getGreeting()}, {mockUser.name} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            Todos os sistemas operacionais
          </p>
        </div>
        <button
          className="relative w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <BellIcon size={20} className="text-white" />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse-dot"
            style={{ background: "#00e5a0" }}
          />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<EnergyIcon size={20} />}
          label="Energia Hoje"
          value={`${energyStats.todayKwh} kWh`}
          subtitle="Consumo do dia"
          trend="down"
          trendValue="12%"
          accentColor="#00e5a0"
          delay={1}
        />
        <StatCard
          icon={<ShieldIcon size={20} />}
          label="Segurança"
          value="Ativo"
          subtitle="Todos os sensores online"
          accentColor="#00b4d8"
          delay={2}
        />
        <StatCard
          icon={<DevicesIcon size={20} />}
          label="Dispositivos"
          value={`${onlineCount}/${totalCount}`}
          subtitle="Conectados agora"
          accentColor="#7c5cfc"
          delay={3}
        />
        <StatCard
          icon={<ThermometerIcon size={20} />}
          label="Temperatura"
          value="23°C"
          subtitle="Média da casa"
          accentColor="#f59e0b"
          delay={4}
        />
      </div>

      {/* Two columns: Chart + Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Energy */}
        <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Consumo Semanal</h2>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                Últimos 7 dias
              </p>
            </div>
            <span className="text-2xl font-bold text-gradient">
              {energyStats.weeklyKwh} kWh
            </span>
          </div>
          <BarChart data={weeklyEnergy} maxHeight={140} />
        </div>

        {/* Favorite Devices */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Dispositivos Favoritos</h2>
            <span className="text-xs font-medium" style={{ color: "#64748b" }}>
              {onlineCount} ativos
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((device, i) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={toggleDevice}
                delay={i + 5}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <h2 className="text-lg font-bold text-white mb-4">Atividade Recente</h2>
        <SimpleActivityLog activities={recentActivity} />
      </div>
    </div>
  );
}