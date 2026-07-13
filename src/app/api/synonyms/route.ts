import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.synonymResult.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const { date, score, total, wrongWords } = await request.json();
  const record = await prisma.synonymResult.create({
    data: { date, score, total, wrongWords: JSON.stringify(wrongWords) },
  });
  return NextResponse.json(record);
}
