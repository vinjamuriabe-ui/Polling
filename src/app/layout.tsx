import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NH Voter Match — Find Your Candidates",
  description:
    "New Hampshire's nonpartisan voter quiz. Answer 10 questions on NH issues and see which candidates truly align with your values.",
  openGraph: {
    title: "NH Voter Match",
    description: "Find the NH candidates who represent your views.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
