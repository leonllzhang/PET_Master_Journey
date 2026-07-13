"use client";

import { motion } from "framer-motion";
import { Task } from "@/data/tasks";

interface TaskCardProps {
  task: Task;
  done: boolean;
  onToggle: () => void;
}

const iconColors: Record<string, string> = {
  vocab: "from-purple-200 to-purple-100 border-purple-200",
  reading: "from-blue-200 to-blue-100 border-blue-200",
  listening: "from-cyan-200 to-cyan-100 border-cyan-200",
  writing: "from-pink-200 to-pink-100 border-pink-200",
  speaking: "from-amber-200 to-amber-100 border-amber-200",
  hilda: "from-orange-200 to-orange-100 border-orange-200",
};

const iconBg: Record<string, string> = {
  vocab: "bg-purple-100 text-purple-600",
  reading: "bg-blue-100 text-blue-600",
  listening: "bg-cyan-100 text-cyan-600",
  writing: "bg-pink-100 text-pink-600",
  speaking: "bg-amber-100 text-amber-600",
  hilda: "bg-orange-100 text-orange-600",
};

export default function TaskCard({ task, done, onToggle }: TaskCardProps) {
  return (
    <motion.div
      layout
      className={`task-card rounded-2xl p-4 border-2 cursor-pointer select-none
        ${done ? "task-card-done border-emerald-300" : `bg-white border-gray-100 ${iconColors[task.id] || "border-gray-100"}`}
      `}
      onClick={onToggle}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg[task.id]}`}>
          {task.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-base ${done ? "text-emerald-700 line-through" : "text-gray-800"}`}>
              {task.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {task.subtasks.map((s, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  done
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
            ${done ? "bg-emerald-400 border-emerald-400 text-white" : "border-gray-300 bg-white"}`}
          whileTap={{ scale: 0.8 }}
        >
          {done ? (
            <motion.svg
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          ) : (
            <div className="w-3 h-3 rounded-full bg-gray-200" />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
