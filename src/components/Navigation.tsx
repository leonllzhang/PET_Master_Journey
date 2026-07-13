"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Pen, Mic, Tv, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/", label: "任务", icon: Home },
  { href: "/synonym", label: "同义词", icon: BookOpen },
  { href: "/writing", label: "写作", icon: Pen },
  { href: "/speaking", label: "口语", icon: Mic },
  { href: "/hilda", label: "Hilda", icon: Tv },
  { href: "/dashboard", label: "统计", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pet-light"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all
                ${isActive ? "text-pet-teal-dark scale-110" : "text-gray-400 hover:text-gray-600"}`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-pet-teal/20" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
