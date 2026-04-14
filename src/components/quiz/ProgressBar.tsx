"use client";

interface ProgressBarProps {
  current: number; // 0-indexed current question
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-granite-500">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-granite-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Quiz progress: ${pct}%`}
      >
        <div
          className="h-full rounded-full bg-mountain-pine transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
