import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "PET Master Journey",
  description: "PET 备考打卡应用 — 每天进步一点点！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-pet-light/80 via-white to-pet-pink/30">
        <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 pb-24">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
