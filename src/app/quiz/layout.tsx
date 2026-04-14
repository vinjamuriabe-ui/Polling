import Link from "next/link";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-granite-50 flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-granite-200 px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-display font-bold text-granite-800 hover:text-mountain-pine transition-colors"
        >
          NH Voter Match
        </Link>
        <span className="text-xs text-granite-400">Nonpartisan · Free</span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}
