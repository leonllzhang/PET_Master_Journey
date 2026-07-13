import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const phrases = await prisma.goldenPhrase.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(phrases);
}

export async function POST(request: Request) {
  const { text, speaker, episode } = await request.json();
  const phrase = await prisma.goldenPhrase.create({
    data: { text, speaker: speaker || "", episode: episode || "" },
  });
  return NextResponse.json(phrase);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.goldenPhrase.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
