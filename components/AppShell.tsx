"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { api, getToken, setToken, type UserProfile } from "@/lib/api";

interface AuthValue {
  user: UserProfile | null;
  logout: () => void;
}

const AuthContext = createContext<AuthValue>({ user: null, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api<UserProfile>("/auth/me").then(setUser).catch(() => {});
  }, [isLogin, router]);

  const logout = () => {
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  if (isLogin) return <>{children}</>;

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <Sidebar />
      <BottomNav />
      <div className="main-content flex-1 min-h-screen">{children}</div>
    </AuthContext.Provider>
  );
}
