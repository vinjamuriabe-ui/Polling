export type LikertValue = 1 | 2 | 3 | 4 | 5;

export type QuestionCategory =
  | "school_funding"
  | "property_taxes"
  | "housing"
  | "abortion"
  | "opioid_crisis"
  | "energy"
  | "gun_policy"
  | "budget"
  | "healthcare"
  | "nh_identity";

export interface DeepDive {
  summary: string;
  nhContext: string;
  learnMoreUrl: string | null;
}

export interface QuizQuestion {
  id: string;
  text: string;
  category: QuestionCategory;
  weight: number;
  deepDive?: DeepDive;
  applicableDistricts?: string[];
}

export interface QuizAnswer {
  questionId: string;
  value: LikertValue;
  answeredAt: number;
}

export type QuizStatus =
  | "location"
  | "in_progress"
  | "nudge"
  | "complete"
  | "results";

export interface MatchResult {
  candidateId: string;
  alignmentScore: number; // 0–100
  categoryScores: Partial<Record<QuestionCategory, number>>;
  topAlignedIssues: QuestionCategory[];
  topDivergentIssues: QuestionCategory[];
}

export interface QuizState {
  sessionId: string;
  status: QuizStatus;
  county: string;
  town: string;
  senateDist: number;
  houseDist: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  nudgeShown: boolean;
  retakeChosen: boolean;
  results: MatchResult[] | null;
}
