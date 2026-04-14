import type {
  QuizQuestion,
  QuizAnswer,
  MatchResult,
  QuestionCategory,
  LikertValue,
} from "@/types/quiz";
import type { Candidate } from "@/types/candidate";

/**
 * Normalize a Likert 1–5 value to a –2..+2 scale.
 */
function normalize(value: LikertValue): number {
  return value - 3;
}

/**
 * Compute per-question similarity: 1.0 = perfect match, 0.0 = polar opposite.
 * Scale: |diff| / 4 max (from –2 to +2).
 */
function questionSimilarity(
  userValue: LikertValue,
  candidateStance: LikertValue
): number {
  const diff = Math.abs(normalize(userValue) - normalize(candidateStance));
  return 1 - diff / 4;
}

/**
 * Compute alignment score (0–100) between a voter's answers and a candidate.
 * Only questions where both the voter answered and the candidate has a position
 * are included. Skipped questions don't penalise either side.
 */
export function computeAlignment(
  answers: QuizAnswer[],
  questions: QuizQuestion[],
  candidate: Candidate
): MatchResult {
  const answeredMap = new Map(answers.map((a) => [a.questionId, a.value]));
  const positionMap = new Map(
    candidate.positions.map((p) => [p.questionId, p.stance])
  );
  const weightMap = new Map(questions.map((q) => [q.id, q.weight]));

  let weightedSum = 0;
  let totalWeight = 0;

  const categoryNumerators: Partial<Record<QuestionCategory, number>> = {};
  const categoryWeights: Partial<Record<QuestionCategory, number>> = {};

  for (const q of questions) {
    const userValue = answeredMap.get(q.id);
    const candidateStance = positionMap.get(q.id);

    if (userValue == null || candidateStance == null) continue;

    const similarity = questionSimilarity(userValue, candidateStance);
    const weight = weightMap.get(q.id) ?? 1;
    const score = similarity * weight * 100;

    weightedSum += score;
    totalWeight += weight;

    categoryNumerators[q.category] =
      (categoryNumerators[q.category] ?? 0) + score;
    categoryWeights[q.category] = (categoryWeights[q.category] ?? 0) + weight;
  }

  const alignmentScore =
    totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  const categoryScores: Partial<Record<QuestionCategory, number>> = {};
  for (const cat of Object.keys(categoryNumerators) as QuestionCategory[]) {
    const w = categoryWeights[cat]!;
    categoryScores[cat] = Math.round((categoryNumerators[cat]! / w));
  }

  // Sort categories for top aligned / top divergent
  const sortedCats = (
    Object.entries(categoryScores) as [QuestionCategory, number][]
  ).sort((a, b) => b[1] - a[1]);

  const topAlignedIssues = sortedCats.slice(0, 3).map(([c]) => c);
  const topDivergentIssues = sortedCats
    .slice(-3)
    .reverse()
    .map(([c]) => c);

  return {
    candidateId: candidate.id,
    alignmentScore,
    categoryScores,
    topAlignedIssues,
    topDivergentIssues,
  };
}

/**
 * Rank all candidates for a voter. Filters to candidates whose district
 * matches the voter's resolved districts (or statewide candidates with no
 * district). Returns results sorted by alignment score descending.
 */
export function rankCandidates(
  answers: QuizAnswer[],
  questions: QuizQuestion[],
  candidates: Candidate[],
  senateDist: number,
  houseDist: string
): MatchResult[] {
  const relevantCandidates = candidates.filter((c) => {
    if (c.district === null) return true; // statewide
    if (c.office === "nh_senate") return c.district === senateDist;
    if (c.office === "nh_house") return c.district === houseDist;
    return true; // federal/governor are statewide
  });

  return relevantCandidates
    .map((c) => computeAlignment(answers, questions, c))
    .sort((a, b) => b.alignmentScore - a.alignmentScore);
}

/**
 * Primary ballot recommendation for undeclared voters.
 * Returns "D", "R", or null if there's not enough data.
 */
export function primaryRecommendation(
  results: MatchResult[],
  candidates: Candidate[]
): "D" | "R" | null {
  const candMap = new Map(candidates.map((c) => [c.id, c]));
  const dScores: number[] = [];
  const rScores: number[] = [];

  for (const r of results) {
    const cand = candMap.get(r.candidateId);
    if (!cand) continue;
    if (cand.party === "D") dScores.push(r.alignmentScore);
    if (cand.party === "R") rScores.push(r.alignmentScore);
  }

  if (dScores.length === 0 && rScores.length === 0) return null;

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const dAvg = avg(dScores);
  const rAvg = avg(rScores);

  if (Math.abs(dAvg - rAvg) < 5) return null; // too close to call
  return dAvg > rAvg ? "D" : "R";
}

/**
 * Select questions for a quiz session.
 * Prioritises high-weight questions and those with known candidate positions.
 * Caps at 10 questions for the core quiz.
 */
export function selectQuestions(
  allQuestions: QuizQuestion[],
  candidates: Candidate[],
  senateDist: number,
  houseDist: string,
  maxQuestions = 10
): QuizQuestion[] {
  const relevantCandidates = candidates.filter((c) => {
    if (c.district === null) return true;
    if (c.office === "nh_senate") return c.district === senateDist;
    if (c.office === "nh_house") return c.district === houseDist;
    return true;
  });

  const coveredQuestionIds = new Set(
    relevantCandidates.flatMap((c) => c.positions.map((p) => p.questionId))
  );

  const scored = allQuestions
    .filter(
      (q) =>
        !q.applicableDistricts ||
        q.applicableDistricts.includes(String(senateDist)) ||
        q.applicableDistricts.includes(houseDist)
    )
    .map((q) => ({
      q,
      score: q.weight * (coveredQuestionIds.has(q.id) ? 2 : 1),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxQuestions).map((x) => x.q);
}
