"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111316] text-white pb-24">

      {/* HEADER */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 h-16 bg-[#111316] z-50">
        <h1 className="text-[#b0c6ff] font-bold tracking-wider uppercase text-sm">
          Automate
        </h1>

        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
      </header>

      {/* CONTEÚDO */}
      <main className="pt-24 px-6 space-y-6">

        {/* SAUDAÇÃO */}
        <div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-gray-400">All systems secure</p>
        </div>

        {/* CARD ENERGIA */}
        <div className="bg-[#1e2023] p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Energy</p>
              <h3 className="text-3xl font-bold text-green-400">4.2 kWh</h3>
            </div>
            <span>⚡</span>
          </div>

          <div className="flex items-end gap-2 h-32">
            {[40, 60, 55, 85, 100, 45, 30].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded ${
                  h === 100 ? "bg-green-400" : "bg-gray-700"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* CARD SEGURANÇA */}
        <div className="bg-[#1e2023] p-6 rounded-2xl">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Security</h3>
            <span className="text-green-400 text-sm">Active</span>
          </div>

          <div className="space-y-2 text-gray-400 text-sm">
            <p>Front door: Locked</p>
            <p>Cameras: Monitoring</p>
          </div>
        </div>

        {/* DISPOSITIVOS */}
        <div className="grid grid-cols-2 gap-4">
          {[
            "Air Conditioner",
            "Kitchen Lights",
            "Bedroom Lights",
            "Smart TV",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#1e2023] p-4 rounded-xl"
            >
              <p className="font-bold">{item}</p>
              <p className="text-xs text-gray-400">
                Status ativo
              </p>
            </div>
          ))}
        </div>

      </main>

      {/* NAVBAR */}
      <nav className="fixed bottom-0 w-full flex justify-around py-4 bg-[#111316] border-t border-gray-800">
        <Link href="/" className="text-green-400">Home</Link>
        <Link href="/devices">Devices</Link>
        <Link href="/security">Security</Link>
        <Link href="/energy">Energy</Link>
      </nav>

    </div>
  );
}