import type { LikertValue } from "./quiz";

export type OfficeLevel =
  | "us_senate"
  | "us_house"
  | "governor"
  | "nh_senate"
  | "nh_house";

export interface CandidatePosition {
  questionId: string;
  stance: LikertValue;
  stanceNote?: string;
  sourceUrl?: string | null;
}

export interface Candidate {
  id: string;
  name: string;
  office: OfficeLevel;
  party: "D" | "R" | "I" | "L";
  district: number | string | null;
  bio: string;
  website?: string | null;
  imageUrl?: string | null;
  positions: CandidatePosition[];
}
