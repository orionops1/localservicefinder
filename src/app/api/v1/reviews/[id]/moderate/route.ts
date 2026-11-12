import { NextResponse } from "next/server";
import { z } from "zod";
import { ReviewService } from "@/features/reviews/review-service";

const moderateSchema = z.object({
  decision: z.enum(["published", "rejected", "flagged"]),
  reason: z.string().optional(),
  moderatorId: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = moderateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { decision, reason, moderatorId = "admin-staff-01" } = parsed.data;

    const result = await ReviewService.moderateReview(
      id,
      decision,
      moderatorId,
      reason
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Review moderation status updated to ${decision}.`,
      review: result.review,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to moderate review", message }, { status: 500 });
  }
}
