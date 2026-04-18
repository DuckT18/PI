"use client";

import Link from "next/link";

export default function Security() {
  return (
    <div className="min-h-screen bg-[#111316] text-white pb-24">

      <header className="fixed top-0 w-full px-6 h-16 flex items-center bg-[#111316]">
        <h1 className="text-[#b0c6ff] font-bold text-sm uppercase">Security</h1>
      </header>

      <main className="pt-24 px-6 space-y-6">

        <div className="bg-[#1e2023] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">System Status</h2>
          <p className="text-green-400">All systems active</p>
        </div>

        <div className="space-y-4">

          <div className="bg-[#1e2023] p-4 rounded-xl">
            <p className="font-bold">Front Door</p>
            <p className="text-gray-400">Locked</p>
          </div>

          <div className="bg-[#1e2023] p-4 rounded-xl">
            <p className="font-bold">Cameras</p>
            <p className="text-gray-400">Monitoring</p>
          </div>

        </div>

      </main>

      <nav className="fixed bottom-0 w-full flex justify-around py-4 bg-[#111316]">
        <Link href="/">Home</Link>
        <Link href="/devices">Devices</Link>
        <Link href="/security" className="text-green-400">Security</Link>
        <Link href="/energy">Energy</Link>
      </nav>

    </div>
  );
}