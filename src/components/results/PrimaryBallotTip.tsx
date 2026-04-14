interface PrimaryBallotTipProps {
  recommendation: "D" | "R" | null;
}

const PARTY_LABELS = { D: "Democratic", R: "Republican" };

export function PrimaryBallotTip({ recommendation }: PrimaryBallotTipProps) {
  return (
    <div className="rounded-2xl border border-mountain-amber/40 bg-mountain-birch p-6 space-y-3">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-mountain-amber"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="font-semibold text-granite-800">
          NH Primary Tip for Undeclared Voters
        </h3>
      </div>

      {recommendation ? (
        <p className="text-sm text-granite-700 leading-relaxed">
          Based on your results, your views align more closely with candidates
          in the{" "}
          <strong>{PARTY_LABELS[recommendation]} primary</strong>. As an
          undeclared voter in NH, you can request either party&apos;s primary
          ballot on Election Day — and then re-register as undeclared afterward
          if you choose.
        </p>
      ) : (
        <p className="text-sm text-granite-700 leading-relaxed">
          Your views are closely split between both party primaries. As an
          undeclared voter in NH, you can choose either party&apos;s primary
          ballot on Election Day. Review the candidate profiles above to decide
          which races matter most to you.
        </p>
      )}

      <p className="text-xs text-granite-500">
        NH&apos;s undeclared voters may choose either party&apos;s primary
        ballot and can re-register as undeclared after voting.
      </p>
    </div>
  );
}
