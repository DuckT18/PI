"use client";

import { getDeviceIcon, StarIcon } from "./icons";
import ToggleSwitch from "./ToggleSwitch";
import type { Device } from "@/data/mockData";

const ROOM_LABELS: Record<string, string> = {
  living: "Sala de Estar",
  kitchen: "Cozinha",
  bedroom: "Quarto",
  office: "Escritório",
  garage: "Garagem",
  entrance: "Entrada",
  hallway: "Corredor",
  portable: "Portátil",
};

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  delay?: number;
}

export default function DeviceCard({
  device,
  onToggle,
  isFavorite = false,
  onToggleFavorite,
  delay = 0,
}: DeviceCardProps) {
  const roomLabel = ROOM_LABELS[device.room] ?? device.room;

  return (
    <div
      className={`glass-card p-5 opacity-0 animate-fade-in-up ${
        device.isOn ? "glow-accent" : ""
      }`}
      style={{
        animationDelay: `${delay * 0.06}s`,
        borderColor: device.isOn ? "rgba(0,229,160,0.15)" : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300"
          style={{
            background: device.isOn ? "rgba(0,229,160,0.15)" : "rgba(100,116,139,0.15)",
            color: device.isOn ? "#00e5a0" : "#64748b",
          }}
        >
          {getDeviceIcon(device.type, 22)}
        </div>
        <ToggleSwitch
          isOn={device.isOn}
          onToggle={() => onToggle(device.id)}
        />
      </div>

      <h3 className="font-semibold text-sm text-white truncate">{device.name}</h3>
      <p
        className="text-[11px] truncate mt-0.5"
        style={{ color: "#94a3b8" }}
      >
        {roomLabel}
      </p>

      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`status-dot ${device.isOn ? "online" : "offline"}`}
          />
          <span
            className="text-xs font-medium truncate"
            style={{ color: device.isOn ? "#00e5a0" : "#64748b" }}
          >
            {device.value}
          </span>
        </div>

        {onToggleFavorite && (
          <div className="relative group/star shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(device.id);
              }}
              aria-label="marcar como favorito"
              title="marcar como favorito"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
              style={{
                background: isFavorite
                  ? "rgba(245, 158, 11, 0.16)"
                  : "rgba(255, 255, 255, 0.04)",
                color: isFavorite ? "#f59e0b" : "#64748b",
              }}
            >
              <StarIcon size={15} filled={isFavorite} />
            </button>
            <span
              className="pointer-events-none absolute right-0 -top-8 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap opacity-0 group-hover/star:opacity-100 transition-opacity duration-200 z-20 shadow-lg"
              style={{
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              marcar como favorito
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
