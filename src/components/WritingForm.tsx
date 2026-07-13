"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { saveWritingRecord } from "@/lib/storage";

interface Feedback {
  rating: string;
  comments: string[];
  suggestions: string[];
  encouragement: string;
}

export default function WritingForm() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulated AI feedback — in production, call an API
  const generateFeedback = (input: string): Feedback => {
    const wordCount = input.split(/\s+/).filter(Boolean).length;
    const hasComplexWords = /(because|although|however|therefore|interesting|beautiful|important|adventure|wonderful|delicious)/i.test(input);
    const hasBasicErrors = /(i think|he go|she don't|peoples|gooder)/i.test(input);

    return {
      rating: wordCount > 80 && hasComplexWords ? "🌟 B1 很棒！" : "📝 A2 加油！",
      comments: [
        ...(hasBasicErrors ? ["⚠️ 注意时态和主谓一致哦！"] : []),
        ...(wordCount < 60 ? ["💡 尝试写得更详细一些，加一些描述和原因"] : []),
        ...(!hasComplexWords ? ["💡 可以试试用更高级的词汇哦！"] : []),
      ],
      suggestions: [
        ...(input.includes("happy") ? ['把 "happy" 换成 "delighted" 或 "thrilled"'] : []),
        ...(input.includes("big") ? ['把 "big" 换成 "enormous" 或 "massive"'] : []),
        ...(input.includes("good") ? ['把 "good" 换成 "wonderful" 或 "fantastic"'] : []),
        ...(input.includes("bad") ? ['把 "bad" 换成 "terrible" 或 "awful"'] : []),
        ...(input.includes("like") ? ['把 "like" 换成 "enjoy" 或 "adore"'] : []),
      ],
      encouragement:
        wordCount > 80
          ? "太棒了！你已经达到了 B1 水平！继续努力！🎉"
          : "写得不错！每天进步一点点，PET 考试没问题！💪",
    };
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const fb = generateFeedback(text);
      setFeedback(fb);
      setLoading(false);
      saveWritingRecord({
        date: new Date().toISOString().split("T")[0],
        text,
        feedback: fb.rating + " | " + fb.encouragement,
        wordCount: text.split(/\s+/).filter(Boolean).length,
      }).catch(() => {});
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
        <label className="block text-sm font-bold text-gray-600 mb-2">
          ✏️ 写下你的作文
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例如：My Best Friend... (至少 50 词喔～)"
          className="w-full h-40 p-4 rounded-xl border-2 border-gray-100 focus:border-pet-teal focus:outline-none resize-none text-base leading-relaxed"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {text.split(/\s+/).filter(Boolean).length} 词
          </span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 bg-pet-teal text-white px-6 py-2.5 rounded-full font-bold hover:bg-pet-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "批改中..." : "提交批改"}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-pet-light">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-gray-800">AI 评语</h3>
          </div>

          {/* Rating */}
          <div className="inline-block bg-pet-light rounded-full px-4 py-1.5 text-sm font-bold text-pet-purple mb-4">
            {feedback.rating}
          </div>

          {/* Comments */}
          {feedback.comments.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">建议</p>
              {feedback.comments.map((c, i) => (
                <p key={i} className="text-sm text-gray-600 mb-1">{c}</p>
              ))}
            </div>
          )}

          {/* Vocab suggestions */}
          {feedback.suggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">词汇升级</p>
              {feedback.suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                  <span className="text-blue-300">✦</span>
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-pet-light to-pet-pink rounded-xl p-4 mt-3">
            <p className="text-sm font-bold text-gray-700">{feedback.encouragement}</p>
          </div>
        </div>
      )}
    </div>
  );
}
