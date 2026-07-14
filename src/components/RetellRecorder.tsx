"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, RotateCcw, Clock, History, Play, Loader2 } from "lucide-react";
import { saveRetell as saveRetellApi, loadRetells } from "@/lib/storage";

interface RetellEntry {
  id: string;
  transcript: string;
  episode: string;
  date: string;
  audioPath?: string;
}

export default function RetellRecorder() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [episode, setEpisode] = useState("");
  const [history, setHistory] = useState<RetellEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioMimeRef = useRef("");
  const isRecordingRef = useRef(false);
  const mediaRecorderReadyRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    loadRetells().then((records) => setHistory(records as RetellEntry[]));
  }, []);

  const saveHistory = async (entry: RetellEntry) => {
    await saveRetellApi({
      date: new Date().toISOString().split("T")[0],
      transcript: entry.transcript,
      episode: entry.episode,
      audioPath: entry.audioPath,
    });
    const records = await loadRetells();
    setHistory(records as RetellEntry[]);
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

  // Upload audio blob, returns the URL path
  const uploadAudioBlob = async (blob: Blob): Promise<string | null> => {
    setAudioUploading(true);
    try {
      const base64 = await blobToBase64(blob);
      const mime = blob.type || "audio/mp4";
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64, mime }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.path;
    } catch {
      return null;
    } finally {
      setAudioUploading(false);
    }
  };

  const startMediaRecorder = useCallback(async () => {
    const promise = (async () => {
      if (typeof MediaRecorder === "undefined") return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
        const mime = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "";
        audioMimeRef.current = mime;

        const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        // Start — collect data every second AND on stop
        recorder.start(1000);
        // Only set ref AFTER start() succeeds
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn("MediaRecorder unavailable, text-only mode:", e);
      }
    })();
    mediaRecorderReadyRef.current = promise;
    await promise;
  }, []);

  const startRecording = useCallback(async () => {
    setAudioUploading(false);

    isRecordingRef.current = true;

    // Start audio capture (best effort)
    startMediaRecorder();

    // Start speech recognition
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const isHttp = location.protocol !== "https:" && location.hostname !== "localhost";
      if (isHttp) {
        alert("语音识别需要 HTTPS 加密连接才能使用。请配置 SSL 证书后通过 https:// 访问，或在 localhost 本地测试。");
      } else {
        alert("当前浏览器不支持语音识别，请使用 Chrome 或 Safari 浏览器。");
      }
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

    recognition.onerror = () => {
      // Don't setIsRecording(false) — let onend handle restart logic
    };

    recognition.onend = () => {
      // If recording should continue, restart speech recognition
      if (isRecordingRef.current) {
        try { recognition.start(); } catch { /* permanent failure — ignore */ }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [startMediaRecorder]);

  const stopRecording = useCallback(async () => {
    isRecordingRef.current = false;

    // Stop speech recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    // Wait for MediaRecorder to finish setup (e.g. getUserMedia may be pending)
    await Promise.race([
      mediaRecorderReadyRef.current,
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]);

    // Stop media recorder and collect audio
    let audioBlob: Blob | null = null;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      const stopPromise = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });
      recorder.stop();
      await stopPromise;
      audioBlob = new Blob(audioChunksRef.current, { type: audioMimeRef.current || "audio/mp4" });
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Upload audio
    let savedAudioPath: string | null = null;
    if (audioBlob && audioBlob.size > 1000) {
      savedAudioPath = await uploadAudioBlob(audioBlob);
    }

    // Auto-save with transcript + audio — always save if there's audio or text
    const finalText = transcript + (interimText ? " " + interimText : "");
    if (finalText.trim() || savedAudioPath) {
      const entry: RetellEntry = {
        id: Date.now().toString(),
        transcript: finalText.trim() || "(语音未识别到文字，可播放音频收听)",
        episode: episode || `第 ${history.length + 1} 次`,
        date: new Date().toLocaleString("zh-CN"),
      };
      if (savedAudioPath) entry.audioPath = savedAudioPath;

      console.log("[RetellRecorder] savedAudioPath:", savedAudioPath, "entry.audioPath:", entry.audioPath);

      // Insert into local history right away so "听录音" appears instantly
      setHistory((prev) => [entry as RetellEntry, ...prev]);

      // Sync to server in the background (ignore errors — file is already saved)
      saveHistory(entry).catch(() => {});
    }
  }, [transcript, interimText, episode, history.length]);

  const cleanup = useCallback(() => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleStart = () => {
    cleanup();
    setTimeLeft(30);
    setTranscript("");
    setInterimText("");
    setIsRunning(true);
    startRecording();
  };

  const handleReset = () => {
    cleanup();
    setTimeLeft(30);
    setTranscript("");
    setInterimText("");
  };

  const playAudio = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {});
  };

  const timerPct = timeLeft / 30;
  const isHttp = typeof window !== "undefined" && location.protocol !== "https:" && location.hostname !== "localhost";

  return (
    <div className="flex flex-col gap-3">
      {/* HTTP warning banner */}
      {isHttp && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚠️ 当前页面通过 HTTP 访问，录音功能需要 HTTPS 加密连接。请配置 SSL 证书后通过 https:// 访问。
          </p>
        </div>
      )}

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

        {audioUploading && (
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            音频上传中...
          </div>
        )}
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
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
                      <span>{entry.episode}</span>
                      <span>·</span>
                      <span>{entry.date}</span>
                      {entry.audioPath && (
                        <>
                          <span className="text-gray-300">·</span>
                          <button
                            onClick={() => playAudio(entry.audioPath!)}
                            className="flex items-center gap-1 text-pet-teal-dark font-bold hover:underline"
                          >
                            <Play className="w-3 h-3 fill-pet-teal-dark" />
                            听录音
                          </button>
                        </>
                      )}
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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
