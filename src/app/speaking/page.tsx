"use client";

import SpeakingTimer from "@/components/SpeakingTimer";

export default function SpeakingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-extrabold text-gray-800">
          🎤 口语模拟器
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          描述图片 · 1分钟计时 · 语音转文字
        </p>
      </div>
      <SpeakingTimer />
    </div>
  );
}
