import { NextResponse } from "next/server";
import { z } from "zod";
import { ProviderService } from "@/features/provider/provider-service";

const createBusinessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  businessType: z.enum(["individual", "sole_proprietor", "registered_company"]),
  registrationNumber: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(9, "Valid Sri Lankan phone number required"),
  whatsappNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  districtId: z.number().int().positive().optional(),
  localityId: z.string().uuid().optional(),
  primaryCategoryId: z.string().optional(),
  initialServiceTitle: z.string().optional(),
  pricingType: z.enum(["fixed", "starting_at", "hourly", "quote"]).default("starting_at"),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  serviceAreaDistrictIds: z.array(z.number().int().positive()).optional(),
  ownerId: z.string().uuid().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId") || "00000000-0000-0000-0000-000000000001";
  const businessId = searchParams.get("id");

  if (businessId) {
    const business = await ProviderService.getBusinessById(businessId);
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
    const services = await ProviderService.getServices(business.id);
    const serviceAreas = await ProviderService.getServiceAreas(business.id);
    const media = await ProviderService.getMedia(business.id);
    const verifications = await ProviderService.getVerifications(business.id);

    return NextResponse.json({
      business,
      services,
      serviceAreas,
      media,
      verifications,
    });
  }

  const business = await ProviderService.getBusinessByOwner(ownerId);
  return NextResponse.json({ business });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createBusinessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const ownerId = data.ownerId || crypto.randomUUID();

    const business = await ProviderService.createBusiness({
      ownerId,
      name: data.name,
      description: data.description,
      businessType: data.businessType,
      registrationNumber: data.registrationNumber,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      whatsappNumber: data.whatsappNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      localityId: data.localityId,
    });

    // Add initial service if provided
    if (data.initialServiceTitle && data.primaryCategoryId) {
      await ProviderService.addService({
        businessId: business.id,
        categoryId: data.primaryCategoryId,
        title: data.initialServiceTitle,
        pricingType: data.pricingType,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        currency: "LKR",
      });
    }

    // Add coverage districts if provided
    if (data.serviceAreaDistrictIds && data.serviceAreaDistrictIds.length > 0) {
      for (const distId of data.serviceAreaDistrictIds) {
        await ProviderService.addServiceArea({
          businessId: business.id,
          districtId: distId,
        });
      }
    }

    return NextResponse.json({
      success: true,
      business,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to create business", message },
      { status: 500 }
    );
  }
}
