"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";
import { loadQuestions, loadCandidates } from "@/lib/data/loader";
import { selectQuestions } from "@/lib/quiz/engine";
import { LocationPicker } from "@/components/quiz/LocationPicker";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { StraightLineModal } from "@/components/quiz/StraightLineModal";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { ResultsView } from "./ResultsView";
import type { NHCounty } from "@/types/location";
import type { LikertValue } from "@/types/quiz";

const ALL_QUESTIONS = loadQuestions();
const ALL_CANDIDATES = loadCandidates();

export function QuizController() {
  const {
    status,
    county,
    town,
    senateDist,
    houseDist,
    questions,
    currentIndex,
    answers,
    results,
    setLocation,
    startQuiz,
    answerQuestion,
    dismissNudge,
    retakeQuiz,
    computeAndSetResults,
  } = useQuizStore();

  // On mount: if returning user has a completed session in localStorage,
  // they'll already be at "results" status via persistence.
  // If they have an in_progress session, we restore it automatically.

  function handleLocationSelect(
    c: NHCounty,
    t: string,
    senateDist: number,
    houseDist: string
  ) {
    setLocation(c, t, senateDist, houseDist);
    const selected = selectQuestions(
      ALL_QUESTIONS,
      ALL_CANDIDATES,
      senateDist,
      houseDist
    );
    startQuiz(selected);
  }

  function handleAnswer(value: LikertValue) {
    const q = questions[currentIndex];
    if (!q) return;
    answerQuestion(q.id, value, ALL_CANDIDATES);
  }

  // When nudge is dismissed with "continue" and all questions done, compute results
  function handleDismissNudge() {
    dismissNudge();
    // After dismissNudge, check if all questions are answered
    const store = useQuizStore.getState();
    if (store.currentIndex >= store.questions.length && store.status !== "results") {
      computeAndSetResults(ALL_CANDIDATES);
    }
  }

  // Track analytics (fire-and-forget)
  useEffect(() => {
    if (status === "results" && results) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "quiz_completed" }),
      }).catch(() => {});
    }
  }, [status, results]);

  useEffect(() => {
    if (status === "nudge") {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "straight_line_nudge_shown" }),
      }).catch(() => {});
    }
  }, [status]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (status === "location") {
    return (
      <div className="py-8">
        <LocationPicker onSelect={handleLocationSelect} />
      </div>
    );
  }

  if (status === "results" && results) {
    return (
      <ResultsView
        results={results}
        candidates={ALL_CANDIDATES}
        senateDist={senateDist}
        houseDist={houseDist}
        county={county as NHCounty}
        town={town}
      />
    );
  }

  if (status === "in_progress" || status === "nudge") {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers.find(
      (a) => a.questionId === currentQuestion?.id
    );

    return (
      <div className="py-8 space-y-6">
        <ProgressBar current={currentIndex} total={questions.length} />

        {currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            selectedValue={currentAnswer?.value ?? null}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="text-center text-granite-500 py-8">
            Loading results…
          </div>
        )}

        {status === "nudge" && (
          <StraightLineModal
            onContinue={handleDismissNudge}
            onRetake={() => {
              fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventType: "retake_chosen" }),
              }).catch(() => {});
              retakeQuiz();
            }}
          />
        )}
      </div>
    );
  }

  // Fallback / loading
  return (
    <div className="py-8 text-center text-granite-500">
      Loading your quiz…
    </div>
  );
}
