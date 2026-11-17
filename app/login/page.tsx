"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { EnergyIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  };

  const field = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="glass-card-static p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00e5a0, #00b4d8)" }}
          >
            <EnergyIcon size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Automate</span>
        </div>

        <h1 className="text-xl font-bold text-white mb-1">Entrar</h1>
        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
          Acesse sua casa inteligente
        </p>

        <label className="block text-xs mb-1" style={{ color: "#94a3b8" }}>
          E-mail
        </label>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm text-white mb-4 outline-none"
          style={field}
        />

        <label className="block text-xs mb-1" style={{ color: "#94a3b8" }}>
          Senha
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm text-white mb-4 outline-none"
          style={field}
        />

        {error && (
          <p className="text-sm mb-4" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #00e5a0, #00b4d8)",
            color: "#0a0e1a",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
