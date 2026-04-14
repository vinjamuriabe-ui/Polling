import { computeAlignment, rankCandidates, primaryRecommendation } from "@/lib/quiz/engine";
import type { QuizQuestion, QuizAnswer } from "@/types/quiz";
import type { Candidate } from "@/types/candidate";

const questions: QuizQuestion[] = [
  { id: "q1", text: "Q1", category: "housing", weight: 1 },
  { id: "q2", text: "Q2", category: "abortion", weight: 1 },
  { id: "q3", text: "Q3", category: "budget", weight: 1 },
];

const candidate: Candidate = {
  id: "cand_01",
  name: "Test Candidate",
  office: "governor",
  party: "D",
  district: null,
  bio: "",
  positions: [
    { questionId: "q1", stance: 5 },
    { questionId: "q2", stance: 5 },
    { questionId: "q3", stance: 5 },
  ],
};

describe("computeAlignment", () => {
  it("returns 100 when voter and candidate agree on everything", () => {
    const answers: QuizAnswer[] = [
      { questionId: "q1", value: 5, answeredAt: 0 },
      { questionId: "q2", value: 5, answeredAt: 0 },
      { questionId: "q3", value: 5, answeredAt: 0 },
    ];
    const result = computeAlignment(answers, questions, candidate);
    expect(result.alignmentScore).toBe(100);
  });

  it("returns 0 when voter and candidate are polar opposites", () => {
    const answers: QuizAnswer[] = [
      { questionId: "q1", value: 1, answeredAt: 0 },
      { questionId: "q2", value: 1, answeredAt: 0 },
      { questionId: "q3", value: 1, answeredAt: 0 },
    ];
    const result = computeAlignment(answers, questions, candidate);
    expect(result.alignmentScore).toBe(0);
  });

  it("returns 50 when voter is neutral (3) and candidate is at extreme (5)", () => {
    const answers: QuizAnswer[] = [
      { questionId: "q1", value: 3, answeredAt: 0 },
      { questionId: "q2", value: 3, answeredAt: 0 },
      { questionId: "q3", value: 3, answeredAt: 0 },
    ];
    const result = computeAlignment(answers, questions, candidate);
    expect(result.alignmentScore).toBe(50);
  });

  it("skips questions with no answer or candidate position", () => {
    const answers: QuizAnswer[] = [
      { questionId: "q1", value: 5, answeredAt: 0 },
      // q2 not answered
    ];
    const result = computeAlignment(answers, questions, candidate);
    // Only q1 counts: perfect match → 100
    expect(result.alignmentScore).toBe(100);
  });

  it("includes top aligned and top divergent issues", () => {
    const answers: QuizAnswer[] = [
      { questionId: "q1", value: 5, answeredAt: 0 }, // perfect
      { questionId: "q2", value: 1, answeredAt: 0 }, // opposite
      { questionId: "q3", value: 3, answeredAt: 0 }, // neutral
    ];
    const result = computeAlignment(answers, questions, candidate);
    expect(result.topAlignedIssues[0]).toBe("housing");
    expect(result.topDivergentIssues[0]).toBe("abortion");
  });
});

describe("rankCandidates", () => {
  const candidateD: Candidate = {
    id: "cand_d",
    name: "D Candidate",
    office: "governor",
    party: "D",
    district: null,
    bio: "",
    positions: [{ questionId: "q1", stance: 5 }],
  };
  const candidateR: Candidate = {
    id: "cand_r",
    name: "R Candidate",
    office: "governor",
    party: "R",
    district: null,
    bio: "",
    positions: [{ questionId: "q1", stance: 1 }],
  };

  it("ranks candidates by alignment score descending", () => {
    const answers: QuizAnswer[] = [{ questionId: "q1", value: 5, answeredAt: 0 }];
    const results = rankCandidates(answers, questions, [candidateD, candidateR], 15, "Merrimack-18");
    expect(results[0].candidateId).toBe("cand_d");
    expect(results[1].candidateId).toBe("cand_r");
  });
});

describe("primaryRecommendation", () => {
  it("recommends D when D scores are higher", () => {
    const results = [
      { candidateId: "cand_d", alignmentScore: 80, categoryScores: {}, topAlignedIssues: [], topDivergentIssues: [] },
      { candidateId: "cand_r", alignmentScore: 40, categoryScores: {}, topAlignedIssues: [], topDivergentIssues: [] },
    ];
    const candidates: Candidate[] = [
      { id: "cand_d", name: "D", office: "governor", party: "D", district: null, bio: "", positions: [] },
      { id: "cand_r", name: "R", office: "governor", party: "R", district: null, bio: "", positions: [] },
    ];
    expect(primaryRecommendation(results, candidates)).toBe("D");
  });

  it("returns null when scores are within 5 points", () => {
    const results = [
      { candidateId: "cand_d", alignmentScore: 60, categoryScores: {}, topAlignedIssues: [], topDivergentIssues: [] },
      { candidateId: "cand_r", alignmentScore: 57, categoryScores: {}, topAlignedIssues: [], topDivergentIssues: [] },
    ];
    const candidates: Candidate[] = [
      { id: "cand_d", name: "D", office: "governor", party: "D", district: null, bio: "", positions: [] },
      { id: "cand_r", name: "R", office: "governor", party: "R", district: null, bio: "", positions: [] },
    ];
    expect(primaryRecommendation(results, candidates)).toBeNull();
  });
});
