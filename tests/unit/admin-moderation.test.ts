import { describe, it, expect } from "vitest";
import { AdminService } from "@/features/admin/admin-service";
import { ProviderService } from "@/features/provider/provider-service";

describe("Milestone M5: Admin Moderation, Verification Queue & Audit Logs", () => {
  describe("getPlatformMetrics", () => {
    it("returns comprehensive marketplace platform metrics", async () => {
      const metrics = await AdminService.getPlatformMetrics();

      expect(metrics.totalProviders).toBeGreaterThanOrEqual(1);
      expect(metrics.approvedProviders).toBeGreaterThanOrEqual(1);
      expect(metrics.totalDistrictsCovered).toBe(25);
      expect(metrics.totalCategories).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Provider Review Workflow", () => {
    it("approves a pending provider and generates an audit log record", async () => {
      const ownerId = crypto.randomUUID();
      const reviewerId = crypto.randomUUID();

      // Create provider
      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Matara Solar Tech",
        description: "Certified solar PV engineers serving Southern Province.",
        businessType: "sole_proprietor",
        contactEmail: "info@matarasolar.lk",
        contactPhone: "0412233445",
      });

      // Submit for review
      await ProviderService.submitForReview(biz.id);

      // Admin review: Approve
      const reviewResult = await AdminService.reviewProvider({
        businessId: biz.id,
        decision: "approved",
        reviewerId,
        reason: "Business registration and contact verified.",
      });

      expect(reviewResult.success).toBe(true);
      expect(reviewResult.business?.status).toBe("approved");

      // Verify audit log exists
      const logs = await AdminService.getAdminAuditLogs(10);
      const matchingLog = logs.find((l) => l.target_id === biz.id);
      expect(matchingLog).toBeDefined();
      expect(matchingLog?.action).toBe("review_provider_approved");
    });

    it("requires a reason when rejecting a provider application", async () => {
      const ownerId = crypto.randomUUID();
      const reviewerId = crypto.randomUUID();

      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Dubious Traders",
        description: "Services anywhere in the island.",
        businessType: "individual",
        contactEmail: "test@unknown.lk",
        contactPhone: "0770000000",
      });

      // Reject without reason -> must fail
      const failedReject = await AdminService.reviewProvider({
        businessId: biz.id,
        decision: "rejected",
        reviewerId,
        reason: "",
      });

      expect(failedReject.success).toBe(false);
      expect(failedReject.error).toContain("Rejection requires a constructive explanation");

      // Reject with valid reason -> succeeds
      const validReject = await AdminService.reviewProvider({
        businessId: biz.id,
        decision: "rejected",
        reviewerId,
        reason: "Phone number unreachable after 3 attempts.",
      });

      expect(validReject.success).toBe(true);
      expect(validReject.business?.status).toBe("rejected");
      expect(validReject.business?.rejection_reason).toContain("unreachable");
    });

    it("suspends an active provider on compliance violation", async () => {
      const ownerId = crypto.randomUUID();
      const reviewerId = crypto.randomUUID();

      const biz = await ProviderService.createBusiness({
        ownerId,
        name: "Active Tradeworks",
        description: "Active domestic repair specialist.",
        businessType: "individual",
        contactEmail: "repair@active.lk",
        contactPhone: "0712345678",
      });

      await AdminService.reviewProvider({
        businessId: biz.id,
        decision: "approved",
        reviewerId,
      });

      const suspendResult = await AdminService.reviewProvider({
        businessId: biz.id,
        decision: "suspended",
        reviewerId,
        reason: "Customer complaint under investigation.",
      });

      expect(suspendResult.success).toBe(true);
      expect(suspendResult.business?.status).toBe("suspended");
    });
  });

  describe("Verification Evidence Queue & Badge Issuance", () => {
    it("approves verification submission and records audit trail", async () => {
      const businessId = crypto.randomUUID();
      const reviewerId = crypto.randomUUID();

      const submission = await ProviderService.addVerification({
        businessId,
        submittedBy: "provider-owner-test",
        checkType: "identity_checked",
        privateStoragePath: `verifications/${businessId}/identity/nic_scan.pdf`,
      });

      const result = await AdminService.reviewVerification({
        submissionId: submission.id,
        decision: "approved",
        reviewerId,
        decisionReason: "National identity card verified against government registry format.",
      });

      expect(result.success).toBe(true);
      expect(result.submission?.status).toBe("approved");
      expect(result.submission?.reviewer_id).toBe(reviewerId);
      expect(result.submission?.checked_at).toBeDefined();

      // Check audit log entry
      const logs = await AdminService.getAdminAuditLogs(10);
      const matchingLog = logs.find((l) => l.target_id === submission.id);
      expect(matchingLog).toBeDefined();
      expect(matchingLog?.action).toBe("review_verification_approved");
    });

    it("rejects invalid document submissions with reviewer notes", async () => {
      const businessId = crypto.randomUUID();
      const reviewerId = crypto.randomUUID();

      const submission = await ProviderService.addVerification({
        businessId,
        submittedBy: "provider-owner-test",
        checkType: "business_details_checked",
        privateStoragePath: `verifications/${businessId}/br/blurry_photo.jpg`,
      });

      // Reject without note -> fails
      const emptyNote = await AdminService.reviewVerification({
        submissionId: submission.id,
        decision: "rejected",
        reviewerId,
        decisionReason: "",
      });
      expect(emptyNote.success).toBe(false);

      // Reject with valid explanation -> succeeds
      const validReject = await AdminService.reviewVerification({
        submissionId: submission.id,
        decision: "rejected",
        reviewerId,
        decisionReason: "Image is unreadable. Please provide a high-resolution color PDF of your BR certificate.",
      });

      expect(validReject.success).toBe(true);
      expect(validReject.submission?.status).toBe("rejected");
      expect(validReject.submission?.decision_reason).toContain("unreadable");
    });
  });

  describe("Audit Trail Querying", () => {
    it("records manual administrative events and fetches newest logs", async () => {
      const actorId = crypto.randomUUID();
      const targetId = crypto.randomUUID();

      const recorded = await AdminService.recordAuditLog(
        actorId,
        "moderator_flag_review",
        "review",
        targetId,
        { status: "pending" },
        { status: "flagged" },
        "Review flagged for containing contact numbers in text."
      );

      expect(recorded.id).toBeDefined();
      expect(recorded.action).toBe("moderator_flag_review");

      const logs = await AdminService.getAdminAuditLogs(5);
      expect(logs.some((l) => l.id === recorded.id)).toBe(true);
    });
  });
});
