const STEPS = [
  {
    number: "1",
    title: "Tell us where you vote",
    description:
      "Select your NH county and town. We automatically identify your state House and Senate districts.",
  },
  {
    number: "2",
    title: "Answer 10 quick questions",
    description:
      "Share your views on NH issues like property taxes, housing, healthcare, and more. Every question has a plain-language explainer.",
  },
  {
    number: "3",
    title: "See your personalized matches",
    description:
      "Get alignment scores for your specific candidates — from Governor to your local state rep — and learn which primary to vote in if you're undeclared.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="mx-auto max-w-3xl text-center space-y-12">
        <h2 className="text-3xl font-display font-bold text-granite-800">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="space-y-3 text-left sm:text-center">
              <div className="mx-auto sm:mx-auto w-12 h-12 rounded-full bg-mountain-pine text-white flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold text-granite-800">{step.title}</h3>
              <p className="text-sm text-granite-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
