export interface Task {
  id: string;
  label: string;
  emoji: string;
  period: "morning" | "afternoon" | "evening";
  subtasks: string[];
}

export const defaultTasks: Task[] = [
  {
    id: "vocab",
    label: "词汇",
    emoji: "📖",
    period: "morning",
    subtasks: ["50 个新词学习", "100 个旧词复习"],
  },
  {
    id: "reading",
    label: "阅读",
    emoji: "📚",
    period: "morning",
    subtasks: ["2 篇真题精读", "同义改写练习"],
  },
  {
    id: "listening",
    label: "听力",
    emoji: "🎧",
    period: "afternoon",
    subtasks: ["1 套真题听力"],
  },
  {
    id: "writing",
    label: "写作",
    emoji: "✍️",
    period: "afternoon",
    subtasks: ["1 篇作文初稿"],
  },
  {
    id: "speaking",
    label: "口语",
    emoji: "🎤",
    period: "evening",
    subtasks: ["AI 对话练习", "图片描述"],
  },
  {
    id: "hilda",
    label: "Hilda 英语",
    emoji: "🦊",
    period: "evening",
    subtasks: ["看一集《Hilda》", "收集 3 个金句", "30 秒复述剧情"],
  },
];

export const periodLabels: Record<string, string> = {
  morning: "🌅 上午",
  afternoon: "☀️ 下午",
  evening: "🌙 晚上",
};
