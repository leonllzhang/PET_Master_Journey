import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [tasks, synonyms, writings, speakings, phrases, retells] = await Promise.all([
    prisma.dailyTask.findMany({ take: 500 }),
    prisma.synonymResult.findMany({ take: 500 }),
    prisma.writing.findMany({ take: 500 }),
    prisma.speaking.findMany({ take: 500 }),
    prisma.goldenPhrase.findMany({ take: 500 }),
    prisma.retellRecord.findMany({ take: 500 }),
  ]);

  const dateSet = new Set<string>();
  tasks.forEach((t) => dateSet.add(t.date));
  synonyms.forEach((s) => dateSet.add(s.date));
  writings.forEach((w) => dateSet.add(w.date));
  speakings.forEach((s) => dateSet.add(s.date));
  phrases.forEach((p) => dateSet.add(p.createdAt.toISOString().split("T")[0]));
  retells.forEach((r) => dateSet.add(r.createdAt.toISOString().split("T")[0]));

  const synonymDates = new Set(synonyms.map((s) => s.date));
  const writingDates = new Set(writings.map((w) => w.date));
  const speakingDates = new Set(speakings.map((s) => s.date));
  const phraseDates = new Set(phrases.map((p) => p.createdAt.toISOString().split("T")[0]));
  const retellDates = new Set(retells.map((r) => r.createdAt.toISOString().split("T")[0]));
  const taskMap = new Map(tasks.map((t) => [t.date, JSON.parse(t.tasks).length]));

  const calendar = Array.from(dateSet).sort().map((date) => ({
    date,
    tasksDone: taskMap.get(date) ?? 0,
    tasksTotal: 6,
    hasSynonym: synonymDates.has(date),
    hasWriting: writingDates.has(date),
    hasSpeaking: speakingDates.has(date),
    hasHildaPhrase: phraseDates.has(date),
    hasHildaRetell: retellDates.has(date),
  }));

  return NextResponse.json(calendar);
}
