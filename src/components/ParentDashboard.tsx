"use client";

import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Clock, TrendingUp } from "lucide-react";

const mockStats = {
  completionRate: 73,
  vocabCoverage: 62,
  readingAccuracy: 68,
  totalHours: 18.5,
  streakDays: 5,
};

const mockWeeklyData = [
  { day: "周一", done: 4, total: 5 },
  { day: "周二", done: 5, total: 5 },
  { day: "周三", done: 3, total: 5 },
  { day: "周四", done: 5, total: 5 },
  { day: "周五", done: 2, total: 5 },
  { day: "周六", done: 0, total: 5 },
  { day: "周日", done: 0, total: 5 },
];

export default function ParentDashboard() {
  return (
    <div className="flex flex-col gap-4">
      {/* Streak badge */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-amber-700 font-bold">🔥 连续打卡</p>
          <p className="text-3xl font-bold text-amber-600">{mockStats.streakDays} 天</p>
        </div>
        <div className="text-4xl">🏆</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          label="完成率"
          value={`${mockStats.completionRate}%`}
          color="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-purple-500" />}
          label="词汇覆盖率"
          value={`${mockStats.vocabCoverage}%`}
          color="bg-purple-50 border-purple-200"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
          label="阅读正确率"
          value={`${mockStats.readingAccuracy}%`}
          color="bg-blue-50 border-blue-200"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-cyan-500" />}
          label="总练习时长"
          value={`${mockStats.totalHours}h`}
          color="bg-cyan-50 border-cyan-200"
        />
      </div>

      {/* Weekly chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pet-light">
        <h3 className="font-bold text-gray-700 mb-3">📊 本周完成情况</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {mockWeeklyData.map((d, i) => {
            const height = d.total > 0 ? (d.done / d.total) * 100 : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-gray-400 font-bold">
                  {d.done}/{d.total}
                </span>
                <div className="w-full bg-gray-50 rounded-lg relative" style={{ height: "80px" }}>
                  <motion.div
                    className="absolute bottom-0 w-full rounded-lg progress-gradient"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

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
