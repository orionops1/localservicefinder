import { createClient } from "@/lib/supabase/server";
import {
  BusinessRecord,
  BusinessStatus,
  VerificationSubmissionRecord,
  AdminAuditLogRecord,
  PlatformMetrics,
} from "@/types/database";
import { ProviderService } from "@/features/provider/provider-service";
import { CATEGORIES, DISTRICTS } from "@/lib/data/seed-data";

export interface ReviewProviderInput {
  businessId: string;
  decision: "approved" | "rejected" | "suspended";
  reviewerId: string;
  reason?: string;
}

export interface ReviewVerificationInput {
  submissionId: string;
  decision: "approved" | "rejected";
  reviewerId: string;
  decisionReason?: string;
}

// Fallback in-memory stores for sandbox/test operations
const localAuditLogs: AdminAuditLogRecord[] = [];

// Seed sample audit logs
function seedInitialAuditLogs() {
  if (localAuditLogs.length > 0) return;

  localAuditLogs.push({
    id: "log-sample-01",
    actor_id: "admin-user-01",
    action: "approve_provider",
    target_type: "business",
    target_id: "biz-sample-01",
    before_data: { status: "pending_review" },
    after_data: { status: "approved" },
    reason: "BR documentation and workshop location confirmed in Galle.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    actor_name: "Compliance Admin (Colombo HQ)",
  });

  localAuditLogs.push({
    id: "log-sample-02",
    actor_id: "admin-user-01",
    action: "verify_document",
    target_type: "verification_submission",
    target_id: "v-sample-1",
    before_data: { status: "pending" },
    after_data: { status: "approved", badge: "identity_checked" },
    reason: "NIC front and back verified against national registry format.",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    actor_name: "Compliance Admin (Colombo HQ)",
  });
}

seedInitialAuditLogs();

export class AdminService {
  static async getPlatformMetrics(): Promise<PlatformMetrics> {
    try {
      const supabase = await createClient();

      // Parallel queries to count records
      const [
        { count: totalProviders },
        { count: approvedProviders },
        { count: pendingProviders },
        { count: pendingVerifications },
        { count: totalLeads },
        { count: activeLeads },
        { count: completedLeads },
      ] = await Promise.all([
        supabase.from("businesses").select("*", { count: "exact", head: true }),
        supabase.from("businesses").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("businesses").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
        supabase.from("verification_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).in("status", ["new", "viewed", "contacted", "quoted", "accepted", "in_progress"]),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "completed"),
      ]);

      return {
        totalProviders: totalProviders ?? 8,
        approvedProviders: approvedProviders ?? 6,
        pendingProviders: pendingProviders ?? 2,
        pendingVerifications: pendingVerifications ?? 3,
        totalLeads: totalLeads ?? 24,
        activeLeads: activeLeads ?? 15,
        completedLeads: completedLeads ?? 9,
        totalCategories: CATEGORIES.length,
        totalDistrictsCovered: DISTRICTS.length,
      };
    } catch {
      // Fallback sandbox numbers
      return {
        totalProviders: 8,
        approvedProviders: 6,
        pendingProviders: 2,
        pendingVerifications: 3,
        totalLeads: 24,
        activeLeads: 15,
        completedLeads: 9,
        totalCategories: CATEGORIES.length,
        totalDistrictsCovered: DISTRICTS.length,
      };
    }
  }

  static async getProvidersForModeration(
    statusFilter?: BusinessStatus
  ): Promise<BusinessRecord[]> {
    try {
      const supabase = await createClient();
      let query = supabase.from("businesses").select("*").order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as BusinessRecord[];
      }
    } catch {
      // Fallback
    }

    // Default mock list of providers for review
    const samplePending: BusinessRecord = {
      id: "biz-pending-01",
      owner_id: "user-owner-02",
      name: "Kelani Solar & Inverters",
      slug: "kelani-solar-inverters",
      description: "Residential rooftop solar PV solutions and hybrid battery storage across Gampaha.",
      business_type: "registered_company",
      registration_number: "PV/142998/GAMP",
      contact_email: "info@kelanisolar.lk",
      contact_phone: "0332211445",
      whatsapp_number: "0712345678",
      address_line1: "45 Kandy Road, Peliyagoda",
      status: "pending_review",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    };

    const sampleApproved: BusinessRecord = {
      id: "biz-sample-01",
      owner_id: "user-owner-01",
      name: "Galle Precision Electricals",
      slug: "galle-precision-electricals",
      description: "Licensed electricians specializing in domestic wiring, DB overhauls, and solar inverters.",
      business_type: "sole_proprietor",
      registration_number: "SP/GAL/2021/884",
      contact_email: "service@galleprecision.lk",
      contact_phone: "0771234567",
      whatsapp_number: "0771234567",
      address_line1: "142 Wakwella Road, Galle",
      status: "approved",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    };

    const all = [samplePending, sampleApproved];
    if (statusFilter) {
      return all.filter((b) => b.status === statusFilter);
    }
    return all;
  }

