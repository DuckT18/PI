"use client";

import BarChart from "@/components/BarChart";
import StatCard from "@/components/StatCard";
import {
  EnergyIcon,
  TrendDownIcon,
  TipIcon,
} from "@/components/icons";
import {
  weeklyEnergy,
  energyByRoom,
  energyStats,
  energyTips,
} from "@/data/mockData";

export default function EnergyPage() {
  const savingsPercent = Math.round(
    ((energyStats.lastMonthKwh - energyStats.monthlyKwh) / energyStats.lastMonthKwh) * 100
  );
  const costSavings = (energyStats.lastMonthCost - energyStats.monthlyCost).toFixed(2);

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in-up">
        <h1 className="page-title">Energia</h1>
        <p className="page-subtitle">Monitoramento de consumo energético</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<EnergyIcon size={20} />}
          label="Hoje"
          value={`${energyStats.todayKwh} kWh`}
          accentColor="#00e5a0"
          delay={1}
        />
        <StatCard
          icon={<EnergyIcon size={20} />}
          label="Esta Semana"
          value={`${energyStats.weeklyKwh} kWh`}
          accentColor="#00b4d8"
          delay={2}
        />
        <StatCard
          icon={<EnergyIcon size={20} />}
          label="Este Mês"
          value={`${energyStats.monthlyKwh} kWh`}
          subtitle={`Mês anterior: ${energyStats.lastMonthKwh} kWh`}
          trend="down"
          trendValue={`${savingsPercent}%`}
          accentColor="#7c5cfc"
          delay={3}
        />
        <StatCard
          icon={<EnergyIcon size={20} />}
          label="Custo Mensal"
          value={`R$ ${energyStats.monthlyCost.toFixed(0)}`}
          subtitle={`Economia: R$ ${costSavings}`}
          trend="down"
          trendValue={`R$ ${costSavings}`}
          accentColor="#f59e0b"
          delay={4}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Consumo Semanal</h2>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                kWh por dia da semana
              </p>
            </div>
          </div>
          <BarChart data={weeklyEnergy} maxHeight={180} />
        </div>

        {/* Room Breakdown */}
        <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          <h2 className="text-lg font-bold text-white mb-6">Consumo por Cômodo</h2>
          <div className="space-y-5">
            {energyByRoom.map((room, i) => (
              <div
                key={room.room}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + i * 0.06}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{room.room}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#94a3b8" }}>
                      {room.kwh} kWh
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: room.color }}
                    >
                      {room.percentage}%
                    </span>
                  </div>
                </div>
                <div className="room-bar-track">
                  <div
                    className="room-bar-fill animate-grow-right"
                    style={{
                      width: `${room.percentage}%`,
                      background: `linear-gradient(90deg, ${room.color}, ${room.color}88)`,
                      animationDelay: `${0.5 + i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="glass-card-static p-6 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <h2 className="text-lg font-bold text-white mb-4">Comparação Mensal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <p className="text-sm mb-2" style={{ color: "#94a3b8" }}>Mês Anterior</p>
            <p className="text-3xl font-bold" style={{ color: "#64748b" }}>
              {energyStats.lastMonthKwh} kWh
            </p>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              R$ {energyStats.lastMonthCost.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(0,229,160,0.1)" }}>
              <TrendDownIcon size={18} className="text-[#00e5a0]" />
              <span className="text-lg font-bold" style={{ color: "#00e5a0" }}>
                -{savingsPercent}%
              </span>
            </div>
          </div>
          <div className="text-center p-4">
            <p className="text-sm mb-2" style={{ color: "#94a3b8" }}>Mês Atual</p>
            <p className="text-3xl font-bold text-gradient">
              {energyStats.monthlyKwh} kWh
            </p>
            <p className="text-sm mt-1" style={{ color: "#00e5a0" }}>
              R$ {energyStats.monthlyCost.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Energy Tips */}
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.55s" }}>
        <h2 className="text-lg font-bold text-white mb-4">Dicas de Economia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {energyTips.map((tip, i) => (
            <div
              key={tip.id}
              className="glass-card p-5 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.08}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
                >
                  <TipIcon size={18} />
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}
                >
                  {tip.savings}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{tip.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}