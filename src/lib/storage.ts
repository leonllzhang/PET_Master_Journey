const BASE = "/api";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ====== Daily Tasks ======
export interface DayRecord {
  date: string;
  doneTasks: string[];
}

export async function saveDayTasks(doneTasks: string[]): Promise<void> {
  await api("/tasks", {
    method: "PUT",
    body: JSON.stringify({ date: todayStr(), tasks: doneTasks }),
  });
}

export async function loadTodayTasks(): Promise<string[]> {
  try {
    const tasks: any[] = await api("/tasks");
    const today = todayStr();
    const found = tasks.find((t: any) => t.date === today);
    return found ? JSON.parse(found.tasks) : [];
  } catch {
    return [];
  }
}

export async function loadAllDayTasks(): Promise<Record<string, DayRecord>> {
  try {
    const tasks: any[] = await api("/tasks");
    const map: Record<string, DayRecord> = {};
    for (const t of tasks) {
      map[t.date] = { date: t.date, doneTasks: JSON.parse(t.tasks) };
    }
    return map;
  } catch {
    return {};
  }
}

// ====== Synonym History ======
export interface SynonymResult {
  date: string;
  score: number;
  total: number;
  wrongWords: { word: string; correct: string }[];
}

export async function saveSynonymResult(result: SynonymResult): Promise<void> {
  await api("/synonyms", {
    method: "POST",
    body: JSON.stringify(result),
  });
}

export async function loadSynonymHistory(): Promise<SynonymResult[]> {
  try {
    const records: any[] = await api("/synonyms");
    return records.map((r) => ({
      ...r,
      wrongWords: typeof r.wrongWords === "string" ? JSON.parse(r.wrongWords) : r.wrongWords,
    }));
  } catch {
    return [];
  }
}

// ====== Writing History ======
export interface WritingRecord {
  date: string;
  text: string;
  feedback: string;
  wordCount: number;
}

export async function saveWritingRecord(record: WritingRecord): Promise<void> {
  await api("/writings", { method: "POST", body: JSON.stringify(record) });
}

export async function loadWritingHistory(): Promise<WritingRecord[]> {
  try {
    return await api("/writings");
  } catch {
    return [];
  }
}

// ====== Speaking History ======
export interface SpeakingRecord {
  date: string;
  scene: string;
  transcript: string;
}

export async function saveSpeakingRecord(record: SpeakingRecord): Promise<void> {
  await api("/speaking", { method: "POST", body: JSON.stringify(record) });
}

export async function loadSpeakingHistory(): Promise<SpeakingRecord[]> {
  try {
    return await api("/speaking");
  } catch {
    return [];
  }
}

// ====== Golden Phrases ======
export async function savePhrase(phrase: { text: string; speaker: string; episode: string }): Promise<void> {
  await api("/phrases", { method: "POST", body: JSON.stringify(phrase) });
}

export async function loadPhrases(): Promise<any[]> {
  try {
    return await api("/phrases");
  } catch {
    return [];
  }
}

export async function deletePhrase(id: string): Promise<void> {
  await api("/phrases", { method: "DELETE", body: JSON.stringify({ id }) });
}

// ====== Retell Records ======
export async function saveRetell(record: { date: string; transcript: string; episode: string }): Promise<void> {
  await api("/retells", { method: "POST", body: JSON.stringify(record) });
}

export async function loadRetells(): Promise<any[]> {
  try {
    return await api("/retells");
  } catch {
    return [];
  }
}

// ====== Calendar & Stats ======
export interface CalendarDay {
  date: string;
  tasksDone: number;
  tasksTotal: number;
  hasSynonym: boolean;
  hasWriting: boolean;
  hasSpeaking: boolean;
  hasHildaPhrase: boolean;
  hasHildaRetell: boolean;
}

export async function getCalendarData(): Promise<CalendarDay[]> {
  try {
    return await api("/calendar");
  } catch {
    return [];
  }
}

export async function getAggregatedStats(): Promise<{
  totalDays: number;
  avgCompletion: number;
  synonymAccuracy: number;
  totalWritings: number;
  totalSpeaking: number;
  streakDays: number;
  synonymScore: number;
}> {
  try {
    return await api("/stats");
  } catch {
    return { totalDays: 0, avgCompletion: 0, synonymAccuracy: 0, totalWritings: 0, totalSpeaking: 0, streakDays: 0, synonymScore: 0 };
  }
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}
