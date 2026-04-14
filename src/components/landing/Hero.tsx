import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-granite-800 to-granite-700 text-white py-20 px-4 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl text-center space-y-8">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm">
          <span className="text-mountain-amber">★</span>
          <span>New Hampshire&apos;s First-in-the-Nation voter quiz</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
          Find the candidates who truly represent{" "}
          <em className="not-italic text-mountain-amber">your</em> values
        </h1>

        <p className="text-lg text-granite-200 leading-relaxed max-w-xl mx-auto">
          Answer 10 questions on New Hampshire&apos;s real issues — property
          taxes, housing, healthcare, and more. See which candidates align with
          your views, from Governor to your local state rep.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/quiz">
            <Button variant="primary" size="lg" className="bg-mountain-amber text-granite-900 hover:bg-mountain-amber/90 font-bold px-10">
              Start the quiz — it&apos;s free
            </Button>
          </Link>
        </div>

        <p className="text-sm text-granite-400">
          Nonpartisan · No registration required · Under 5 minutes
        </p>
      </div>
    </section>
  );
}
