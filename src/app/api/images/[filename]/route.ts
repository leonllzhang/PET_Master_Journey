import { NextResponse } from "next/server";
import { getUploadPath } from "@/lib/uploads";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Prevent directory traversal
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = getUploadPath(filename);

  try {
    const buffer = await readFile(filepath);
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".png": "image/png",
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webm": "audio/webm",
      ".m4a": "audio/mp4",
      ".mp4": "audio/mp4",
      ".wav": "audio/wav",
      ".mp3": "audio/mpeg",
    };
    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
