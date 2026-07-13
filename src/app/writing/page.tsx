"use client";

import WritingForm from "@/components/WritingForm";

export default function WritingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-extrabold text-gray-800">
          ✍️ AI 写作实验室
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          写作文，AI 帮你批改和提升！
        </p>
      </div>
      <WritingForm />
    </div>
  );
}
