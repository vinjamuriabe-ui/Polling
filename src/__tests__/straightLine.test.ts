import { detectStraightLine } from "@/lib/quiz/straightLine";
import type { QuizAnswer } from "@/types/quiz";

function makeAnswers(values: (1 | 2 | 3 | 4 | 5)[]): QuizAnswer[] {
  return values.map((value, i) => ({
    questionId: `q_${i}`,
    value,
    answeredAt: Date.now(),
  }));
}

describe("detectStraightLine", () => {
  it("returns not detected for fewer than 4 answers", () => {
    expect(detectStraightLine(makeAnswers([5, 5, 5])).detected).toBe(false);
  });

  it("detects all 5s run of 4", () => {
    const result = detectStraightLine(makeAnswers([5, 5, 5, 5]));
    expect(result.detected).toBe(true);
    expect(result.pattern).toBe("all_max");
    expect(result.runLength).toBe(4);
  });

  it("detects all 1s run of 4", () => {
    const result = detectStraightLine(makeAnswers([1, 1, 1, 1]));
    expect(result.detected).toBe(true);
    expect(result.pattern).toBe("all_min");
  });

  it("does NOT detect a run of 4 non-extreme values", () => {
    expect(detectStraightLine(makeAnswers([3, 3, 3, 3])).detected).toBe(false);
  });

  it("does NOT detect mixed extreme values", () => {
    expect(detectStraightLine(makeAnswers([1, 5, 1, 5])).detected).toBe(false);
  });

  it("detects a run in the middle of a longer answer set", () => {
    const result = detectStraightLine(makeAnswers([3, 5, 5, 5, 5, 3]));
    expect(result.detected).toBe(true);
    expect(result.runLength).toBe(4);
  });

  it("does NOT detect when run is interrupted", () => {
    expect(
      detectStraightLine(makeAnswers([5, 5, 5, 3, 5])).detected
    ).toBe(false);
  });

  it("detects a run of 6 and returns the full length", () => {
    const result = detectStraightLine(makeAnswers([5, 5, 5, 5, 5, 5]));
    expect(result.detected).toBe(true);
    expect(result.runLength).toBe(6);
  });
});
