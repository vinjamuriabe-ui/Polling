import type { QuizAnswer, LikertValue } from "@/types/quiz";

const STRAIGHT_LINE_THRESHOLD = 4;
const EXTREME_VALUES: LikertValue[] = [1, 5];

export interface StraightLineResult {
  detected: boolean;
  pattern: "all_min" | "all_max" | null;
  runLength: number;
}

/**
 * Detects straight-line response patterns: 4 or more consecutive identical
 * extreme answers (all 1s or all 5s). Called after each question is answered.
 * The modal is shown only once per session — callers must track `nudgeShown`.
 */
export function detectStraightLine(answers: QuizAnswer[]): StraightLineResult {
  if (answers.length < STRAIGHT_LINE_THRESHOLD) {
    return { detected: false, pattern: null, runLength: 0 };
  }

  let maxRun = 1;
  let currentRun = 1;
  let runValue: LikertValue = answers[0].value;

  for (let i = 1; i < answers.length; i++) {
    const prev = answers[i - 1].value;
    const curr = answers[i].value;

    if (curr === prev && EXTREME_VALUES.includes(curr)) {
      currentRun++;
      runValue = curr;
      if (currentRun > maxRun) {
        maxRun = currentRun;
      }
    } else {
      if (currentRun > maxRun) maxRun = currentRun;
      currentRun = 1;
    }
  }

  const detected = maxRun >= STRAIGHT_LINE_THRESHOLD;
  return {
    detected,
    pattern: detected
      ? runValue === 1
        ? "all_min"
        : "all_max"
      : null,
    runLength: maxRun,
  };
}
