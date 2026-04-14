const ISSUES = [
  {
    title: "Property Taxes",
    description:
      "NH has one of the highest property tax burdens in the US, funding schools and services with few other revenue sources.",
    icon: "🏠",
  },
  {
    title: "School Funding",
    description:
      "The Claremont court decision demanded adequate education for all towns — but the debate over how to fund it continues.",
    icon: "🎓",
  },
  {
    title: "Housing Crisis",
    description:
      "NH's housing shortage has driven rents and home prices to record highs across Manchester, Nashua, and the Seacoast.",
    icon: "🏘️",
  },
  {
    title: "Opioid Crisis",
    description:
      "NH ranks among the highest in the nation for per-capita overdose deaths. Treatment access remains a defining issue.",
    icon: "⚕️",
  },
  {
    title: "Abortion Rights",
    description:
      "After the Dobbs decision, NH's 24-week limit is at the center of ongoing legislative battles.",
    icon: "⚖️",
  },
];

export function IssueHighlights() {
  return (
    <section className="bg-granite-50 py-16 px-4">
      <div className="mx-auto max-w-3xl space-y-10">
        <h2 className="text-3xl font-display font-bold text-granite-800 text-center">
          NH&apos;s issues — in plain language
        </h2>
        <div className="space-y-4">
          {ISSUES.map((issue) => (
            <div
              key={issue.title}
              className="flex items-start gap-4 rounded-xl bg-white border border-granite-200 p-5"
            >
              <span className="text-2xl" aria-hidden="true">
                {issue.icon}
              </span>
              <div>
                <h3 className="font-semibold text-granite-800">
                  {issue.title}
                </h3>
                <p className="text-sm text-granite-500 mt-0.5 leading-relaxed">
                  {issue.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
