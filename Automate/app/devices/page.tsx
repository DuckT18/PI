"use client";

import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import RoomFilter from "@/components/RoomFilter";
import { devices as initialDevices, rooms } from "@/data/mockData";

export default function DevicesPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [activeRoom, setActiveRoom] = useState("all");

  const filteredDevices =
    activeRoom === "all"
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  const onlineCount = devices.filter((d) => d.isOn).length;

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isOn: !d.isOn, value: !d.isOn ? d.value : "Desl." } : d
      )
    );
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
        {filteredDevices.map((device, i) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={toggleDevice}
            delay={i}
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