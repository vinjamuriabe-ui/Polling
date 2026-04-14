import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const AnalyticsEventSchema = z.object({
  sessionId: z.string().optional(),
  eventType: z.string().min(1).max(100),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = AnalyticsEventSchema.parse(body);

    await prisma.analyticsEvent.create({
      data: {
        sessionId: data.sessionId,
        eventType: data.eventType,
        payload: (data.payload ?? {}) as Record<string, string>,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }
    // Fire-and-forget: don't surface DB errors to client
    return NextResponse.json({ ok: true });
  }
}
