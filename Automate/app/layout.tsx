import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Automate — Smart Home",
  description:
    "Monitore e controle os dispositivos da sua casa de forma remota e inteligente. Dashboard de automação residencial.",
  keywords: "automação, casa inteligente, smart home, IoT, dispositivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-inter, var(--font-sans))" }}>
        <Sidebar />
        <BottomNav />
        <div className="main-content flex-1 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
