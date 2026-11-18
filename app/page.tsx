"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/components/AppShell";
import { ErrorState, Loading } from "@/components/State";
import {
  getMonthlySeries,
  updateDevice,
  type Activity,
  type Device,
  type EnergySummary,
} from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { MAX_FAVORITES, useFavorites } from "@/lib/favorites";
import DeviceCard from "@/components/DeviceCard";
import BarChart from "@/components/BarChart";
import { SimpleActivityLog } from "@/components/ActivityLog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EnergyIcon,
  ShieldIcon,
  DevicesIcon,
  ThermometerIcon,
  BellIcon,
} from "@/components/icons";
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  const { user } = useAuth();
  const { data: devices, setData: setDevices, error, reload } = useApi<Device[]>("/devices");
  const { data: energy } = useApi<EnergySummary>("/energy");
  const { data: recentActivity, reload: reloadActivity } = useApi<Activity[]>("/activity");
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("weekly");
  const {
    favoriteIds,
    favoriteDevices: favorites,
    toggleFavorite,
  } = useFavorites(devices);

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!devices || !energy || !recentActivity) return <Loading />;

  const { weekly: weeklyEnergy, stats: energyStats } = energy;
  const monthlyEnergy = getMonthlySeries(energy);
  const isWeekly = chartPeriod === "weekly";
  const toggleChartPeriod = () =>
    setChartPeriod((prev) => (prev === "weekly" ? "monthly" : "weekly"));
  const onlineCount = devices.filter((d) => d.isOn).length;
  const totalCount = devices.length;

  const toggleDevice = async (id: string) => {
    const current = devices.find((d) => d.id === id);
    if (!current) return;
    const updated = await updateDevice(id, !current.isOn).catch(() => null);
    if (!updated) return;
    setDevices((prev) => prev?.map((d) => (d.id === id ? updated : d)) ?? prev);
    reloadActivity();
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {getGreeting()}, {user?.name} 👋
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
        {/* Weekly / Monthly Energy */}
        <div
          className="glass-card-static relative p-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            type="button"
            onClick={toggleChartPeriod}
            aria-label={isWeekly ? "Ver consumo mensal" : "Ver consumo semanal"}
            title={isWeekly ? "Ver consumo mensal" : "Ver consumo semanal"}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={toggleChartPeriod}
            aria-label={isWeekly ? "Ver consumo mensal" : "Ver consumo semanal"}
            title={isWeekly ? "Ver consumo mensal" : "Ver consumo semanal"}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <ChevronRightIcon size={18} />
          </button>

          <div className="flex items-center justify-between mb-6 px-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isWeekly ? "Consumo Semanal" : "Consumo Mensal"}
              </h2>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                {isWeekly ? "Últimos 7 dias" : "Últimas 4 semanas"}
              </p>
            </div>
            <span className="text-2xl font-bold text-gradient">
              {isWeekly ? energyStats.weeklyKwh : energyStats.monthlyKwh} kWh
            </span>
          </div>
          <div className="px-6">
            <BarChart
              data={isWeekly ? weeklyEnergy : monthlyEnergy}
              maxHeight={140}
            />
          </div>
        </div>

        {/* Favorite Devices */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Dispositivos Favoritos</h2>
            <span className="text-xs font-medium" style={{ color: "#64748b" }}>
              {favorites.length}/{MAX_FAVORITES} favoritos
            </span>
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((device, i) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={toggleDevice}
                  isFavorite={favoriteIds.includes(device.id)}
                  onToggleFavorite={toggleFavorite}
                  delay={i + 5}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card-static p-6 text-center">
              <p className="text-sm font-medium text-white">
                Nenhum dispositivo favorito selecionado
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                Clique na estrela de até {MAX_FAVORITES} cards na tela Dispositivos para exibi-los aqui.
              </p>
            </div>
          )}
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