import { NextResponse } from "next/server";
import { ProviderService } from "@/features/provider/provider-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await ProviderService.submitForReview(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updated = await ProviderService.getBusinessById(id);
    return NextResponse.json({
      success: true,
      message: "Application submitted for review successfully.",
      business: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to submit business for review", message },
      { status: 500 }
    );
  }
}
