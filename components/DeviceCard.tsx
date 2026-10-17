"use client";

import { getDeviceIcon } from "./icons";
import ToggleSwitch from "./ToggleSwitch";
import type { Device } from "@/data/mockData";

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  delay?: number;
}

export default function DeviceCard({ device, onToggle, delay = 0 }: DeviceCardProps) {
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

      <div className="flex items-center gap-2 mt-2">
        <span
          className={`status-dot ${device.isOn ? "online" : "offline"}`}
        />
        <span
          className="text-xs font-medium"
          style={{ color: device.isOn ? "#00e5a0" : "#64748b" }}
        >
          {device.value}
        </span>
      </div>
    </div>
  );
}
