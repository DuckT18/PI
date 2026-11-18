"use client";

import Link from "next/link";
import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import { PlusIcon } from "@/components/icons";
import RoomFilter from "@/components/RoomFilter";
import { ErrorState, Loading } from "@/components/State";
import { updateDevice, type Device, type Room } from "@/lib/api";
import { MAX_FAVORITES, useFavorites } from "@/lib/favorites";
import { useApi } from "@/lib/useApi";

export default function DevicesPage() {
  const { data: devices, setData: setDevices, error, reload } = useApi<Device[]>("/devices");
  const { data: rooms } = useApi<Room[]>("/rooms");
  const [activeRoom, setActiveRoom] = useState("all");
  const { favoriteIds, toggleFavorite, limitWarning } = useFavorites(devices);

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
      <div className="mb-6 opacity-0 animate-fade-in-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Dispositivos</h1>
          <p className="page-subtitle">
            {onlineCount} de {devices.length} dispositivos ativos • {favoriteIds.length}/{MAX_FAVORITES} favoritos
          </p>
        </div>
        {limitWarning && (
          <div
            role="alert"
            className="rounded-xl px-4 py-2.5 text-xs font-medium animate-fade-in"
            style={{
              background: "rgba(245, 158, 11, 0.14)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#fbbf24",
            }}
          >
            {limitWarning}
          </div>
        )}
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
        <Link
          href="/devices/new-device"
          aria-label="Adicionar novo dispositivo"
          title="Adicionar novo dispositivo"
          className="glass-card p-5 opacity-0 animate-fade-in-up group cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[144px] transition-all duration-300 hover:scale-[1.02]"
          style={{ animationDelay: "0s" }}
        >
          <PlusIcon
            size={36}
            className="transition-transform duration-300 ease-out group-hover:scale-125 text-[#64748b] group-hover:text-[#00e5a0]"
          />
          <span className="text-xs font-medium text-[#94a3b8] group-hover:text-white transition-colors duration-300 text-center">
            Adicionar novo dispositivo
          </span>
        </Link>
        {filteredDevices.map((device, i) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={toggleDevice}
            isFavorite={favoriteIds.includes(device.id)}
            onToggleFavorite={toggleFavorite}
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