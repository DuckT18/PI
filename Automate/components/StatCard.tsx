"use client";

import { type ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  trendValue?: string;
  accentColor?: string;
  delay?: number;
}

export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  trendValue,
  accentColor = "#00e5a0",
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="glass-card p-5 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay * 0.08}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <div
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{
              color: trend === "down" ? "#00e5a0" : "#ef4444",
              background: trend === "down" ? "rgba(0,229,160,0.1)" : "rgba(239,68,68,0.1)",
            }}
          >
            <span>{trend === "down" ? "↓" : "↑"}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
        {label}
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: accentColor }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
