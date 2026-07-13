"use client";

import { useState, useEffect } from "react";
import { BookmarkPlus, Bookmark, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Phrase {
  id: string;
  text: string;
  speaker: string;
  episode: string;
  createdAt: string;
}

const STORAGE_KEY = "hilda-golden-phrases";

export default function GoldenPhrasePicker() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [text, setText] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [episode, setEpisode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPhrases(JSON.parse(stored));
  }, []);

  const saveToStorage = (updated: Phrase[]) => {
    setPhrases(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!text.trim()) return;
    const newPhrase: Phrase = {
      id: Date.now().toString(),
      text: text.trim(),
      speaker: speaker.trim() || "Hilda",
      episode: episode.trim() || `第 ${phrases.length + 1} 集`,
      createdAt: new Date().toLocaleString("zh-CN"),
    };
    saveToStorage([newPhrase, ...phrases]);
    setText("");
    setSpeaker("");
    setEpisode("");
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    saveToStorage(phrases.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header hint */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-50 rounded-xl p-3 border border-amber-200">
        <p className="text-xs text-amber-700 leading-relaxed">
          💡 看完一集《Hilda》，记下 3 个你觉得很酷的表达！以后写作文就能用上啦～
        </p>
      </div>

      {/* Quick add button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-pet-lavender rounded-2xl p-4 text-pet-purple font-bold hover:bg-pet-light transition-colors"
        >
          <BookmarkPlus className="w-5 h-5" />
          添加新金句
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border-2 border-pet-lavender"
        >
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                🗣️ 金句 *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"例如: \"I'm not just going to sit here and do nothing!\""}
                className="w-full h-20 p-3 rounded-xl border-2 border-gray-100 focus:border-pet-teal focus:outline-none resize-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  🎭 谁说的
                </label>
                <input
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="Hilda"
                  className="w-full p-2.5 rounded-xl border-2 border-gray-100 focus:border-pet-teal focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  📺 哪一集
                </label>
                <input
                  value={episode}
                  onChange={(e) => setEpisode(e.target.value)}
                  placeholder="S1E1"
                  className="w-full p-2.5 rounded-xl border-2 border-gray-100 focus:border-pet-teal focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="flex-1 bg-pet-teal text-white py-2.5 rounded-xl font-bold hover:bg-pet-teal-dark transition-colors disabled:opacity-50"
              >
                💾 保存
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full self-center"
          >
            ✨ 金句已收录！
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phrase list */}
      {phrases.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-bold">
            <Bookmark className="w-4 h-4 text-amber-400" />
            已收集 {phrases.length} 条金句
          </div>
          <AnimatePresence>
            {phrases.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl p-3 border border-amber-100 group"
              >
                <div className="flex gap-2">
                  <span className="text-amber-400 text-lg leading-none">💬</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 italic">
                      &ldquo;{p.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>— {p.speaker}</span>
                      <span>·</span>
                      <span>{p.episode}</span>
                      <span className="text-gray-300">· {p.createdAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {phrases.length === 0 && !showForm && (
        <div className="text-center py-6 text-gray-400">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">还没收集金句～看完一集就来记录吧！</p>
        </div>
      )}
    </div>
  );
}
