"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import TaskCard from "@/components/TaskCard";
import { defaultTasks, periodLabels } from "@/data/tasks";

const encouragements = [
  "Amazing! One step closer to B1! 🌟",
  "You're on fire! Keep going! 🔥",
  "PET here you come! 🎯",
  "Brilliant effort today! 💪",
  "Every expert was once a beginner! 🌱",
  "You're making great progress! 📈",
];

const morningGreetings = [
  "Good morning, sunshine! Ready to learn? ☀️",
  "Rise and shine! Let's master PET! 🌅",
  "New day, new words! Let's go! 🚀",
];

const afternoonGreetings = [
  "Keep going! You're doing great! 💪",
  "Afternoon power session! ⚡",
  "Halfway there! Stay focused! 🎯",
];

export default function Home() {
  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set());
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragement, setEncouragement] = useState("");

  // Determine greeting based on time of day — use state + effect to avoid hydration mismatch
  const [greeting, setGreeting] = useState("Loading...");
  useEffect(() => {
    const hour = new Date().getHours();
    const msg =
      hour < 12
        ? morningGreetings[Math.floor(Math.random() * morningGreetings.length)]
        : hour < 18
          ? afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)]
          : "Evening study session! You're dedicated! 🌙";
    setGreeting(msg);
  }, []);

  const totalTasks = defaultTasks.length;
  const completedTasks = doneTasks.size;

  const handleToggle = (taskId: string) => {
    const newDone = new Set(doneTasks);
    if (newDone.has(taskId)) {
      newDone.delete(taskId);
    } else {
      newDone.add(taskId);
      // Show encouragement
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      setEncouragement(msg);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2500);
    }
    setDoneTasks(newDone);
  };

  const grouped = defaultTasks.reduce(
    (acc, task) => {
      const period = task.period;
      if (!acc[period]) acc[period] = [];
      acc[period].push(task);
      return acc;
    },
    {} as Record<string, typeof defaultTasks>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center py-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-extrabold bg-gradient-to-r from-pet-purple to-pet-teal bg-clip-text text-transparent"
        >
          ✨ PET Master Journey ✨
        </motion.h1>
        <p className="text-sm text-gray-500 mt-1">{greeting}</p>
      </div>

      {/* Progress */}
      <ProgressBar value={completedTasks} total={totalTasks} />

      {/* Encouragement toast */}
      {showEncouragement && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-pet-teal to-emerald-400 text-white rounded-2xl p-4 text-center font-bold shadow-lg"
        >
          <Sparkles className="w-5 h-5 inline-block mr-1" />
          {encouragement}
        </motion.div>
      )}

      {/* Tasks by period */}
      {Object.entries(grouped).map(([period, tasks]) => (
        <div key={period}>
          <h2 className="text-sm font-bold text-gray-500 mb-2 mt-1">
            {periodLabels[period] || period}
          </h2>
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                done={doneTasks.has(task.id)}
                onToggle={() => handleToggle(task.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          距离 PET 考试还有{" "}
          <span className="font-bold text-pet-purple">60</span> 天
        </p>
      </div>
    </div>
  );
}
