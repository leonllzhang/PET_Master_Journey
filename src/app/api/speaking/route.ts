import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.speaking.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const { date, scene, transcript } = await request.json();
  const record = await prisma.speaking.create({
    data: { date, scene, transcript },
  });
  return NextResponse.json(record);
}
