import { describe, it, expect } from "vitest";
import { ProviderService, generateSlug } from "@/features/provider/provider-service";

describe("Provider Portal Logic & Operations", () => {
  describe("generateSlug", () => {
    it("generates URL-safe lowercase slug from business name", () => {
      const slug = generateSlug("Lanka Precision Electricals & Aircon");
      expect(slug).toMatch(/^lanka-precision-electricals-aircon-[a-z0-9]+$/);
      expect(slug).not.toContain(" ");
      expect(slug).not.toContain("&");
    });
  });

  describe("Business Draft Lifecycle", () => {
    it("creates a business in draft status and retrieves it", async () => {
      const ownerId = crypto.randomUUID();
      const business = await ProviderService.createBusiness({
        ownerId,
        name: "Southern Solar Lanka",
        description: "Certified solar PV and energy storage installer serving Galle & Matara.",
        businessType: "sole_proprietor",
        contactEmail: "solar@galle.lk",
        contactPhone: "0779988776",
        whatsappNumber: "0779988776",
        addressLine1: "12 Lighthouse Street, Galle Fort",
      });

      expect(business.id).toBeDefined();
      expect(business.status).toBe("draft");
      expect(business.name).toBe("Southern Solar Lanka");

      const fetched = await ProviderService.getBusinessById(business.id);
      expect(fetched).not.toBeNull();
      expect(fetched?.owner_id).toBe(ownerId);
    });

    it("prevents submitting incomplete business for review", async () => {
      const ownerId = crypto.randomUUID();
      const incomplete = await ProviderService.createBusiness({
        ownerId,
        name: "Incomplete Trader",
        description: "",
        businessType: "individual",
        contactEmail: "",
        contactPhone: "",
      });

      const result = await ProviderService.submitForReview(incomplete.id);
      expect(result.success).toBe(false);
      expect(result.error).toContain("must have a description");
    });

    it("successfully submits completed business for review", async () => {
      const ownerId = crypto.randomUUID();
      const completeBiz = await ProviderService.createBusiness({
        ownerId,
        name: "Kandy Master Plumbing",
        description: "Emergency leak repair, bathroom plumbing and water tank installations.",
        businessType: "registered_company",
        contactEmail: "contact@kandyplumbing.lk",
        contactPhone: "0812345678",
      });

      const result = await ProviderService.submitForReview(completeBiz.id);
      expect(result.success).toBe(true);

      const updated = await ProviderService.getBusinessById(completeBiz.id);
      expect(updated?.status).toBe("pending_review");
    });
  });

  describe("Service Catalogue & Areas Management", () => {
    it("adds and lists services for a business", async () => {
      const ownerId = crypto.randomUUID();
      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Colombo AC Solutions",
        description: "Full service HVAC maintenance.",
        businessType: "sole_proprietor",
        contactEmail: "info@colomboac.lk",
        contactPhone: "0112345678",
      });

      const svc = await ProviderService.addService({
        businessId: biz.id,
        categoryId: "cat-ac",
        title: "AC Deep Chemical Cleaning",
        pricingType: "fixed",
        priceMin: 5500,
        currency: "LKR",
      });

      expect(svc.id).toBeDefined();
      expect(svc.title).toBe("AC Deep Chemical Cleaning");
      expect(svc.price_min).toBe(5500);

      const allServices = await ProviderService.getServices(biz.id);
      expect(allServices.some((s) => s.id === svc.id)).toBe(true);
    });

    it("adds and retrieves coverage districts", async () => {
      const ownerId = crypto.randomUUID();
      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Negombo Rapid Electricians",
        description: "24/7 electrical repairs across Gampaha district.",
        businessType: "individual",
        contactEmail: "negombo@repairs.lk",
        contactPhone: "0312233445",
      });

      const area = await ProviderService.addServiceArea({
        businessId: biz.id,
        districtId: 2, // Gampaha
        radiusKm: 25,
      });

      expect(area.id).toBeDefined();
      expect(area.district_id).toBe(2);

      const allAreas = await ProviderService.getServiceAreas(biz.id);
      expect(allAreas.some((a) => a.district_id === 2)).toBe(true);
    });
  });

  describe("Verification Submissions", () => {
    it("records private verification submissions in pending status", async () => {
      const ownerId = crypto.randomUUID();
      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Certified Electrician",
        description: "Licensed CEB grade A lineman.",
        businessType: "individual",
        contactEmail: "lineman@ceb.lk",
        contactPhone: "0711122334",
      });

      const verification = await ProviderService.addVerification({
        businessId: biz.id,
        submittedBy: ownerId,
        checkType: "qualification_checked",
        privateStoragePath: `verifications/${biz.id}/qualification/cert.pdf`,
      });

      expect(verification.id).toBeDefined();
      expect(verification.status).toBe("pending");
      expect(verification.check_type).toBe("qualification_checked");

      const fetched = await ProviderService.getVerificationById(verification.id);
      expect(fetched?.private_storage_path).toBe(verification.private_storage_path);
    });
  });
});
