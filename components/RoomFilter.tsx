"use client";

import type { Room } from "@/data/mockData";

interface RoomFilterProps {
  rooms: Room[];
  activeRoom: string;
  onSelect: (roomId: string) => void;
}

export default function RoomFilter({ rooms, activeRoom, onSelect }: RoomFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      {rooms.map((room) => (
        <button
          key={room.id}
          className={`chip ${activeRoom === room.id ? "active" : ""}`}
          onClick={() => onSelect(room.id)}
        >
          {room.name}
        </button>
      ))}
    </div>
  );
}
