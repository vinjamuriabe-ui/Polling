interface AlignmentBarProps {
  score: number; // 0–100
  size?: "sm" | "md" | "lg";
}

function scoreColor(score: number): string {
  if (score >= 75) return "bg-mountain-pine";
  if (score >= 50) return "bg-mountain-blue";
  if (score >= 30) return "bg-mountain-amber";
  return "bg-granite-400";
}

export function AlignmentBar({ score, size = "md" }: AlignmentBarProps) {
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex-1 rounded-full bg-granite-100 overflow-hidden ${heights[size]}`}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Alignment: ${score}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-semibold text-granite-700">
        {score}%
      </span>
    </div>
  );
}
