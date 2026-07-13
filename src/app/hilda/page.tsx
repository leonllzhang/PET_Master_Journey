"use client";

import { useState } from "react";
import GoldenPhrasePicker from "@/components/GoldenPhrasePicker";
import RetellRecorder from "@/components/RetellRecorder";

export default function HildaPage() {
  const [tab, setTab] = useState<"phrases" | "retell">("phrases");

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center py-2">
        <div className="text-4xl mb-1">🦊</div>
        <h1 className="text-xl font-extrabold text-gray-800">Hilda 英语时间</h1>
        <p className="text-sm text-gray-500 mt-1">
          看完一集，收集金句 + 复述剧情
        </p>
      </div>

      {/* Tab switch */}
      <div className="bg-white/60 rounded-2xl p-1 border border-pet-light flex">
        <button
          onClick={() => setTab("phrases")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === "phrases"
              ? "bg-white text-pet-purple shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          💎 金句收集
        </button>
        <button
          onClick={() => setTab("retell")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === "retell"
              ? "bg-white text-pet-teal-dark shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          🎙️ 复述练习
        </button>
      </div>

      {/* Content */}
      {tab === "phrases" ? <GoldenPhrasePicker /> : <RetellRecorder />}
    </div>
  );
}
