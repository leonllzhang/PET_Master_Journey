"use client";

export default function SynonymError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      <div className="text-5xl">😅</div>
      <h2 className="text-xl font-bold text-gray-800">加载出错了</h2>
      <p className="text-sm text-gray-500 text-center">
        页面暂时无法加载，请刷新重试
      </p>
      <button
        onClick={reset}
        className="bg-pet-teal text-white px-6 py-2.5 rounded-full font-bold hover:bg-pet-teal-dark transition-colors"
      >
        重新加载
      </button>
    </div>
  );
}
