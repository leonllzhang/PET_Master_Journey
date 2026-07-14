"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Square, RotateCcw, Image, Headphones } from "lucide-react";
import { saveSpeakingRecord, loadSpeakingHistory } from "@/lib/storage";

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
    id: "family",
    imageFile: "/images/speaking/family.jpg",
    gradient: "from-emerald-200 to-teal-200",
    emoji: "👨‍👩‍👧‍👦",
    scene: "家庭相聚",
    details: ["a family at home", "parents and children", "spending time together"],
  },
  {
    id: "family-2",
    imageFile: "/images/speaking/family-2.jpg",
    gradient: "from-green-200 to-emerald-200",
    emoji: "☀️",
    scene: "家庭户外",
    details: ["a family outdoors", "playing together", "having fun"],
  },
  {
    id: "friends",
    imageFile: "/images/speaking/friends.jpg",
    gradient: "from-sky-200 to-blue-200",
    emoji: "👫",
    scene: "朋友聚会",
    details: ["friends meeting up", "talking together", "enjoying free time"],
  },
  {
    id: "board-game",
    imageFile: "/images/speaking/board-game.jpg",
    gradient: "from-purple-200 to-pink-200",
    emoji: "🎲",
    scene: "玩桌游",
    details: ["playing a board game", "sitting at a table", "family competition"],
  },
  {
    id: "cooking-family",
    imageFile: "/images/speaking/cooking-family.jpg",
    gradient: "from-orange-200 to-yellow-200",
    emoji: "🍳",
    scene: "一起做饭",
    details: ["a family cooking", "preparing food together", "in the kitchen"],
  },
  {
    id: "school-1",
    imageFile: "/images/speaking/school-1.jpg",
    gradient: "from-blue-200 to-indigo-200",
    emoji: "🏫",
    scene: "学校教室",
    details: ["a classroom", "students learning", "a teacher teaching"],
  },
  {
    id: "do-homework",
    imageFile: "/images/speaking/do_homework.jpg",
    gradient: "from-indigo-200 to-violet-200",
    emoji: "📝",
    scene: "做作业",
    details: ["a student studying", "doing homework", "focusing on work"],
  },
  {
    id: "chat",
    imageFile: "/images/speaking/chat.jpg",
    gradient: "from-rose-200 to-pink-200",
    emoji: "💬",
    scene: "朋友聊天",
    details: ["two people chatting", "having a conversation", "friends talking"],
  },
  {
    id: "shop-fruits",
    imageFile: "/images/speaking/shop_fruits.jpg",
    gradient: "from-green-200 to-lime-200",
    emoji: "🍎",
    scene: "买水果",
    details: ["buying fruit", "at a market stall", "choosing fresh food"],
  },
  {
    id: "shopping",
    imageFile: "/images/speaking/shopping.jpg",
    gradient: "from-yellow-200 to-amber-200",
    emoji: "🛍️",
    scene: "购物中心",
    details: ["people shopping", "a store", "choosing clothes"],
  },
  {
    id: "buy-shoes",
    imageFile: "/images/speaking/buy_shoes.jpg",
    gradient: "from-amber-200 to-orange-200",
    emoji: "👟",
    scene: "买鞋子",
    details: ["trying on shoes", "at a shoe shop", "customer and shop assistant"],
  },
  {
    id: "dinner-together",
    imageFile: "/images/speaking/dinner_together.jpeg",
    gradient: "from-red-200 to-rose-200",
    emoji: "🍽️",
    scene: "一起吃饭",
    details: ["people eating dinner", "a meal together", "family at the table"],
  },
  {
    id: "pizza",
    imageFile: "/images/speaking/pizza.jpeg",
    gradient: "from-orange-200 to-red-200",
    emoji: "🍕",
    scene: "吃披萨",
    details: ["eating pizza", "friends sharing food", "at a restaurant"],
  },
  {
    id: "watch-tv",
    imageFile: "/images/speaking/watch_tv.jpg",
    gradient: "from-gray-200 to-slate-200",
    emoji: "📺",
    scene: "看电视",
    details: ["watching TV", "sitting on a sofa", "family relaxing at home"],
  },
  {
    id: "reading-grass",
    imageFile: "/images/speaking/reading_on_grass.jpg",
    gradient: "from-lime-200 to-green-200",
    emoji: "📖",
    scene: "草地阅读",
    details: ["reading on the grass", "a sunny day in the park", "enjoying a book"],
  },
  {
    id: "football",
    imageFile: "/images/speaking/football.jpg",
    gradient: "from-emerald-200 to-green-200",
    emoji: "⚽",
    scene: "踢足球",
    details: ["playing football", "children on a field", "sports game"],
  },
  {
    id: "basketball",
    imageFile: "/images/speaking/play_basketball.jpg",
    gradient: "from-orange-200 to-amber-200",
    emoji: "🏀",
    scene: "打篮球",
    details: ["playing basketball", "on a court", "sports practice"],
  },
  {
    id: "music",
    imageFile: "/images/speaking/music.jpg",
    gradient: "from-violet-200 to-purple-200",
    emoji: "🎵",
    scene: "音乐时光",
    details: ["listening to music", "enjoying a song", "relaxing"],
  },
  {
    id: "play-guita",
    imageFile: "/images/speaking/play_guita.jpg",
    gradient: "from-pink-200 to-rose-200",
    emoji: "🎸",
    scene: "弹吉他",
    details: ["playing the guitar", "making music", "a musician practicing"],
  },
  {
    id: "take-photo",
    imageFile: "/images/speaking/take_photo.jpg",
    gradient: "from-cyan-200 to-sky-200",
    emoji: "📷",
    scene: "拍照",
    details: ["taking a photo", "using a camera", "capturing a memory"],
  },
  {
    id: "usephone",
    imageFile: "/images/speaking/usephone.jpg",
    gradient: "from-blue-200 to-indigo-200",
    emoji: "📱",
    scene: "用手机",
    details: ["using a smartphone", "checking messages", "modern technology"],
  },
  {
    id: "travel",
    imageFile: "/images/speaking/travel.jpg",
    gradient: "from-teal-200 to-cyan-200",
    emoji: "🧳",
    scene: "旅行",
    details: ["going on a trip", "visiting a new place", "exploring"],
  },
  {
    id: "travel-bus",
    imageFile: "/images/speaking/traveling-by-bus.jpg",
    gradient: "from-amber-200 to-yellow-200",
    emoji: "🚌",
    scene: "坐公交",
    details: ["on a bus", "public transport", "traveling together"],
  },
  {
    id: "birthday",
    imageFile: "/images/speaking/brithday.jpg",
    gradient: "from-pink-200 to-purple-200",
    emoji: "🎂",
    scene: "生日派对",
    details: ["a birthday party", "cake and presents", "celebrating with friends"],
  },
  {
    id: "party",
    imageFile: "/images/speaking/party.jpg",
    gradient: "from-red-200 to-pink-200",
    emoji: "🎉",
    scene: "派对",
    details: ["having a party", "people celebrating", "music and dancing"],
  },
  {
    id: "discussion",
    imageFile: "/images/speaking/discussion.jpg",
    gradient: "from-blue-200 to-indigo-200",
    emoji: "💡",
    scene: "小组讨论",
    details: ["a group discussion", "sharing ideas", "working on a project"],
  },
  {
    id: "pet-nurse",
    imageFile: "/images/speaking/pet_nurse.jpg",
    gradient: "from-emerald-200 to-teal-200",
    emoji: "🐾",
    scene: "宠物护士",
    details: ["taking care of a pet", "at the vet", "helping animals"],
  },
  {
    id: "police",
    imageFile: "/images/speaking/police.jpg",
    gradient: "from-blue-200 to-slate-200",
    emoji: "👮",
    scene: "警察",
    details: ["a police officer", "helping people", "community worker"],
  },
  {
    id: "plant",
    imageFile: "/images/speaking/plant.jpg",
    gradient: "from-green-200 to-emerald-200",
    emoji: "🌱",
    scene: "种植物",
    details: ["planting a tree", "gardening", "taking care of nature"],
  },
  {
    id: "pickup-rubbish",
    imageFile: "/images/speaking/pickup_rubbish.jpg",
    gradient: "from-lime-200 to-green-200",
    emoji: "♻️",
    scene: "捡垃圾志愿者",
    details: ["picking up rubbish", "volunteering", "helping the environment"],
  },
  {
    id: "class",
    imageFile: "/images/speaking/class.png",
    gradient: "from-indigo-200 to-blue-200",
    emoji: "👩‍🏫",
    scene: "上课",
    details: ["in a class", "students and teacher", "learning together"],
  },
  {
    id: "buy-dinner",
    imageFile: "/images/speaking/buy_dinner.jpg",
    gradient: "from-yellow-200 to-orange-200",
    emoji: "🥡",
    scene: "买晚餐",
    details: ["buying takeaway food", "ordering dinner", "choosing food"],
  },
];

