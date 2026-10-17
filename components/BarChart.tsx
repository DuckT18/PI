"use client";

import type { EnergyDay } from "@/data/mockData";

interface BarChartProps {
  data: EnergyDay[];
  maxHeight?: number;
}

export default function BarChart({ data, maxHeight = 160 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-3" style={{ height: maxHeight }}>
      {data.map((item, i) => {
        const heightPercent = (item.value / max) * 100;
        return (
          <div key={item.day} className="chart-bar-wrapper">
            <div
              className="chart-bar animate-grow-up"
              style={{
                height: `${heightPercent}%`,
                animationDelay: `${i * 0.08}s`,
                opacity: 0,
                animation: `growUp 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s forwards, fadeIn 0.4s ease ${i * 0.08}s forwards`,
              }}
            >
              <span className="tooltip">{item.value} kWh</span>
            </div>
            <span className="text-xs font-medium" style={{ color: "#64748b" }}>
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
