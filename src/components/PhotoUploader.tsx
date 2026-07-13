"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";

interface PhotoUploaderProps {
  onUploadComplete: (imagePath: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function PhotoUploader({ onUploadComplete, onRemove, disabled }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMsg("请选择图片文件");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setStatus("error");
      setErrorMsg("图片太大，请选择小于 10MB 的照片");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    let base64: string;
    try {
      base64 = await fileToBase64(file);
    } catch {
      setStatus("error");
      setErrorMsg("读取图片失败，请重试");
      return;
    }

    setPreview(base64);

    // Resize for faster upload
    try {
      base64 = await resizeImage(base64, 2048, 0.85);
    } catch {
      // Use original if resize fails
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "上传失败");
      }

      const data = await res.json();
      setStatus("done");
      onUploadComplete(data.path);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "上传失败，请重试");
      setPreview(null);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setStatus("idle");
    setPreview(null);
    setErrorMsg("");
    onRemove();
  };

  return (
    <div className="flex flex-col gap-3">
      {status === "done" && preview ? (
        /* Uploaded state: show preview + remove button */
        <div className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50">
          <img
            src={preview}
            alt="手写照片"
            className="w-full max-h-64 object-contain bg-white"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            已上传
          </div>
        </div>
      ) : status === "loading" ? (
        /* Loading state */
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pet-light bg-pet-light/20 py-8">
          <Loader2 className="w-8 h-8 animate-spin text-pet-teal" />
          <span className="text-sm text-gray-500 font-medium">上传中...</span>
          {preview && (
            <img
              src={preview}
              alt="上传中"
              className="w-20 h-20 object-cover rounded-lg opacity-50 mt-2"
            />
          )}
        </div>
      ) : (
        /* Idle or error state */
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pet-lavender bg-pet-light/30 hover:bg-pet-light/60 transition-colors py-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-8 h-8 text-pet-purple" />
            <span className="text-sm font-bold text-pet-purple">拍照上传手写作文</span>
            <span className="text-xs text-gray-400">支持 JPG / PNG，最大 10MB</span>
          </button>
          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInput}
        className="hidden"
      />
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(base64: string, maxDim = 2048, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(base64); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("resize failed"));
    img.src = base64;
  });
}