export default function SpeakingTimer() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [pictureIndex, setPictureIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [imgError, setImgError] = useState<Set<string>>(new Set());
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioMimeRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef("");
  const isRecordingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderReadyRef = useRef<Promise<void>>(Promise.resolve());

  // Keep transcriptRef in sync
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  // Load last record on mount for persistent audio playback
  useEffect(() => {
    loadSpeakingHistory().then((records) => {
      if (records.length > 0 && (records[0] as any).audioPath) {
        setAudioUrl((records[0] as any).audioPath);
      }
    });
  }, []);

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

  // Web Speech API recognition + MediaRecorder audio capture
  const startRecording = useCallback(async () => {
    // --- MediaRecorder: capture actual audio for playback ---
    audioChunksRef.current = [];
    setAudioUrl(null);
    isRecordingRef.current = true;

    const mediaPromise = (async () => {
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

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      } catch {
        // text-only mode
      }
    })();
    mediaRecorderReadyRef.current = mediaPromise;
    mediaPromise.catch(() => {});

    // --- SpeechRecognition: real-time transcription ---
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
      // Don't setIsRecording(false) — let onend handle restart
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try { recognition.start(); } catch { /* permanent failure */ }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const uploadAudioBlob = async (blob: Blob): Promise<string | null> => {
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
    }
  };

  const stopRecording = useCallback(async () => {
    isRecordingRef.current = false;

    // Stop speech recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    // Wait for MediaRecorder to be ready
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
      audioBlob = new Blob(audioChunksRef.current, { type: audioMimeRef.current || "audio/webm" });
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsRecording(false);

    // Upload audio to server
    let savedAudioPath: string | null = null;
    if (audioBlob && audioBlob.size > 1000) {
      savedAudioPath = await uploadAudioBlob(audioBlob);
      if (savedAudioPath) setAudioUrl(savedAudioPath);
    }

    // Save record with audio path
    if (transcriptRef.current.trim() || savedAudioPath) {
      saveSpeakingRecord({
        date: new Date().toISOString().split("T")[0],
        scene: petPictures[pictureIndex].scene,
        transcript: transcriptRef.current.trim() || "(语音未识别到文字，可播放音频收听)",
        audioPath: savedAudioPath || undefined,
      }).catch(() => {});
    }
  }, [pictureIndex]);

  const handlePlayback = () => {
    if (!audioUrl) return;
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const handleStopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleStart = () => {
    setTimeLeft(60);
    setTranscript("");
    setAudioUrl(null);
    setIsRunning(true);
    startRecording();
  };

  const handleStop = () => {
    setIsRunning(false);
    stopRecording();
  };

  const handleReset = () => {
    // Stop playback if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    handleStop();
    setTimeLeft(60);
    setTranscript("");
    setAudioUrl(null);
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

      {/* Audio playback */}
      {audioUrl && !isRecording && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
          <audio ref={audioRef} src={audioUrl} className="hidden" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pet-light flex items-center justify-center text-pet-purple">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-700">录音回听</p>
              <p className="text-xs text-gray-400">
                {audioChunksRef.current.length > 0
                  ? `约 ${Math.round(audioChunksRef.current.reduce((s, b) => s + b.size, 0) / 16000)} 秒`
                  : "点击播放"}
              </p>
            </div>
            <button
              onClick={isPlaying ? handleStopPlayback : handlePlayback}
              className="w-10 h-10 rounded-full bg-pet-teal text-white flex items-center justify-center hover:bg-pet-teal-dark transition-colors"
            >
              {isPlaying ? (
                <Square className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
          </div>
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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
