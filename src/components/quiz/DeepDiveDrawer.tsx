"use client";

import { useState } from "react";
import type { DeepDive } from "@/types/quiz";

interface DeepDiveDrawerProps {
  deepDive: DeepDive;
}

export function DeepDiveDrawer({ deepDive }: DeepDiveDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-sm text-mountain-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-blue rounded"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        What does this mean in New Hampshire?
      </button>

      {open && (
        <div className="mt-3 rounded-lg border border-mountain-blue/20 bg-mountain-sky p-4 text-sm text-granite-700 space-y-2">
          <p>{deepDive.summary}</p>
          <p className="text-granite-600 italic">{deepDive.nhContext}</p>
          {deepDive.learnMoreUrl && (
            <a
              href={deepDive.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain-blue hover:underline font-medium inline-block mt-1"
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
