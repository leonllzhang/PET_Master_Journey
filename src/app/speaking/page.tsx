"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import SpeakingTimer from "@/components/SpeakingTimer";

export default function SpeakingPage() {
  const [showGuide, setShowGuide] = useState(false);

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

      {/* Image guide toggle */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ImagePlus className="w-3.5 h-3.5" />
        {showGuide ? "收起图片使用说明" : "如何添加自己的口语图片？"}
      </button>

      {showGuide && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light text-xs text-gray-500 leading-relaxed">
          <p className="font-bold text-gray-700 mb-1">📁 添加图片到口语模块：</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>将图片放入 <code className="bg-gray-100 px-1 rounded">public/images/speaking/</code> 目录</li>
            <li>在 <code className="bg-gray-100 px-1 rounded">SpeakingTimer.tsx</code> 的 <code className="bg-gray-100 px-1 rounded">petPictures</code> 数组中，给对应条目的 <code className="bg-gray-100 px-1 rounded">imageFile</code> 填上路径，例如：</li>
          </ol>
          <pre className="bg-gray-50 rounded-lg p-2 mt-1 text-[10px] text-gray-400 overflow-x-auto">
{`{
  id: "park",
  imageFile: "/images/speaking/park.jpg",
  scene: "公园里的家庭",
  emoji: "🌳",   // 图片加载失败时的后备
  details: ["a sunny day", "picnic"],
  gradient: "from-emerald-200 to-cyan-200",
}`}
          </pre>
          <p className="mt-1">设置 <code className="bg-gray-100 px-1 rounded">imageFile</code> 后，会自动加载本地图片；加载失败则显示 emoji 占位。</p>
        </div>
      )}

      <SpeakingTimer />
    </div>
  );
}
