"use client";

import { DeepDiveDrawer } from "./DeepDiveDrawer";
import type { QuizQuestion, LikertValue } from "@/types/quiz";
import { clsx } from "clsx";

const LIKERT_OPTIONS: { value: LikertValue; label: string }[] = [
  { value: 1, label: "Strongly Oppose" },
  { value: 2, label: "Oppose" },
  { value: 3, label: "Neutral / Not Sure" },
  { value: 4, label: "Support" },
  { value: 5, label: "Strongly Support" },
];

interface QuestionCardProps {
  question: QuizQuestion;
  selectedValue: LikertValue | null;
  onAnswer: (value: LikertValue) => void;
}

export function QuestionCard({
  question,
  selectedValue,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-granite-800 leading-snug">
        {question.text}
      </h2>

      <div role="group" aria-label="Your response" className="space-y-3">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onAnswer(opt.value)}
            className={clsx(
              "w-full rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-blue focus-visible:ring-offset-2",
              selectedValue === opt.value
                ? "border-mountain-pine bg-mountain-pine text-white"
                : "border-granite-200 bg-white text-granite-700 hover:border-mountain-pine/50 hover:bg-granite-50 active:bg-granite-100"
            )}
            aria-pressed={selectedValue === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {question.deepDive && <DeepDiveDrawer deepDive={question.deepDive} />}
    </div>
  );
}
