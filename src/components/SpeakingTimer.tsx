"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, RotateCcw, Image } from "lucide-react";

interface PetPicture {
  id: string;
  /** 本地图片路径（放入 public/images/speaking/ 目录）— 设为空字符串则用 emoji 占位 */
  imageFile: string;
  /** emoji 占位（当 imageFile 为空或图片加载失败时显示） */
  emoji: string;
  scene: string;
  details: string[];
  gradient: string;
}

const petPictures: PetPicture[] = [
  {
    id: "park",
    imageFile: "",
    gradient: "from-emerald-200 to-cyan-200",
    emoji: "🌳",
    scene: "公园里的家庭",
    details: ["a sunny day", "a family having a picnic", "children playing"],
  },
  {
    id: "beach",
    imageFile: "",
    gradient: "from-sky-200 to-blue-200",
    emoji: "🏖️",
    scene: "海滩假日",
    details: ["people on the beach", "the sea and waves", "building sandcastles"],
  },
  {
    id: "birthday",
    imageFile: "",
    gradient: "from-orange-200 to-rose-200",
    emoji: "🎂",
    scene: "生日派对",
    details: ["a birthday cake", "friends and family", "balloons and presents"],
  },
  {
    id: "school",
    imageFile: "",
    gradient: "from-purple-200 to-pink-200",
    emoji: "🏫",
    scene: "学校生活",
    details: ["a classroom", "students studying", "a teacher helping"],
  },
  {
    id: "shopping",
    imageFile: "",
    gradient: "from-yellow-200 to-amber-200",
    emoji: "🛍️",
    scene: "购物中心",
    details: ["people shopping", "a clothes store", "friends choosing"],
  },
  {
    id: "sports",
    imageFile: "",
    gradient: "from-red-200 to-rose-200",
    emoji: "⚽",
    scene: "运动场上",
    details: ["children playing football", "a coach", "a sports field"],
  },
];

export default function SpeakingTimer() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [pictureIndex, setPictureIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imgError, setImgError] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      stopRecording();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Web Speech API recognition
  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("当前浏览器不支持语音识别，请使用 Chrome");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      setTranscript(finalText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

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
  }, []);

  const handleStart = () => {
    setTimeLeft(60);
    setTranscript("");
    setIsRunning(true);
    startRecording();
  };

  const handleStop = () => {
    setIsRunning(false);
    stopRecording();
  };

  const handleReset = () => {
    handleStop();
    setTimeLeft(60);
    setTranscript("");
  };

  const currentPic = petPictures[pictureIndex];
  const showLocalImage = currentPic.imageFile && !imgError.has(currentPic.id);

  const handleImgError = (id: string) => {
    setImgError((prev) => new Set(prev).add(id));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPct = timeLeft / 60;

  return (
    <div className="flex flex-col gap-5">
      {/* Picture display */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-pet-purple" />
            <span className="text-sm font-bold text-gray-600">Part 2: 图片描述</span>
          </div>
          <button
            onClick={() => !isRunning && setPictureIndex((i) => (i + 1) % petPictures.length)}
            className="text-xs text-pet-teal-dark font-bold hover:underline"
            disabled={isRunning}
          >
            换一张 →
          </button>
        </div>
        <div className={`relative rounded-xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br ${currentPic.gradient}`}>
          {showLocalImage ? (
            <img
              src={currentPic.imageFile}
              alt={currentPic.scene}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => handleImgError(currentPic.id)}
            />
          ) : (
            <>
              <span className="text-6xl mb-2">{currentPic.emoji}</span>
              <div className="flex gap-2 mt-2 flex-wrap justify-center px-2">
                {currentPic.details.map((d, i) => (
                  <span key={i} className="text-[10px] bg-white/40 text-white px-2 py-0.5 rounded-full font-bold">
                    {d}
                  </span>
                ))}
              </div>
            </>
          )}
          <span className={`absolute bottom-2 left-2 font-extrabold drop-shadow-md ${showLocalImage ? "bg-black/50 text-white" : "text-white"} text-sm px-3 py-1 rounded-full`}>
            {currentPic.scene}
          </span>
          <span className="absolute top-2 right-2 bg-white/60 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
            PET Speaking Part 2
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pet-light text-center">
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#f3e8ff" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - timerPct)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-gray-800"}`}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-pet-teal text-white px-6 py-3 rounded-full font-bold hover:bg-pet-teal-dark transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              开始
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-400 text-white px-6 py-3 rounded-full font-bold hover:bg-red-500 transition-colors"
            >
              <Square className="w-4 h-4 fill-white" />
              停止
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-400 font-bold animate-pulse">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          录音中...
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">转写文字</p>
          <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}
