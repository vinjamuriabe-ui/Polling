import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { loadCandidates } from "@/lib/data/loader";
import { CandidateCard } from "@/components/results/CandidateCard";
import { PrimaryBallotTip } from "@/components/results/PrimaryBallotTip";
import { primaryRecommendation } from "@/lib/quiz/engine";
import type { MatchResult } from "@/types/quiz";
import type { Candidate } from "@/types/candidate";
import Link from "next/link";

interface Props {
  params: { sessionId: string };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata(_: Props) {
  return {
    title: "NH Voter Match Results",
    description: "See how this voter's views align with NH candidates.",
    openGraph: {
      title: "NH Voter Match Results",
      description: "Find out which NH candidates align with your values.",
    },
  };
}

export default async function SharedResultsPage({ params }: Props) {
  let session;
  try {
    session = await prisma.quizSession.findUnique({
      where: { id: params.sessionId },
    });
  } catch {
    // DB not configured in this environment — graceful fallback
    return (
      <main className="min-h-screen bg-granite-50 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-granite-800">Results not available</h1>
        <p className="text-granite-500">Database connection not configured.</p>
        <Link href="/quiz" className="text-mountain-blue underline">Take the quiz yourself</Link>
      </main>
    );
  }

  if (!session) notFound();

  const candidates = loadCandidates();
  const results = (session.results ?? []) as unknown as MatchResult[];

  if (!results.length) {
    return (
      <main className="min-h-screen bg-granite-50 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-granite-800">Results not found</h1>
        <Link href="/quiz" className="text-mountain-blue underline">Take the quiz</Link>
      </main>
    );
  }

  const candMap = new Map(candidates.map((c: Candidate) => [c.id, c]));
  const recommendation = primaryRecommendation(results, candidates);

  return (
    <main className="min-h-screen bg-granite-50">
      <header className="bg-white border-b border-granite-200 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-display font-bold text-granite-800">
          NH Voter Match
        </Link>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-granite-800">
            NH Candidate Match Results
          </h1>
          <p className="text-granite-500 text-sm">
            {session.town}, {session.county} County · Senate District {session.senateDist} · {session.houseDist}
          </p>
        </div>

        <PrimaryBallotTip recommendation={recommendation} />

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

        <div className="pt-4 text-center">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-lg bg-mountain-pine text-white font-semibold h-12 px-8 hover:bg-mountain-pine/90 transition-colors"
          >
            Take the quiz yourself
          </Link>
        </div>
      </div>
    </main>
  );
}
