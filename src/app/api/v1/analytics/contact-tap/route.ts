import { NextResponse } from "next/server";
import { z } from "zod";

const contactTapSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  channel: z.enum(["phone", "whatsapp"]),
  source: z.string().default("profile_page"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactTapSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { businessId, channel, source } = parsed.data;

    // Log minimal anonymous engagement event
    // Never store customer IP or device fingerprint as PII
    return NextResponse.json({
      success: true,
      tracked: {
        businessId,
        channel,
        source,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to record contact action", message }, { status: 500 });
  }
}
