import { NextResponse } from "next/server";
import { z } from "zod";
import { LeadService } from "@/features/leads/lead-service";

const createLeadSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  businessId: z.string().min(1, "Business ID is required"),
  providerServiceId: z.string().optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  message: z.string().min(10, "Message must be at least 10 characters describing the job"),
  customerNameSnapshot: z.string().min(2, "Your name is required"),
  customerContactSnapshot: z.string().min(9, "Valid phone number or email is required"),
  locationId: z.string().optional(),
  preferredDate: z.string().optional(),
  source: z.string().default("platform_enquiry"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const customerId = searchParams.get("customerId");
    const businessId = searchParams.get("businessId");

    if (role === "customer" || customerId) {
      const targetCustomer = customerId || "cust-sample-01";
      const leads = await LeadService.getLeadsForCustomer(targetCustomer);
      return NextResponse.json({ leads });
    }

    if (role === "provider" || businessId) {
      const targetBusiness = businessId || "biz-sample-01";
      const leads = await LeadService.getLeadsForBusiness(targetBusiness);
      return NextResponse.json({ leads });
    }

    // Default: return customer leads
    const leads = await LeadService.getLeadsForCustomer("cust-sample-01");
    return NextResponse.json({ leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to list leads", message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const lead = await LeadService.createLead(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry sent to service provider successfully.",
        lead,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to submit enquiry", message }, { status: 500 });
  }
}
