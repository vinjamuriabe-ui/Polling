import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const CreateSessionSchema = z.object({
  county: z.string().min(1),
  town: z.string().min(1),
  senateDist: z.number().int().positive(),
  houseDist: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.number().int().min(1).max(5),
      answeredAt: z.number(),
    })
  ),
  results: z
    .array(
      z.object({
        candidateId: z.string(),
        alignmentScore: z.number(),
        categoryScores: z.record(z.number()),
        topAlignedIssues: z.array(z.string()),
        topDivergentIssues: z.array(z.string()),
      })
    )
    .optional(),
  straightLineDetected: z.boolean().optional(),
  nudgeShown: z.boolean().optional(),
  retakeChosen: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = CreateSessionSchema.parse(body);

    const session = await prisma.quizSession.create({
      data: {
        county: data.county,
        town: data.town,
        senateDist: data.senateDist,
        houseDist: data.houseDist,
        answers: data.answers,
        results: data.results ? JSON.parse(JSON.stringify(data.results)) : undefined,
        straightLineDetected: data.straightLineDetected ?? false,
        nudgeShown: data.nudgeShown ?? false,
        retakeChosen: data.retakeChosen ?? false,
        completedAt: new Date(),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    return NextResponse.json({
      sessionId: session.id,
      shareUrl: `${baseUrl}/results/${session.id}`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/sessions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
