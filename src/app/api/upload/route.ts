import { NextResponse } from "next/server";
import { ensureUploadDir } from "@/lib/uploads";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  let body: { image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.image || typeof body.image !== "string") {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }

  // Extract base64 data (strip data URL prefix)
  const raw = body.image.includes("base64,")
    ? body.image.split("base64,")[1]
    : body.image;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(raw, "base64");
  } catch {
    return NextResponse.json({ error: "Invalid base64" }, { status: 400 });
  }

  // Limit to 10MB
  if (buffer.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large" }, { status: 400 });
  }

  const ext = body.image.includes("image/png") ? "png" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const dir = ensureUploadDir();

  await writeFile(`${dir}/${filename}`, buffer);

  return NextResponse.json({ path: `/api/images/${filename}` });
}
