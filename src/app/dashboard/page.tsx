"use client";

import ParentDashboard from "@/components/ParentDashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-extrabold text-gray-800">
          📊 学习统计
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          查看学习进度和表现分析
        </p>
      </div>
      <ParentDashboard />
    </div>
  );
}
