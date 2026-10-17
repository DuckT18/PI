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

const navItems = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/devices", label: "Disp.", icon: DevicesIcon },
  { href: "/security", label: "Segurança", icon: ShieldIcon },
  { href: "/energy", label: "Energia", icon: EnergyIcon },
  { href: "/settings", label: "Config.", icon: SettingsIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
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
            className={`bottom-nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}