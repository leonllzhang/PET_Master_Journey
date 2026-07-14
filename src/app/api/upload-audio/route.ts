import { NextResponse } from "next/server";
import { ensureUploadDir } from "@/lib/uploads";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  let body: { audio?: string; mime?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.audio || typeof body.audio !== "string") {
    return NextResponse.json({ error: "Missing audio data" }, { status: 400 });
  }

  const raw = body.audio.includes("base64,")
    ? body.audio.split("base64,")[1]
    : body.audio;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(raw, "base64");
  } catch {
    return NextResponse.json({ error: "Invalid base64" }, { status: 400 });
  }

  // Limit to 10MB
  if (buffer.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Audio too large" }, { status: 400 });
  }

  const mime = body.mime || "audio/mp4";
  const ext = mime.includes("mp4") || mime.includes("aac") ? "m4a"
    : mime.includes("webm") ? "webm"
    : mime.includes("wav") ? "wav"
    : "bin";

  const filename = `${randomUUID()}.${ext}`;
  const dir = ensureUploadDir();
  await writeFile(`${dir}/${filename}`, buffer);

  return NextResponse.json({ path: `/api/images/${filename}` });
}
