import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.dailyTask.findMany({ orderBy: { date: "desc" }, take: 365 });
  return NextResponse.json(tasks);
}

export async function PUT(request: Request) {
  const { date, tasks } = await request.json();
  const record = await prisma.dailyTask.upsert({
    where: { date },
    update: { tasks: JSON.stringify(tasks) },
    create: { date, tasks: JSON.stringify(tasks) },
  });
  return NextResponse.json(record);
}
