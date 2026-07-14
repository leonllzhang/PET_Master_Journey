"use client";

import { useState, useEffect } from "react";
import { History } from "lucide-react";
import SynonymGame from "@/components/SynonymGame";
import { loadSynonymHistory } from "@/lib/storage";

interface HistoryEntry {
  id: string;
  date: string;
  score: number;
  total: number;
  wrongWords: { word: string; correct: string }[];
}

export default function SynonymPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadSynonymHistory().then((records) => setHistory(records as HistoryEntry[]));
  }, []);

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

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600"
          >
            <History className="w-4 h-4" />
            历史记录 ({history.length})
            <span className={`ml-auto transition-transform ${showHistory ? "rotate-180" : ""}`}>▼</span>
          </button>

          {showHistory && (
            <div className="mt-3 flex flex-col gap-2">
              {history.map((entry) => {
                const pct = Math.round((entry.score / entry.total) * 100);
                return (
                  <div key={entry.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{entry.date}</span>
                      <span className={`text-xs font-bold ${pct >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                        {entry.score}/{entry.total} ({pct}%)
                      </span>
                    </div>
                    {entry.wrongWords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.wrongWords.map((w, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                            {w.word} → {w.correct}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
