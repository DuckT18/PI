"use client";

import { getDeviceIcon } from "./icons";
import { LockIcon, CameraIcon, SensorIcon, AlarmIcon } from "./icons";
import type { SecurityEvent } from "@/data/mockData";

interface ActivityLogProps {
  events: SecurityEvent[];
  maxItems?: number;
}

function getEventIcon(type: string) {
  switch (type) {
    case "door": return <LockIcon size={14} />;
    case "camera": return <CameraIcon size={14} />;
    case "motion": return <SensorIcon size={14} />;
    case "alarm": return <AlarmIcon size={14} />;
    case "system": return <AlarmIcon size={14} />;
    default: return <SensorIcon size={14} />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "success": return "#00e5a0";
    case "warning": return "#f59e0b";
    case "info": return "#00b4d8";
    default: return "#64748b";
  }
}

export default function ActivityLog({ events, maxItems = 8 }: ActivityLogProps) {
  const displayEvents = events.slice(0, maxItems);

  return (
    <div className="relative pl-8 space-y-0">
      <div className="timeline-line" />
      {displayEvents.map((event, i) => {
        const color = getStatusColor(event.status);
        return (
          <div
            key={event.id}
            className="relative flex gap-4 py-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div
              className="timeline-dot mt-1"
              style={{ borderColor: color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color }}>{getEventIcon(event.type)}</span>
                <span className="text-sm font-medium text-white truncate">
                  {event.title}
                </span>
              </div>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                {event.description}
              </p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                {event.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Simplified version for dashboard
interface SimpleActivityProps {
  activities: { id: string; icon: string; text: string; time: string }[];
}

export function SimpleActivityLog({ activities }: SimpleActivityProps) {
  return (
    <div className="space-y-1">
      {activities.map((a, i) => (
        <div
          key={a.id}
          className="flex items-center gap-3 py-3 px-4 rounded-xl opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${i * 0.06}s`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ color: "#00e5a0" }}>
            {getDeviceIcon(a.icon, 16)}
          </span>
          <span className="text-sm text-white flex-1 truncate">{a.text}</span>
          <span className="text-xs flex-shrink-0" style={{ color: "#64748b" }}>
            {a.time}
          </span>
        </div>
      ))}
    </div>
  );
}
