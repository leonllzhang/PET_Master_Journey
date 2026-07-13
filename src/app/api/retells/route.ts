import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.retellRecord.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const { date, transcript, episode } = await request.json();
  const record = await prisma.retellRecord.create({
    data: { date, transcript, episode: episode || "" },
  });
  return NextResponse.json(record);
}
