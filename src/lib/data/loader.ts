import type { QuizQuestion } from "@/types/quiz";
import type { Candidate } from "@/types/candidate";
import type { CountyData } from "@/types/location";

import questionsJson from "../../../public/data/questions.json";
import candidatesJson from "../../../public/data/candidates.json";
import countiesTownsJson from "../../../public/data/counties-towns.json";

export function loadQuestions(): QuizQuestion[] {
  return questionsJson.questions as QuizQuestion[];
}

export function loadCandidates(): Candidate[] {
  return candidatesJson.candidates as Candidate[];
}

export function loadCounties(): CountyData[] {
  return countiesTownsJson.counties as CountyData[];
}
