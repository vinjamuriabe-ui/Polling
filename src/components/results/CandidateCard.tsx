import { AlignmentBar } from "./AlignmentBar";
import type { MatchResult, QuestionCategory } from "@/types/quiz";
import type { Candidate } from "@/types/candidate";

const OFFICE_LABELS: Record<string, string> = {
  us_senate: "U.S. Senate",
  us_house: "U.S. House",
  governor: "Governor",
  nh_senate: "NH State Senate",
  nh_house: "NH State House",
};

const CATEGORY_LABELS: Partial<Record<QuestionCategory, string>> = {
  school_funding: "School Funding",
  property_taxes: "Property Taxes",
  housing: "Housing",
  abortion: "Abortion Rights",
  opioid_crisis: "Opioid Crisis",
  energy: "Energy",
  gun_policy: "Gun Policy",
  budget: "Budget & Taxes",
  healthcare: "Healthcare",
  nh_identity: "NH Primary",
};

interface CandidateCardProps {
  result: MatchResult;
  candidate: Candidate;
  rank: number;
}

export function CandidateCard({ result, candidate, rank }: CandidateCardProps) {
  const officeLabel = OFFICE_LABELS[candidate.office] ?? candidate.office;
  const districtLabel =
    candidate.district !== null
      ? ` — District ${candidate.district}`
      : "";

  return (
    <div className="rounded-2xl border border-granite-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-granite-100 text-granite-700 font-bold text-sm">
          #{rank}
        </div>

        {/* Name + office */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-granite-800">
            {candidate.name}
          </h3>
          <p className="text-sm text-granite-500">
            {officeLabel}{districtLabel}
          </p>
        </div>

        {/* Overall score */}
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-mountain-pine">
            {result.alignmentScore}%
          </p>
          <p className="text-xs text-granite-500">match</p>
        </div>
      </div>

      {/* Alignment bar */}
      <AlignmentBar score={result.alignmentScore} size="md" />

      {/* Top aligned issues */}
      {result.topAlignedIssues.length > 0 && (
        <div>
          <p className="text-xs font-medium text-granite-500 mb-2">
            Strongest agreement on:
          </p>
          <div className="flex flex-wrap gap-2">
            {result.topAlignedIssues.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-mountain-sky px-3 py-1 text-xs font-medium text-mountain-blue"
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio snippet */}
      {candidate.bio && (
        <p className="text-sm text-granite-600 line-clamp-2">{candidate.bio}</p>
      )}

      {/* Links */}
      {candidate.website && (
        <a
          href={candidate.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-mountain-blue hover:underline font-medium"
        >
          Visit campaign website →
        </a>
      )}
    </div>
  );
}
