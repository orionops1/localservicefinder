import { createClient } from "@/lib/supabase/server";
import { ReviewRecord, ReviewStatus } from "@/types/database";
import { LeadService } from "@/features/leads/lead-service";
import { AdminService } from "@/features/admin/admin-service";

export interface CreateReviewInput {
  leadId: string;
  businessId: string;
  customerId: string;
  rating: number;
  qualityRating?: number;
  punctualityRating?: number;
  communicationRating?: number;
  comment?: string;
  customerName?: string;
}

// Fallback in-memory stores for sandbox/test operations
const localReviews = new Map<string, ReviewRecord>();

// Seed sample published reviews
function seedInitialReviews() {
  if (localReviews.size > 0) return;

  const sampleReview1: ReviewRecord = {
    id: "rev-sample-01",
    lead_id: "lead-completed-01",
    business_id: "biz-sample-01",
    customer_id: "cust-sample-01",
    rating: 5,
    quality_rating: 5,
    punctuality_rating: 5,
    communication_rating: 5,
    comment: "Excellent domestic wiring repair in Galle Fort. Found the short circuit quickly and replaced the damaged MCB within 2 hours. Very polite and fair pricing.",
    status: "published",
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    customer_name: "Rohan Dissanayake",
    business_name: "Galle Precision Electricals",
  };

  const sampleReview2: ReviewRecord = {
    id: "rev-sample-02",
    lead_id: "lead-completed-02",
    business_id: "biz-sample-01",
    customer_id: "cust-sample-02",
    rating: 4,
    quality_rating: 5,
    punctuality_rating: 4,
    communication_rating: 4,
    comment: "Setup our 5kVA hybrid solar backup system. Clean cabling and good explanation of battery cycles.",
    status: "published",
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    customer_name: "Anusha Weerasinghe",
    business_name: "Galle Precision Electricals",
  };

  localReviews.set(sampleReview1.id, sampleReview1);
  localReviews.set(sampleReview2.id, sampleReview2);
}

seedInitialReviews();

export class ReviewService {
  static async canSubmitReview(
    leadId: string,
    customerId: string
  ): Promise<{ eligible: boolean; error?: string }> {
    // 1. Fetch lead
    const lead = await LeadService.getLeadById(leadId);
    if (!lead) {
      return { eligible: false, error: "Referenced service enquiry lead does not exist." };
    }

    // 2. Validate customer ownership
    if (lead.customer_id !== customerId) {
      return {
        eligible: false,
        error: "You are not authorized to submit a review for an enquiry initiated by another customer.",
      };
    }

    // 3. Strictly enforce completed lead status
    if (lead.status !== "completed") {
      return {
        eligible: false,
        error: `Reviews are permitted strictly for completed jobs. This lead is currently '${lead.status}'.`,
      };
    }

    // 4. Verify no review already exists for this lead (UNIQUE(lead_id))
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("reviews")
        .select("id")
        .eq("lead_id", leadId)
        .maybeSingle();

      if (data) {
        return {
          eligible: false,
          error: "A verified review has already been submitted for this completed job.",
        };
      }
    } catch {
      // Fallback check
    }

    for (const rev of localReviews.values()) {
      if (rev.lead_id === leadId) {
        return {
          eligible: false,
          error: "A verified review has already been submitted for this completed job.",
        };
      }
    }

    return { eligible: true };
  }

  static async createReview(
    input: CreateReviewInput
  ): Promise<{ success: boolean; review?: ReviewRecord; error?: string }> {
    // Check eligibility
    const eligibility = await this.canSubmitReview(input.leadId, input.customerId);
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.error };
    }

    // Validate rating range
    if (!input.rating || input.rating < 1 || input.rating > 5) {
      return { success: false, error: "Rating must be an integer between 1 and 5 stars." };
    }

    const reviewId = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: ReviewRecord = {
      id: reviewId,
      lead_id: input.leadId,
      business_id: input.businessId,
      customer_id: input.customerId,
      rating: Math.round(input.rating),
      quality_rating: input.qualityRating ? Math.round(input.qualityRating) : null,
      punctuality_rating: input.punctualityRating ? Math.round(input.punctualityRating) : null,
      communication_rating: input.communicationRating ? Math.round(input.communicationRating) : null,
      comment: input.comment || null,
      status: "published", // Auto-publish verified reviews from completed leads
      published_at: now,
      created_at: now,
      customer_name: input.customerName || "Verified Customer",
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          id: record.id,
          lead_id: record.lead_id,
          business_id: record.business_id,
          customer_id: record.customer_id,
          rating: record.rating,
          quality_rating: record.quality_rating,
          punctuality_rating: record.punctuality_rating,
          communication_rating: record.communication_rating,
          comment: record.comment,
          status: record.status,
          published_at: record.published_at,
        })
        .select()
        .single();

      if (!error && data) {
        return { success: true, review: data as ReviewRecord };
      }
    } catch {
      // Fallback
    }

    localReviews.set(reviewId, record);
    return { success: true, review: record };
  }

  static async getReviewsForBusiness(
    businessId: string,
    publishedOnly = true
  ): Promise<ReviewRecord[]> {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("reviews")
        .select("*, profiles(display_name)")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (publishedOnly) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          ...d,
          customer_name: d.profiles?.display_name || "Verified Customer",
        })) as ReviewRecord[];
      }
    } catch {
      // Fallback
    }

    return Array.from(localReviews.values())
      .filter((r) => r.business_id === businessId && (!publishedOnly || r.status === "published"))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getReviewsForModeration(
    statusFilter?: ReviewStatus
  ): Promise<ReviewRecord[]> {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("reviews")
        .select("*, profiles(display_name), businesses(name)")
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          ...d,
          customer_name: d.profiles?.display_name || "Customer",
          business_name: d.businesses?.name || "Service Provider",
        })) as ReviewRecord[];
      }
    } catch {
      // Fallback
    }

    const all = Array.from(localReviews.values());
    if (statusFilter) {
      return all.filter((r) => r.status === statusFilter);
    }
    return all;
  }

  static async moderateReview(
    reviewId: string,
    decision: ReviewStatus,
    moderatorId: string,
    reason?: string
  ): Promise<{ success: boolean; review?: ReviewRecord; error?: string }> {
    const existing = localReviews.get(reviewId);
    const now = new Date().toISOString();

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("reviews")
        .update({
          status: decision,
          published_at: decision === "published" ? now : null,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (!error && data) {
        await AdminService.recordAuditLog(
          moderatorId,
          `moderate_review_${decision}`,
          "review",
          reviewId,
          { status: existing?.status || "pending_moderation" },
          { status: decision },
          reason || `Review status changed to ${decision}`
        );
        return { success: true, review: data as ReviewRecord };
      }
    } catch {
      // Fallback
    }

    if (existing) {
      const updated: ReviewRecord = {
        ...existing,
        status: decision,
        published_at: decision === "published" ? now : null,
      };
      localReviews.set(reviewId, updated);

      await AdminService.recordAuditLog(
        moderatorId,
        `moderate_review_${decision}`,
        "review",
        reviewId,
        { status: existing.status },
        { status: decision },
        reason || `Review status changed to ${decision}`
      );

      return { success: true, review: updated };
    }

    return { success: false, error: "Review not found" };
  }

  static async calculateProviderRating(
    businessId: string
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.getReviewsForBusiness(businessId, true);
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / reviews.length).toFixed(1));

    return {
      averageRating,
      totalReviews: reviews.length,
    };
  }
}
