import { NextResponse } from "next/server";
import { z } from "zod";
import { ReviewService } from "@/features/reviews/review-service";

const createReviewSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  businessId: z.string().min(1, "Business ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5 stars"),
  qualityRating: z.number().int().min(1).max(5).optional(),
  punctualityRating: z.number().int().min(1).max(5).optional(),
  communicationRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5, "Review comment must be at least 5 characters").max(2000),
  customerName: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId parameter is required" },
        { status: 400 }
      );
    }

    const reviews = await ReviewService.getReviewsForBusiness(businessId, true);
    const summary = await ReviewService.calculateProviderRating(businessId);

    return NextResponse.json({
      reviews,
      summary,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to fetch reviews", message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await ReviewService.createReview(parsed.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verified review published successfully.",
        review: result.review,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to submit review", message }, { status: 500 });
  }
}
