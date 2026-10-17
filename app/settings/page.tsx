"use client";

import { useState } from "react";
import {
  UserIcon,
  BellIcon,
  HomeIcon,
  ShieldIcon,
  DevicesIcon,
  SettingsIcon,
} from "@/components/icons";
import { mockUser, rooms } from "@/data/mockData";

interface SettingToggleProps {
  label: string;
  description: string;
  defaultOn?: boolean;
}

function SettingToggle({ label, description, defaultOn = false }: SettingToggleProps) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{description}</p>
      </div>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`toggle-track ${isOn ? "active" : ""}`}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in-up">
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Gerencie suas preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile + Rooms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="glass-card-static p-6 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
                color: "#0a0e1a",
              }}
            >
              {mockUser.avatar}
            </div>
            <h2 className="text-lg font-bold text-white">{mockUser.name}</h2>
            <p className="text-sm" style={{ color: "#94a3b8" }}>{mockUser.email}</p>
            <span
              className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0" }}
            >
              {mockUser.role}
            </span>
          </div>

          {/* Rooms */}
          <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <h3 className="text-base font-bold text-white mb-4">Cômodos</h3>
            <div className="space-y-3">
              {rooms
                .filter((r) => r.id !== "all")
                .map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(0,180,216,0.1)",
                          color: "#00b4d8",
                        }}
                      >
                        <HomeIcon size={16} />
                      </div>
                      <span className="text-sm text-white">{room.name}</span>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "#94a3b8",
                      }}
                    >
                      {room.deviceCount} disp.
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,229,160,0.15)", color: "#00e5a0" }}
              >
                <BellIcon size={18} />
              </div>
              <h3 className="text-base font-bold text-white">Notificações</h3>
            </div>
            <SettingToggle
              label="Alertas de Segurança"
              description="Receba notificações sobre eventos de segurança"
              defaultOn={true}
            />
            <SettingToggle
              label="Alertas de Energia"
              description="Aviso quando o consumo ultrapassar o limite"
              defaultOn={true}
            />
            <SettingToggle
              label="Status dos Dispositivos"
              description="Notificar quando dispositivos ficarem offline"
              defaultOn={false}
            />
            <SettingToggle
              label="Relatório Semanal"
              description="Resumo semanal de consumo e atividades"
              defaultOn={true}
            />
          </div>

          {/* Preferences */}
          <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(124,92,252,0.15)", color: "#7c5cfc" }}
              >
                <SettingsIcon size={18} />
              </div>
              <h3 className="text-base font-bold text-white">Preferências</h3>
            </div>
            <SettingToggle
              label="Modo Escuro"
              description="Tema escuro para a interface"
              defaultOn={true}
            />
            <SettingToggle
              label="Automação Inteligente"
              description="Permitir que o sistema sugira automações"
              defaultOn={true}
            />
            <SettingToggle
              label="Economia de Energia"
              description="Desligar dispositivos inativos automaticamente"
              defaultOn={false}
            />
          </div>

          {/* About */}
          <div className="glass-card-static p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,180,216,0.15)", color: "#00b4d8" }}
              >
                <DevicesIcon size={18} />
              </div>
              <h3 className="text-base font-bold text-white">Sobre o Sistema</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Versão", value: "1.0.0-beta" },
                { label: "Plataforma", value: "Automate IoT Hub" },
                { label: "Protocolo", value: "MQTT / Wi-Fi" },
                { label: "Dispositivos Suportados", value: "14 conectados" },
                { label: "Última Atualização", value: "02 Jun 2026" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span className="text-sm" style={{ color: "#94a3b8" }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
