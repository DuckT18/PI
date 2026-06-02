"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/ToggleSwitch";
import ActivityLog from "@/components/ActivityLog";
import {
  ShieldIcon,
  LockIcon,
  CameraIcon,
  SensorIcon,
  AlarmIcon,
} from "@/components/icons";
import {
  securityDevices as initialSecDevices,
  securityEvents,
} from "@/data/mockData";

function getSecurityIcon(type: string) {
  switch (type) {
    case "lock": return <LockIcon size={20} />;
    case "camera": return <CameraIcon size={20} />;
    case "sensor": return <SensorIcon size={20} />;
    case "alarm": return <AlarmIcon size={20} />;
    default: return <ShieldIcon size={20} />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "lock": return "#00e5a0";
    case "camera": return "#00b4d8";
    case "sensor": return "#f59e0b";
    case "alarm": return "#ef4444";
    default: return "#64748b";
  }
}

export default function SecurityPage() {
  const [secDevices, setSecDevices] = useState(initialSecDevices);

  const allActive = secDevices.every((d) => d.isActive);
  const activeCount = secDevices.filter((d) => d.isActive).length;

  const toggleSecDevice = (id: string) => {
    setSecDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isActive: !d.isActive } : d
      )
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in-up">
        <h1 className="page-title">Segurança</h1>
        <p className="page-subtitle">Monitoramento em tempo real</p>
      </div>

      {/* System Status Card */}
      <div
        className="glass-card-static p-6 mb-8 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: allActive
                ? "rgba(0,229,160,0.15)"
                : "rgba(239,68,68,0.15)",
              color: allActive ? "#00e5a0" : "#ef4444",
            }}
          >
            <ShieldIcon size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              {allActive ? "Sistema Protegido" : "Atenção Necessária"}
            </h2>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              {activeCount} de {secDevices.length} dispositivos ativos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="status-dot animate-pulse-dot"
              style={{
                background: allActive ? "#00e5a0" : "#ef4444",
                boxShadow: `0 0 8px ${allActive ? "rgba(0,229,160,0.5)" : "rgba(239,68,68,0.5)"}`,
              }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: allActive ? "#00e5a0" : "#ef4444" }}
            >
              {allActive ? "Ativo" : "Alerta"}
            </span>
          </div>
        </div>
      </div>

      {/* Two columns: Devices + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Devices */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Dispositivos de Segurança
          </h2>
          <div className="space-y-3">
            {secDevices.map((device, i) => {
              const color = getTypeColor(device.type);
              return (
                <div
                  key={device.id}
                  className="glass-card-static p-4 flex items-center gap-4 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${color}20`,
                      color: device.isActive ? color : "#64748b",
                    }}
                  >
                    {getSecurityIcon(device.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {device.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`status-dot ${device.isActive ? "online" : "offline"}`}
                      />
                      <span className="text-xs" style={{ color: "#94a3b8" }}>
                        {device.status} • {device.location}
                      </span>
                    </div>
                  </div>
                  <ToggleSwitch
                    isOn={device.isActive}
                    onToggle={() => toggleSecDevice(device.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Registro de Atividades
          </h2>
          <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <ActivityLog events={securityEvents} maxItems={8} />
          </div>
        </div>
      </div>
    </div>
  );
}