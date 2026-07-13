import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [tasks, synonyms, writings, speakings] = await Promise.all([
    prisma.dailyTask.findMany({ orderBy: { date: "desc" }, take: 365 }),
    prisma.synonymResult.findMany({ take: 500 }),
    prisma.writing.findMany({ take: 500 }),
    prisma.speaking.findMany({ take: 500 }),
  ]);

  const totalDays = tasks.length;
  const allRates = tasks.map((t) => {
    const done = JSON.parse(t.tasks).length;
    return done / 6;
  });
  const avgCompletion = allRates.length > 0 ? Math.round((allRates.reduce((a, b) => a + b, 0) / allRates.length) * 100) : 0;

  const totalCorrect = synonyms.reduce((s, r) => s + r.score, 0);
  const totalAttempts = synonyms.reduce((s, r) => s + r.total, 0);
  const synonymAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  let streak = 0;
  const sorted = [...tasks].sort((a, b) => b.date.localeCompare(a.date));
  for (const day of sorted) {
    const done = JSON.parse(day.tasks).length;
    if (done > 0) streak++;
    else break;
  }

  return NextResponse.json({
    totalDays,
    avgCompletion,
    synonymAccuracy,
    totalWritings: writings.length,
    totalSpeaking: speakings.length,
    streakDays: streak,
  });
}
