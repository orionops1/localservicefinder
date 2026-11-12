import { NextResponse } from "next/server";
import { z } from "zod";
import { AdminService } from "@/features/admin/admin-service";

const reviewSchema = z.object({
  decision: z.enum(["approved", "rejected", "suspended"]),
  reason: z.string().optional(),
  reviewerId: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { decision, reason, reviewerId = "admin-staff-01" } = parsed.data;

    const result = await AdminService.reviewProvider({
      businessId: id,
      decision,
      reviewerId,
      reason,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Provider status successfully updated to ${decision}.`,
      business: result.business,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to review provider", message }, { status: 500 });
  }
}
