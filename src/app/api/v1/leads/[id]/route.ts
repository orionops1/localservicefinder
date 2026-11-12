import { NextResponse } from "next/server";
import { z } from "zod";
import { LeadService } from "@/features/leads/lead-service";
import { LeadStatus } from "@/types/database";

const updateStatusSchema = z.object({
  status: z.enum([
    "new",
    "viewed",
    "contacted",
    "quoted",
    "accepted",
    "in_progress",
    "completed",
    "declined",
    "cancelled",
    "disputed",
    "spam",
  ]),
  changedBy: z.string().optional(),
  note: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await LeadService.getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const history = await LeadService.getStatusHistory(id);

    return NextResponse.json({
      lead,
      history,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to fetch lead", message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { status, changedBy = "system", note } = parsed.data;

    const result = await LeadService.updateLeadStatus(
      id,
      status as LeadStatus,
      changedBy,
      note
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const history = await LeadService.getStatusHistory(id);

    return NextResponse.json({
      success: true,
      lead: result.lead,
      history,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to update lead", message }, { status: 500 });
  }
}
