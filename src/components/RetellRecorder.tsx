"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, RotateCcw, Clock, History } from "lucide-react";

interface RetellEntry {
  id: string;
  transcript: string;
  episode: string;
  date: string;
}

const STORAGE_KEY = "hilda-retells";

export default function RetellRecorder() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [episode, setEpisode] = useState("");
  const [history, setHistory] = useState<RetellEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveHistory = (entry: RetellEntry) => {
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopRecording();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("语音识别需要 Chrome 浏览器");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (finalText) setTranscript((prev) => prev + finalText);
      setInterimText(interim);
    };

    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Auto-save
    const finalText = transcript + (interimText ? " " + interimText : "");
    if (finalText.trim()) {
      saveHistory({
        id: Date.now().toString(),
        transcript: finalText.trim(),
        episode: episode || `第 ${history.length + 1} 次`,
        date: new Date().toLocaleString("zh-CN"),
      });
    }
  }, [transcript, interimText, episode, history.length]);

  const handleStart = () => {
    setTimeLeft(30);
    setTranscript("");
    setInterimText("");
    setIsRunning(true);
    startRecording();
  };

  const handleReset = () => {
    if (isRunning || isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    setTimeLeft(30);
    setTranscript("");
    setInterimText("");
  };

  const timerPct = timeLeft / 30;

  return (
    <div className="flex flex-col gap-3">
      {/* Header hint */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-3 border border-teal-200">
        <p className="text-xs text-teal-700 leading-relaxed">
          🎯 看完一集，用英语说 3 句话总结剧情。直接训练口语描述能力！
        </p>
      </div>

      {/* Episode input */}
      {!isRecording && (
        <input
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          placeholder="这集叫什么？(可选)"
          className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-pet-teal focus:outline-none text-sm bg-white"
        />
      )}

      {/* Timer + Recorder */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pet-light text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f3e8ff" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPct)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-extrabold ${timeLeft <= 5 ? "text-red-400" : "text-gray-800"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-gray-700">30秒英语复述</p>
            <p className="text-xs text-gray-400">说出 3 句话概括这一集</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-pet-teal text-white px-6 py-2.5 rounded-full font-bold hover:bg-pet-teal-dark transition-colors"
            >
              <Mic className="w-4 h-4" />
              开始录音
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-400 text-white px-6 py-2.5 rounded-full font-bold hover:bg-red-500 transition-colors"
            >
              <Square className="w-4 h-4 fill-white" />
              停止
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 text-sm text-red-400 font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          录音中 · 说大声一点喔！
          {interimText && <span className="text-gray-400 font-normal text-xs">({interimText})</span>}
        </motion.div>
      )}

      {/* Transcript result */}
      <AnimatePresence>
        {transcript && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-teal-100"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-gray-500">你的复述</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {transcript}
              {interimText ? " " + interimText : ""}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {transcript.split(/\s+/).filter(Boolean).length} 词
              {episode && ` · ${episode}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History toggle */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 text-sm text-gray-500 font-bold"
          >
            <History className="w-4 h-4" />
            练习记录 ({history.length})
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex flex-col gap-2 overflow-hidden"
              >
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {entry.transcript}
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-400">
                      <span>{entry.episode}</span>
                      <span>·</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
