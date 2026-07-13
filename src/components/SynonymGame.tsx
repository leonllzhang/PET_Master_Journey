"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Trophy } from "lucide-react";
import { synonymBank, shuffleArray, SynonymPair } from "@/data/synonyms";

export default function SynonymGame() {
  const [pairs, setPairs] = useState<SynonymPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wrongWords, setWrongWords] = useState<SynonymPair[]>([]);
  const [finished, setFinished] = useState(false);

  const initGame = useCallback(() => {
    const shuffled = shuffleArray(synonymBank).slice(0, 10);
    setPairs(shuffled.map((p) => ({ ...p, options: shuffleArray(p.options) })));
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    setSelected(null);
    setIsCorrect(null);
    setShowResult(false);
    setWrongWords([]);
    setFinished(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === pairs[currentIndex].correct;
    setIsCorrect(correct);
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);
    else setWrongWords((w) => [...w, pairs[currentIndex]]);
    setShowResult(true);
  };

  const nextWord = () => {
    if (currentIndex + 1 >= pairs.length) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setIsCorrect(null);
    setShowResult(false);
  };

  if (pairs.length === 0) return null;

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Trophy className="w-16 h-16 text-amber-400" />
        <h2 className="text-2xl font-bold text-gray-800">挑战完成! 🎉</h2>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pet-light text-center w-full">
          <p className="text-5xl font-bold text-pet-teal-dark mb-2">{pct}%</p>
          <p className="text-gray-600">
            正确 {score} / 总 {total}
          </p>
        </div>
        {wrongWords.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 w-full">
            <h3 className="font-bold text-red-500 mb-2">📝 需要复习的词</h3>
            {wrongWords.map((w, i) => (
              <div key={i} className="flex justify-between py-1 text-sm border-b border-gray-50 last:border-0">
                <span className="font-medium">{w.word}</span>
                <span className="text-emerald-600">→ {w.correct}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={initGame}
          className="flex items-center gap-2 bg-pet-teal text-white px-6 py-3 rounded-full font-bold hover:bg-pet-teal-dark transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          再来一轮
        </button>
      </div>
    );
  }

  const current = pairs[currentIndex];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4 text-pet-purple" />
        <span>找出同义词 · 第 {currentIndex + 1}/{pairs.length} 题</span>
      </div>

      {/* Score */}
      <div className="text-sm text-gray-500">
        得分: <span className="font-bold text-pet-teal-dark">{score}</span>/{total}
      </div>

      {/* Word display */}
      <motion.div
        key={current.word}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-md border-2 border-pet-light text-center w-full"
      >
        <p className="text-xs text-gray-400 mb-2">请选出以下单词的同义词</p>
        <p className="text-3xl font-bold text-gray-800 mb-1">{current.word}</p>
      </motion.div>

      {/* Options */}
      <div className="w-full grid grid-cols-1 gap-3">
        {current.options.map((option, i) => {
          let btnClass =
            "bg-white border-2 border-gray-100 text-gray-700 hover:border-pet-lavender hover:bg-pet-light";
          if (showResult && option === current.correct) {
            btnClass = "bg-emerald-50 border-emerald-400 text-emerald-700";
          } else if (selected === option && !isCorrect) {
            btnClass = "bg-red-50 border-red-300 text-red-600";
          } else if (selected === option) {
            btnClass = "bg-emerald-50 border-emerald-400 text-emerald-700";
          }

          return (
            <motion.button
              key={option}
              whileTap={!selected ? { scale: 0.97 } : undefined}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl py-4 px-6 font-bold text-lg transition-all ${btnClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className={`text-lg font-bold ${isCorrect ? "text-emerald-500" : "text-red-400"}`}>
            {isCorrect ? "✅ 太棒了！完全正确！" : `❌ 正确答案是：${current.correct}`}
          </p>
          <button
            onClick={nextWord}
            className="mt-4 bg-pet-teal text-white px-8 py-3 rounded-full font-bold hover:bg-pet-teal-dark transition-colors"
          >
            {currentIndex + 1 >= pairs.length ? "查看结果" : "下一题 →"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
