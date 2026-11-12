import { describe, it, expect } from "vitest";
import { ReviewService } from "@/features/reviews/review-service";
import { LeadService } from "@/features/leads/lead-service";
import { NotificationService } from "@/features/notifications/notification-service";

describe("Milestone M6: Verified Reviews Eligibility & Notifications", () => {
  describe("Review Eligibility Engine", () => {
    it("allows review submission strictly for completed leads by the actual customer", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      // 1. Create lead
      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-plumbing",
        message: "Fixed water pump pressure switch.",
        customerNameSnapshot: "Gamini Jayasuriya",
        customerContactSnapshot: "0771234567",
      });

      // 2. Advance through valid states to 'completed'
      await LeadService.updateLeadStatus(lead.id, "contacted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "quoted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "accepted", customerId);
      await LeadService.updateLeadStatus(lead.id, "in_progress", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "completed", "provider-1");

      // Check eligibility
      const check = await ReviewService.canSubmitReview(lead.id, customerId);
      expect(check.eligible).toBe(true);

      // Submit review
      const res = await ReviewService.createReview({
        leadId: lead.id,
        businessId,
        customerId,
        rating: 5,
        qualityRating: 5,
        punctualityRating: 4,
        communicationRating: 5,
        comment: "Excellent pump repair and arrived within 45 minutes of booking.",
        customerName: "Gamini Jayasuriya",
      });

      expect(res.success).toBe(true);
      expect(res.review?.rating).toBe(5);
      expect(res.review?.status).toBe("published");
    });

    it("rejects reviews for jobs that are still in progress or quoted", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-ac",
        message: "AC gas refill required.",
        customerNameSnapshot: "Dilshan Silva",
        customerContactSnapshot: "0712345678",
      });

      await LeadService.updateLeadStatus(lead.id, "contacted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "quoted", "provider-1");

      // Attempt review while status is 'quoted'
      const check = await ReviewService.canSubmitReview(lead.id, customerId);
      expect(check.eligible).toBe(false);
      expect(check.error).toContain("Reviews are permitted strictly for completed jobs");

      const attempt = await ReviewService.createReview({
        leadId: lead.id,
        businessId,
        customerId,
        rating: 5,
        comment: "Premature review attempt",
      });
      expect(attempt.success).toBe(false);
    });

    it("prevents third parties from submitting reviews for someone else's lead", async () => {
      const customerId = crypto.randomUUID();
      const imposterId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-electrical",
        message: "Electrical checkup.",
        customerNameSnapshot: "Valid Customer",
        customerContactSnapshot: "0771122334",
      });

      await LeadService.updateLeadStatus(lead.id, "contacted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "quoted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "accepted", customerId);
      await LeadService.updateLeadStatus(lead.id, "in_progress", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "completed", "provider-1");

      // Imposter tries to review
      const check = await ReviewService.canSubmitReview(lead.id, imposterId);
      expect(check.eligible).toBe(false);
      expect(check.error).toContain("not authorized to submit a review");
    });

    it("enforces single review per completed lead (UNIQUE lead_id)", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-carpentry",
        message: "Door hinge repair.",
        customerNameSnapshot: "Ruwan Perera",
        customerContactSnapshot: "0755554444",
      });

      await LeadService.updateLeadStatus(lead.id, "contacted", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "accepted", customerId);
      await LeadService.updateLeadStatus(lead.id, "in_progress", "provider-1");
      await LeadService.updateLeadStatus(lead.id, "completed", "provider-1");

      // First review succeeds
      const firstReview = await ReviewService.createReview({
        leadId: lead.id,
        businessId,
        customerId,
        rating: 4,
        comment: "Good woodwork repair.",
      });
      expect(firstReview.success).toBe(true);

      // Second review for same lead must fail
      const secondReview = await ReviewService.createReview({
        leadId: lead.id,
        businessId,
        customerId,
        rating: 1,
        comment: "Trying to overwrite or duplicate review.",
      });
      expect(secondReview.success).toBe(false);
      expect(secondReview.error).toContain("already been submitted");
    });
  });

  describe("Rating Aggregation", () => {
    it("computes accurate average star rating from verified published reviews", async () => {
      const businessId = "biz-sample-01";
      const summary = await ReviewService.calculateProviderRating(businessId);

      expect(summary.totalReviews).toBeGreaterThanOrEqual(1);
      expect(summary.averageRating).toBeGreaterThanOrEqual(1);
      expect(summary.averageRating).toBeLessThanOrEqual(5);
    });
  });

  describe("Review Moderation", () => {
    it("allows administrators to flag or reject reviews violating guidelines", async () => {
      const moderatorId = crypto.randomUUID();

      const result = await ReviewService.moderateReview(
        "rev-sample-01",
        "flagged",
        moderatorId,
        "Review flagged for moderation check."
      );

      expect(result.success).toBe(true);
      expect(result.review?.status).toBe("flagged");

      // Restore to published
      const restore = await ReviewService.moderateReview(
        "rev-sample-01",
        "published",
        moderatorId,
        "Cleared after moderation."
      );
      expect(restore.success).toBe(true);
      expect(restore.review?.status).toBe("published");
    });
  });

  describe("Notification Subsystem", () => {
    it("formats and dispatches lead notifications gracefully", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-home",
        message: "Water heater installation.",
        customerNameSnapshot: "Kamal Gunaratne",
        customerContactSnapshot: "0779988776",
      });

      // Notification calls should complete without throwing
      await expect(NotificationService.notifyLeadReceived(lead)).resolves.not.toThrow();
      await expect(
        NotificationService.notifyStatusTransition(lead, "new", "contacted")
      ).resolves.not.toThrow();
      await expect(
        NotificationService.notifyVerificationResult("0779988776", "identity_checked", "approved")
      ).resolves.not.toThrow();
    });
  });
});
