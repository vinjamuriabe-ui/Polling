"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  QuizQuestion,
  QuizAnswer,
  QuizStatus,
  MatchResult,
  LikertValue,
} from "@/types/quiz";
import type { Candidate } from "@/types/candidate";
import type { NHCounty } from "@/types/location";
import { detectStraightLine } from "@/lib/quiz/straightLine";
import { rankCandidates } from "@/lib/quiz/engine";

interface QuizStore {
  // ── State ──────────────────────────────────────────────
  sessionId: string;
  status: QuizStatus;
  county: NHCounty | "";
  town: string;
  senateDist: number;
  houseDist: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  nudgeShown: boolean;
  retakeChosen: boolean;
  results: MatchResult[] | null;

  // ── Actions ────────────────────────────────────────────
  setLocation: (
    county: NHCounty,
    town: string,
    senateDist: number,
    houseDist: string
  ) => void;
  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (
    questionId: string,
    value: LikertValue,
    allCandidates: Candidate[]
  ) => void;
  dismissNudge: () => void;
  retakeQuiz: () => void;
  computeAndSetResults: (allCandidates: Candidate[]) => void;
  reset: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const initialState = {
  sessionId: generateId(),
  status: "location" as QuizStatus,
  county: "" as NHCounty | "",
  town: "",
  senateDist: 0,
  houseDist: "",
  questions: [] as QuizQuestion[],
  currentIndex: 0,
  answers: [] as QuizAnswer[],
  nudgeShown: false,
  retakeChosen: false,
  results: null as MatchResult[] | null,
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLocation(county, town, senateDist, houseDist) {
        set({ county, town, senateDist, houseDist });
      },

      startQuiz(questions) {
        set({ questions, currentIndex: 0, status: "in_progress" });
      },

      answerQuestion(questionId, value, allCandidates) {
        const { answers, currentIndex, questions, nudgeShown, senateDist, houseDist } =
          get();

        const newAnswer: QuizAnswer = {
          questionId,
          value,
          answeredAt: Date.now(),
        };
        const newAnswers = [...answers, newAnswer];

        // Straight-line detection — only if nudge not already shown
        if (!nudgeShown) {
          const slResult = detectStraightLine(newAnswers);
          if (slResult.detected) {
            set({
              answers: newAnswers,
              currentIndex: currentIndex + 1,
              status: "nudge",
            });
            return;
          }
        }

        const nextIndex = currentIndex + 1;
        const isLastQuestion = nextIndex >= questions.length;

        if (isLastQuestion) {
          const results = rankCandidates(
            newAnswers,
            questions,
            allCandidates,
            senateDist,
            houseDist
          );
          set({
            answers: newAnswers,
            currentIndex: nextIndex,
            status: "results",
            results,
          });
        } else {
          set({ answers: newAnswers, currentIndex: nextIndex });
        }
      },

      dismissNudge() {
        const { answers, questions, senateDist, houseDist } = get();
        const currentIndex = get().currentIndex;
        const isLastQuestion = currentIndex >= questions.length;

        if (isLastQuestion) {
          // All questions answered before nudge was triggered
          const allCandidates: Candidate[] = []; // caller passes via computeAndSetResults
          const results = rankCandidates(
            answers,
            questions,
            allCandidates,
            senateDist,
            houseDist
          );
          set({ nudgeShown: true, status: "results", results });
        } else {
          set({ nudgeShown: true, status: "in_progress" });
        }
      },

      retakeQuiz() {
        set({
          answers: [],
          currentIndex: 0,
          status: "in_progress",
          retakeChosen: true,
          nudgeShown: false,
          results: null,
        });
      },

      computeAndSetResults(allCandidates) {
        const { answers, questions, senateDist, houseDist } = get();
        const results = rankCandidates(
          answers,
          questions,
          allCandidates,
          senateDist,
          houseDist
        );
        set({ status: "results", results });
      },

      reset() {
        set({ ...initialState, sessionId: generateId() });
      },
    }),
    {
      name: "nh-quiz-session-v1",
      // Only persist critical state for resume-on-reload
      partialize: (state) => ({
        sessionId: state.sessionId,
        status: state.status,
        county: state.county,
        town: state.town,
        senateDist: state.senateDist,
        houseDist: state.houseDist,
        questions: state.questions,
        currentIndex: state.currentIndex,
        answers: state.answers,
        nudgeShown: state.nudgeShown,
        retakeChosen: state.retakeChosen,
        results: state.results,
      }),
    }
  )
);
