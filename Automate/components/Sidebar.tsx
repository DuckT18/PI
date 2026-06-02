"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DevicesIcon,
  ShieldIcon,
  EnergyIcon,
  SettingsIcon,
} from "./icons";
import { mockUser } from "@/data/mockData";

const navItems = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/devices", label: "Dispositivos", icon: DevicesIcon },
  { href: "/security", label: "Segurança", icon: ShieldIcon },
  { href: "/energy", label: "Energia", icon: EnergyIcon },
  { href: "/settings", label: "Configurações", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
          }}
        >
          <EnergyIcon size={18} className="text-black" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Automate
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-4 mb-2"
          style={{ color: "#64748b" }}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mt-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
            color: "#0a0e1a",
          }}
        >
          {mockUser.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {mockUser.name}
          </p>
          <p className="text-xs truncate" style={{ color: "#64748b" }}>
            {mockUser.role}
          </p>
        </div>
      </div>
    </aside>
  );
}
