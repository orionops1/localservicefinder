import { describe, it, expect } from "vitest";
import {
  canTransitionLead,
  LeadService,
} from "@/features/leads/lead-service";

describe("Milestone M4: Lead Lifecycle & Finite State Machine", () => {
  describe("canTransitionLead", () => {
    it("allows valid forward transitions through the service lifecycle", () => {
      expect(canTransitionLead("new", "viewed")).toBe(true);
      expect(canTransitionLead("new", "contacted")).toBe(true);
      expect(canTransitionLead("new", "declined")).toBe(true);
      expect(canTransitionLead("new", "spam")).toBe(true);

      expect(canTransitionLead("viewed", "quoted")).toBe(true);
      expect(canTransitionLead("contacted", "quoted")).toBe(true);
      expect(canTransitionLead("quoted", "accepted")).toBe(true);
      expect(canTransitionLead("accepted", "in_progress")).toBe(true);
      expect(canTransitionLead("in_progress", "completed")).toBe(true);
      expect(canTransitionLead("in_progress", "disputed")).toBe(true);
      expect(canTransitionLead("disputed", "completed")).toBe(true);
    });

    it("rejects illegal transitions that violate business integrity", () => {
      // Cannot jump from new directly to completed
      expect(canTransitionLead("new", "completed")).toBe(false);

      // Cannot reopen completed job
      expect(canTransitionLead("completed", "new")).toBe(false);
      expect(canTransitionLead("completed", "in_progress")).toBe(false);

      // Cannot accept after declining
      expect(canTransitionLead("declined", "accepted")).toBe(false);

      // Cannot complete a cancelled job
      expect(canTransitionLead("cancelled", "completed")).toBe(false);

      // Same state transition is rejected
      expect(canTransitionLead("new", "new")).toBe(false);
      expect(canTransitionLead("in_progress", "in_progress")).toBe(false);
    });
  });

  describe("LeadService Lifecycle Operations", () => {
    it("creates a lead in 'new' status with initial audit trail", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-plumbing",
        message: "Burst pipe in Colombo 07. Need plumber this afternoon.",
        customerNameSnapshot: "Sunil Fernando",
        customerContactSnapshot: "0712345678",
        preferredDate: "2026-11-15",
      });

      expect(lead.id).toBeDefined();
      expect(lead.status).toBe("new");
      expect(lead.customer_name_snapshot).toBe("Sunil Fernando");

      const history = await LeadService.getStatusHistory(lead.id);
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0].to_status).toBe("new");
    });

    it("advances lead through valid lifecycle states and appends audit events", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-roofing",
        message: "Leaking tile roof during monsoon rains.",
        customerNameSnapshot: "Kasun Bandara",
        customerContactSnapshot: "0771234567",
      });

      // 1. Mark Contacted
      const step1 = await LeadService.updateLeadStatus(
        lead.id,
        "contacted",
        "provider-agent-1",
        "Contacted via phone, site visit arranged."
      );
      expect(step1.success).toBe(true);
      expect(step1.lead?.status).toBe("contacted");

      // 2. Submit Quote
      const step2 = await LeadService.updateLeadStatus(
        lead.id,
        "quoted",
        "provider-agent-1",
        "Estimated LKR 45,000 for tile replacement and waterproofing."
      );
      expect(step2.success).toBe(true);
      expect(step2.lead?.status).toBe("quoted");

      // 3. Customer Accepts
      const step3 = await LeadService.updateLeadStatus(
        lead.id,
        "accepted",
        customerId,
        "Quote accepted by customer."
      );
      expect(step3.success).toBe(true);

      // 4. Begin Work
      const step4 = await LeadService.updateLeadStatus(
        lead.id,
        "in_progress",
        "provider-agent-1",
        "Workers on site replacing tiles."
      );
      expect(step4.success).toBe(true);

      // 5. Complete Job
      const step5 = await LeadService.updateLeadStatus(
        lead.id,
        "completed",
        "provider-agent-1",
        "Work completed and verified."
      );
      expect(step5.success).toBe(true);
      expect(step5.lead?.status).toBe("completed");

      // Check full audit trail
      const history = await LeadService.getStatusHistory(lead.id);
      expect(history.length).toBe(6); // 1 initial + 5 transitions
      expect(history[history.length - 1].to_status).toBe("completed");
    });

    it("rejects invalid state transition attempts", async () => {
      const customerId = crypto.randomUUID();
      const businessId = crypto.randomUUID();

      const lead = await LeadService.createLead({
        customerId,
        businessId,
        categoryId: "cat-gardening",
        message: "Lawn mowing and tree pruning required.",
        customerNameSnapshot: "Devinda Silva",
        customerContactSnapshot: "0755556666",
      });

      // Attempt invalid transition: directly from 'new' to 'completed'
      const invalid = await LeadService.updateLeadStatus(
        lead.id,
        "completed",
        "provider-agent-1"
      );
      expect(invalid.success).toBe(false);
      expect(invalid.error).toContain("Cannot transition lead");

      // Status must remain unchanged
      const current = await LeadService.getLeadById(lead.id);
      expect(current?.status).toBe("new");
    });
  });

  describe("Customer Favourites Management", () => {
    it("toggles favourite status idempotently", async () => {
      const customerId = "test-customer-fav";
      const businessId = "biz-sample-01";

      // 1. Initially toggle -> should be favourited
      const res1 = await LeadService.toggleFavourite(customerId, businessId);
      expect(res1.favourited).toBe(true);

      const check1 = await LeadService.isFavourited(customerId, businessId);
      expect(check1).toBe(true);

      // 2. Second toggle -> should be unfavourited
      const res2 = await LeadService.toggleFavourite(customerId, businessId);
      expect(res2.favourited).toBe(false);

      const check2 = await LeadService.isFavourited(customerId, businessId);
      expect(check2).toBe(false);
    });
  });
});