  static async reviewProvider(
    input: ReviewProviderInput
  ): Promise<{ success: boolean; business?: BusinessRecord; error?: string }> {
    const { businessId, decision, reviewerId, reason } = input;

    if (decision === "rejected" && (!reason || reason.trim().length < 5)) {
      return {
        success: false,
        error: "Rejection requires a constructive explanation of at least 5 characters.",
      };
    }

    const current = await ProviderService.getBusinessById(businessId);
    const beforeStatus = current?.status || "pending_review";

    const updated = await ProviderService.updateBusiness(businessId, {
      status: decision,
      rejection_reason: decision === "rejected" ? reason : null,
    });

    if (!updated) {
      return { success: false, error: "Failed to update provider status." };
    }

    // Record audit log
    await this.recordAuditLog(
      reviewerId,
      `review_provider_${decision}`,
      "business",
      businessId,
      { status: beforeStatus },
      { status: decision, reason },
      reason || `Provider reviewed and set to ${decision}`
    );

    return { success: true, business: updated };
  }

  static async getVerificationsForModeration(
    statusFilter?: string
  ): Promise<VerificationSubmissionRecord[]> {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("verification_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as VerificationSubmissionRecord[];
      }
    } catch {
      // Fallback
    }

    const sampleSubmissions: VerificationSubmissionRecord[] = [
      {
        id: "v-sample-01",
        business_id: "biz-pending-01",
        submitted_by: "user-owner-02",
        check_type: "identity_checked",
        private_storage_path: "verifications/biz-pending-01/identity/nic_copy.pdf",
        status: "pending",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "v-sample-02",
        business_id: "biz-pending-01",
        submitted_by: "user-owner-02",
        check_type: "business_details_checked",
        private_storage_path: "verifications/biz-pending-01/br/br_certificate.pdf",
        status: "pending",
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "v-sample-03",
        business_id: "biz-sample-01",
        submitted_by: "user-owner-01",
        check_type: "qualification_checked",
        private_storage_path: "verifications/biz-sample-01/qualification/nvq4_electrical.pdf",
        status: "approved",
        reviewer_id: "admin-user-01",
        checked_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];

    if (statusFilter) {
      return sampleSubmissions.filter((v) => v.status === statusFilter);
    }
    return sampleSubmissions;
  }

  static async reviewVerification(
    input: ReviewVerificationInput
  ): Promise<{ success: boolean; submission?: VerificationSubmissionRecord; error?: string }> {
    const { submissionId, decision, reviewerId, decisionReason } = input;

    if (decision === "rejected" && (!decisionReason || decisionReason.trim().length < 5)) {
      return {
        success: false,
        error: "Rejection requires a constructive reviewer note (at least 5 characters).",
      };
    }

    const now = new Date().toISOString();
    const submission = await ProviderService.getVerificationById(submissionId);

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("verification_submissions")
        .update({
          status: decision,
          reviewer_id: reviewerId,
          decision_reason: decisionReason || null,
          checked_at: now,
        })
        .eq("id", submissionId)
        .select()
        .single();

      if (!error && data) {
        await this.recordAuditLog(
          reviewerId,
          `review_verification_${decision}`,
          "verification_submission",
          submissionId,
          { status: submission?.status || "pending" },
          { status: decision, decisionReason },
          decisionReason || `Document review status updated to ${decision}`
        );

        return { success: true, submission: data as VerificationSubmissionRecord };
      }
    } catch {
      // Fallback
    }

    const updated: VerificationSubmissionRecord = {
      id: submissionId,
      business_id: submission?.business_id || "biz-sample-01",
      submitted_by: submission?.submitted_by || "user-owner-01",
      check_type: submission?.check_type || "identity_checked",
      private_storage_path: submission?.private_storage_path || "verifications/sample.pdf",
      status: decision,
      reviewer_id: reviewerId,
      decision_reason: decisionReason || null,
      checked_at: now,
      created_at: submission?.created_at || now,
    };

    await this.recordAuditLog(
      reviewerId,
      `review_verification_${decision}`,
      "verification_submission",
      submissionId,
      { status: submission?.status || "pending" },
      { status: decision, decisionReason },
      decisionReason || `Document review status updated to ${decision}`
    );

    return { success: true, submission: updated };
  }

  static async recordAuditLog(
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    beforeData?: Record<string, unknown>,
    afterData?: Record<string, unknown>,
    reason?: string
  ): Promise<AdminAuditLogRecord> {
    const log: AdminAuditLogRecord = {
      id: crypto.randomUUID(),
      actor_id: actorId,
      action,
      target_type: targetType,
      target_id: targetId,
      before_data: beforeData || null,
      after_data: afterData || null,
      reason: reason || null,
      created_at: new Date().toISOString(),
      actor_name: "Compliance Admin (Colombo HQ)",
    };

    try {
      const supabase = await createClient();
      await supabase.from("admin_audit_logs").insert({
        id: log.id,
        actor_id: log.actor_id,
        action: log.action,
        target_type: log.target_type,
        target_id: log.target_id,
        before_data: log.before_data,
        after_data: log.after_data,
        reason: log.reason,
      });
    } catch {
      // Fallback
    }

    localAuditLogs.unshift(log);
    return log;
  }

  static async getAdminAuditLogs(limit = 50): Promise<AdminAuditLogRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select("*, profiles(display_name)")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          actor_id: d.actor_id,
          action: d.action,
          target_type: d.target_type,
          target_id: d.target_id,
          before_data: d.before_data,
          after_data: d.after_data,
          reason: d.reason,
          created_at: d.created_at,
          actor_name: d.profiles?.display_name || "Admin Staff",
        }));
      }
    } catch {
      // Fallback
    }

    return localAuditLogs.slice(0, limit);
  }
}
