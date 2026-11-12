import { NextResponse } from "next/server";
import { z } from "zod";
import { LeadService } from "@/features/leads/lead-service";

const toggleFavouriteSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  businessId: z.string().min(1, "Business ID is required"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || "cust-sample-01";
    const favourites = await LeadService.getFavouritesForCustomer(customerId);
    return NextResponse.json({ favourites });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to list favourites", message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = toggleFavouriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { customerId, businessId } = parsed.data;
    const result = await LeadService.toggleFavourite(customerId, businessId);

    return NextResponse.json({
      success: true,
      favourited: result.favourited,
      message: result.favourited ? "Added to favourites" : "Removed from favourites",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to update favourites", message }, { status: 500 });
  }
}
