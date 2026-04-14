import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { IssueHighlights } from "@/components/landing/IssueHighlights";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <IssueHighlights />

      {/* Footer CTA */}
      <section className="bg-granite-800 py-16 px-4 text-center text-white space-y-6">
        <h2 className="text-3xl font-display font-bold">
          Ready to find your match?
        </h2>
        <p className="text-granite-300 max-w-md mx-auto">
          It takes less than 5 minutes. No registration. Completely nonpartisan.
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center rounded-lg bg-mountain-amber text-granite-900 font-bold h-14 px-10 text-lg hover:bg-mountain-amber/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-amber focus-visible:ring-offset-2"
        >
          Take the NH Voter Quiz
        </Link>
        <p className="text-xs text-granite-500 mt-4">
          Live Free or Die — vote your values.
        </p>
      </section>
    </main>
  );
}
