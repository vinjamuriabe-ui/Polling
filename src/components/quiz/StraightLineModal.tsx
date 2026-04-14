"use client";

import { Button } from "@/components/ui/Button";

interface StraightLineModalProps {
  onContinue: () => void;
  onRetake: () => void;
}

export function StraightLineModal({
  onContinue,
  onRetake,
}: StraightLineModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-granite-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="straight-line-title"
      aria-describedby="straight-line-description"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mountain-birch">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-8 h-8 text-granite-700"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2
            id="straight-line-title"
            className="text-xl font-semibold text-granite-800"
          >
            Just a quick check-in
          </h2>
          <p
            id="straight-line-description"
            className="text-granite-600 leading-relaxed"
          >
            We noticed you may have selected the same response for several
            questions in a row. That&apos;s completely fine — we just want to
            make sure each answer truly reflects what you think, so your results
            are as accurate as possible.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onContinue}
          >
            Yes, these reflect my views — continue
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onRetake}
          >
            Let me go back and reconsider
          </Button>
        </div>
      </div>
    </div>
  );
}
