"use client";

import Link from "next/link";

export default function Devices() {
  return (
    <div className="min-h-screen bg-[#111316] text-white pb-24">

      <header className="fixed top-0 w-full flex justify-between items-center px-6 h-16 bg-[#111316]">
        <h1 className="text-[#b0c6ff] font-bold text-sm uppercase">Devices</h1>
      </header>

      <main className="pt-24 px-6 space-y-6">

        <h2 className="text-2xl font-bold">Connected Devices</h2>

        <div className="grid grid-cols-2 gap-4">

          {[
            { name: "Air Conditioner", status: "22°C" },
            { name: "Kitchen Lights", status: "On" },
            { name: "Bedroom Lights", status: "Off" },
            { name: "Smart TV", status: "Standby" },
          ].map((device, i) => (
            <div key={i} className="bg-[#1e2023] p-4 rounded-xl">
              <p className="font-bold">{device.name}</p>
              <p className="text-gray-400 text-sm">{device.status}</p>

              <button className="mt-3 w-full bg-green-400 text-black py-1 rounded">
                Toggle
              </button>
            </div>
          ))}

        </div>

      </main>

      <nav className="fixed bottom-0 w-full flex justify-around py-4 bg-[#111316]">
        <Link href="/">Home</Link>
        <Link href="/devices" className="text-green-400">Devices</Link>
        <Link href="/security">Security</Link>
        <Link href="/energy">Energy</Link>
      </nav>

    </div>
  );
}