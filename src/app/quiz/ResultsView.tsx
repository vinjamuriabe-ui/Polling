"use client";

import { useEffect, useState } from "react";
import { CandidateCard } from "@/components/results/CandidateCard";
import { PrimaryBallotTip } from "@/components/results/PrimaryBallotTip";
import { Button } from "@/components/ui/Button";
import { useQuizStore } from "@/store/quizStore";
import { primaryRecommendation } from "@/lib/quiz/engine";
import type { MatchResult } from "@/types/quiz";
import type { Candidate } from "@/types/candidate";
import type { NHCounty } from "@/types/location";

interface ResultsViewProps {
  results: MatchResult[];
  candidates: Candidate[];
  senateDist: number;
  houseDist: string;
  county: NHCounty;
  town: string;
}

export function ResultsView({
  results,
  candidates,
  senateDist,
  houseDist,
  county,
  town,
}: ResultsViewProps) {
  const reset = useQuizStore((s) => s.reset);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const candMap = new Map(candidates.map((c) => [c.id, c]));
  const recommendation = primaryRecommendation(results, candidates);

  // Save session to DB once
  useEffect(() => {
    if (shareUrl || saving) return;
    setSaving(true);

    const store = useQuizStore.getState();

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        county: store.county,
        town: store.town,
        senateDist: store.senateDist,
        houseDist: store.houseDist,
        answers: store.answers,
        results: store.results,
        straightLineDetected: false,
        nudgeShown: store.nudgeShown,
        retakeChosen: store.retakeChosen,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.shareUrl) setShareUrl(data.shareUrl);
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShare() {
    const url = shareUrl ?? window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: "My NH Voter Match Results",
        text: `I found my NH candidate matches! See how I align with candidates in ${town}, NH.`,
        url,
      }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert("Link copied to clipboard!");
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "share_clicked", payload: { method: "native" } }),
    }).catch(() => {});
  }

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-granite-800">
          Your NH Candidate Matches
        </h1>
        <p className="text-granite-500 text-sm">
          {town}, {county} County · Senate District {senateDist} · {houseDist}
        </p>
      </div>

      {/* Primary tip */}
      <PrimaryBallotTip recommendation={recommendation} />

      {/* Candidate list */}
      <div className="space-y-4">
        {results.map((result, i) => {
          const candidate = candMap.get(result.candidateId);
          if (!candidate) return null;
          return (
            <CandidateCard
              key={result.candidateId}
              result={result}
              candidate={candidate}
              rank={i + 1}
            />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="primary" size="lg" className="flex-1" onClick={handleShare}>
          Share my results
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={reset}
        >
          Retake the quiz
        </Button>
      </div>

      {shareUrl && (
        <p className="text-xs text-center text-granite-400">
          Your results are saved at:{" "}
          <a href={shareUrl} className="underline text-mountain-blue">
            {shareUrl}
          </a>
        </p>
      )}
    </div>
  );
}
