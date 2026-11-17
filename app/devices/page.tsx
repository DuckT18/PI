"use client";

import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import { PlusIcon } from "@/components/icons";
import RoomFilter from "@/components/RoomFilter";
import { ErrorState, Loading } from "@/components/State";
import { updateDevice, type Device, type Room } from "@/lib/api";
import { useApi } from "@/lib/useApi";

export default function DevicesPage() {
  const { data: devices, setData: setDevices, error, reload } = useApi<Device[]>("/devices");
  const { data: rooms } = useApi<Room[]>("/rooms");
  const [activeRoom, setActiveRoom] = useState("all");

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!devices || !rooms) return <Loading />;

  const filteredDevices =
    activeRoom === "all"
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  const onlineCount = devices.filter((d) => d.isOn).length;

  const toggleDevice = async (id: string) => {
    const current = devices.find((d) => d.id === id);
    if (!current) return;
    const updated = await updateDevice(id, !current.isOn).catch(() => null);
    if (updated) setDevices((prev) => prev?.map((d) => (d.id === id ? updated : d)) ?? prev);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in-up">
        <h1 className="page-title">Dispositivos</h1>
        <p className="page-subtitle">
          {onlineCount} de {devices.length} dispositivos ativos
        </p>
      </div>

      {/* Room Filter */}
      <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <RoomFilter
          rooms={rooms}
          activeRoom={activeRoom}
          onSelect={setActiveRoom}
        />
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          type="button"
          aria-label="Adicionar novo dispositivo"
          title="Adicionar novo dispositivo"
          className="glass-card p-5 opacity-0 animate-fade-in-up group cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[144px] transition-all duration-300 hover:scale-[1.02]"
          style={{ animationDelay: "0s" }}
        >
          <PlusIcon
            size={36}
            className="transition-transform duration-300 ease-out group-hover:scale-125 text-[#64748b] group-hover:text-[#00e5a0]"
          />
          <span className="text-xs font-medium text-[#94a3b8] group-hover:text-white transition-colors duration-300">
            Adicionar novo dispositivo
          </span>
        </button>
        {filteredDevices.map((device, i) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={toggleDevice}
            delay={i + 1}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredDevices.length === 0 && (
        <div className="text-center py-16 opacity-0 animate-fade-in-up">
          <p className="text-lg font-medium" style={{ color: "#64748b" }}>
            Nenhum dispositivo neste cômodo
          </p>
        </div>
      )}
    </div>
  );
}