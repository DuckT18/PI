"use client";

import Link from "next/link";

export default function Energy() {
  return (
    <div className="min-h-screen bg-[#111316] text-white pb-24">

      <header className="fixed top-0 w-full px-6 h-16 flex items-center bg-[#111316]">
        <h1 className="text-[#b0c6ff] font-bold text-sm uppercase">Energy</h1>
      </header>

      <main className="pt-24 px-6 space-y-6">

        <h2 className="text-2xl font-bold">Energy Usage</h2>

        <div className="bg-[#1e2023] p-6 rounded-xl">

          <p className="text-gray-400 mb-2">Weekly Consumption</p>
          <h3 className="text-3xl text-green-400 font-bold mb-4">
            142 kWh
          </h3>

          <div className="flex items-end gap-2 h-40">
            {[60, 45, 85, 30, 70, 55, 40].map((h, i) => (
              <div
                key={i}
                className="bg-green-400 w-full rounded"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

        </div>

      </main>

      <nav className="fixed bottom-0 w-full flex justify-around py-4 bg-[#111316]">
        <Link href="/">Home</Link>
        <Link href="/devices">Devices</Link>
        <Link href="/security">Security</Link>
        <Link href="/energy" className="text-green-400">Energy</Link>
      </nav>

    </div>
  );
}