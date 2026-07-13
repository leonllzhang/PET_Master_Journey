"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  total: number;
}

export default function ProgressBar({ value, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-pet-purple">
          🌟 今日进度
        </span>
        <span className="text-sm font-bold text-pet-teal-dark">
          {value}/{total} · {pct}%
        </span>
      </div>
      <div className="h-4 bg-white/60 rounded-full overflow-hidden shadow-inner border border-pet-light">
        <motion.div
          className="h-full progress-gradient rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
