"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  BookOpen,
  Clock,
  TrendingUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Award,
  Pen,
  Mic,
  Sparkles,
} from "lucide-react";
import {
  getAggregatedStats,
  getCalendarData,
  type CalendarDay,
} from "@/lib/storage";

export default function ParentDashboard() {
  const [stats, setStats] = useState({ totalDays: 0, avgCompletion: 0, synonymAccuracy: 0, totalWritings: 0, totalSpeaking: 0, streakDays: 0, synonymScore: 0 });
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    getAggregatedStats().then(setStats);
    getCalendarData().then(setCalendar);
    setLoaded(true);
  }, []);

  // Calendar helpers
  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const monthLabel = `${currentMonth.year}年${currentMonth.month + 1}月`;
  const today = new Date().toISOString().split("T")[0];

  const calendarDays: (CalendarDay & { day: number; isToday: boolean } | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayData = calendar.find((c) => c.date === dateStr);
    calendarDays.push({
      day: d,
      date: dateStr,
      isToday: dateStr === today,
      tasksDone: dayData?.tasksDone ?? 0,
      tasksTotal: 6,
      hasSynonym: dayData?.hasSynonym ?? false,
      hasWriting: dayData?.hasWriting ?? false,
      hasSpeaking: dayData?.hasSpeaking ?? false,
      hasHildaPhrase: dayData?.hasHildaPhrase ?? false,
      hasHildaRetell: dayData?.hasHildaRetell ?? false,
    });
  }

  const prevMonth = () =>
    setCurrentMonth((m) => (m.month === 0 ? { year: m.year - 1, month: 11 } : { ...m, month: m.month - 1 }));
  const nextMonth = () =>
    setCurrentMonth((m) => (m.month === 11 ? { year: m.year + 1, month: 0 } : { ...m, month: m.month + 1 }));

  return (
    <div className="flex flex-col gap-4">
      {/* Streak badge */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-amber-700 font-bold">🔥 连续打卡</p>
          <p className="text-3xl font-bold text-amber-600">{stats.streakDays} 天</p>
        </div>
        <div className="text-4xl">🏆</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          label="平均完成率"
          value={`${stats.avgCompletion}%`}
          color="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-purple-500" />}
          label="同义词正确率"
          value={`${stats.synonymAccuracy}%`}
          color="bg-purple-50 border-purple-200"
        />
        <StatCard
          icon={<Pen className="w-5 h-5 text-blue-500" />}
          label="作文练习"
          value={`${stats.totalWritings} 篇`}
          color="bg-blue-50 border-blue-200"
        />
        <StatCard
          icon={<Mic className="w-5 h-5 text-cyan-500" />}
          label="口语练习"
          value={`${stats.totalSpeaking} 次`}
          color="bg-cyan-50 border-cyan-200"
        />
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-5 h-5 text-pet-purple" />
            <span className="font-bold text-gray-700">打卡日历</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-gray-600 w-24 text-center">{monthLabel}</span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <span key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const hasActivity = day.tasksDone > 0 || day.hasSynonym || day.hasWriting || day.hasSpeaking || day.hasHildaPhrase || day.hasHildaRetell;
            const intensity = day.tasksDone / day.tasksTotal;
            const bgColor = !hasActivity
              ? "bg-gray-50"
              : intensity >= 0.8
                ? "bg-emerald-200"
                : intensity >= 0.5
                  ? "bg-emerald-100"
                  : "bg-emerald-50";

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(selectedDay?.date === day.date ? null : day)}
                className={`relative rounded-lg py-1.5 text-center text-xs font-bold transition-all ${bgColor} ${
                  day.isToday ? "ring-2 ring-pet-teal" : ""
                } ${selectedDay?.date === day.date ? "ring-2 ring-pet-purple" : ""}`}
              >
                <span className={hasActivity ? "text-gray-700" : "text-gray-300"}>
                  {day.day}
                </span>
                {hasActivity && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-pet-teal" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day details */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-gray-50 rounded-xl text-xs"
          >
            <p className="font-bold text-gray-700 mb-2">{selectedDay.date}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <ActivityRow label="✅ 任务完成" active={selectedDay.tasksDone > 0} detail={`${selectedDay.tasksDone}/${selectedDay.tasksTotal}`} />
              <ActivityRow label="📖 同义词" active={selectedDay.hasSynonym} detail="已做" />
              <ActivityRow label="✍️ 写作" active={selectedDay.hasWriting} detail="已做" />
              <ActivityRow label="🎤 口语" active={selectedDay.hasSpeaking} detail="已做" />
              <ActivityRow label="💎 金句" active={selectedDay.hasHildaPhrase} detail="已收集" />
              <ActivityRow label="🎙️ 复述" active={selectedDay.hasHildaRetell} detail="已做" />
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-50" /> 未完成</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-50" /> 部分</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-200" /> 完成</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-pet-teal ring-2 ring-pet-teal" /> 今天</span>
        </div>
      </div>

      {/* Weekly summary */}
      <WeeklySummary calendar={calendar} />

      {/* Insight */}
      <div className="bg-gradient-to-r from-pet-light to-pet-pink rounded-2xl p-4 border border-pet-light">
        <h3 className="font-bold text-gray-700 mb-1">💡 学习建议</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          阅读是核心提升点。建议每天增加 15 分钟的同义词专项练习，
          重点关注同义改写题的解题技巧。口语继续保持优势！
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl p-4 border-2 ${color}`}
    >
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs text-gray-500 font-bold">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
}

function ActivityRow({ label, active, detail }: { label: string; active: boolean; detail: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={active ? "text-emerald-500" : "text-gray-300"}>
        {active ? "✓" : "○"}
      </span>
      <span className={active ? "text-gray-700" : "text-gray-400"}>{label}</span>
      {active && <span className="text-gray-400 ml-auto">{detail}</span>}
    </div>
  );
}

function WeeklySummary({ calendar }: { calendar: CalendarDay[] }) {
  // Get last 7 days including today
  const last7: { label: string; rate: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayData = calendar.find((c) => c.date === dateStr);
    const rate = dayData ? dayData.tasksDone / dayData.tasksTotal : 0;
    const labels = ["日", "一", "二", "三", "四", "五", "六"];
    last7.push({ label: labels[d.getDay()], rate });
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
      <h3 className="font-bold text-gray-700 mb-3">📊 最近 7 天</h3>
      <div className="flex items-end justify-between gap-2 h-28">
        {last7.map((d, i) => {
          const height = Math.max(d.rate * 100, 2);
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-gray-400 font-bold">
                {Math.round(d.rate * 100)}%
              </span>
              <div className="w-full bg-gray-50 rounded-lg relative flex-1" style={{ minHeight: "60px" }}>
                <motion.div
                  className="absolute bottom-0 w-full rounded-lg progress-gradient"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
              <span className="text-[10px] text-gray-400">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
