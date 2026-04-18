"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  const active = (p: string) =>
    path === p ? "text-green-400" : "text-gray-500";

  return (
    <nav className="fixed bottom-0 w-full flex justify-around p-4 bg-[#111316]">
      <Link href="/" className={active("/")}>Dashboard</Link>
      <Link href="/devices" className={active("/devices")}>Devices</Link>
      <Link href="/security" className={active("/security")}>Security</Link>
      <Link href="/energy" className={active("/energy")}>Energy</Link>
    </nav>
  );
}