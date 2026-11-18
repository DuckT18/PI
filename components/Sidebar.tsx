"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DevicesIcon,
  ShieldIcon,
  EnergyIcon,
  SettingsIcon,
} from "./icons";
import { useAuth } from "./AppShell";

const navItems = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/devices", label: "Dispositivos", icon: DevicesIcon },
  { href: "/security", label: "Segurança", icon: ShieldIcon },
  { href: "/energy", label: "Energia", icon: EnergyIcon },
  { href: "/settings", label: "Configurações", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapsedByTimerRef = useRef(false);

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearCollapseTimer();
  }, []);

  const handleMouseEnter = () => {
    clearCollapseTimer();
    collapsedByTimerRef.current = false;
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    clearCollapseTimer();
    collapsedByTimerRef.current = false;
    setIsExpanded(false);
  };

  const handleMouseMove = () => {
    if (collapsedByTimerRef.current) {
      collapsedByTimerRef.current = false;
      setIsExpanded(true);
    }
  };

  const handleLinkClick = () => {
    clearCollapseTimer();
    collapsedByTimerRef.current = false;
    collapseTimerRef.current = setTimeout(() => {
      collapsedByTimerRef.current = true;
      setIsExpanded(false);
      collapseTimerRef.current = null;
    }, 2000);
  };

  return (
    <aside
      className={`sidebar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-1.5 mb-8 overflow-hidden">
        <div
          className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
          }}
        >
          <EnergyIcon size={18} className="text-black" />
        </div>
        <span className="sidebar-label text-lg font-bold text-white tracking-tight">
          Automate
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        <p
          className="sidebar-label text-xs font-semibold uppercase tracking-wider px-3.5 mb-2"
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
              title={item.label}
              onClick={handleLinkClick}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        className="flex items-center gap-3 px-1.5 py-2.5 rounded-xl mt-4 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
          title={user?.name}
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
            color: "#0a0e1a",
          }}
        >
          {user?.avatar}
        </div>
        <div className="sidebar-label flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs truncate" style={{ color: "#64748b" }}>
            {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="sidebar-label text-xs font-medium shrink-0 pr-2 hover:text-white transition-colors"
          style={{ color: "#94a3b8" }}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
