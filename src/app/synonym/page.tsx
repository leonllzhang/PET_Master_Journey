"use client";

import SynonymGame from "@/components/SynonymGame";

export default function SynonymPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-extrabold text-gray-800">
          📖 同义词挑战
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          阅读提分关键！选出正确的同义词
        </p>
      </div>
      <SynonymGame />
    </div>
  );
}
