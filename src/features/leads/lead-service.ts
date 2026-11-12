import { createClient } from "@/lib/supabase/server";
import {
  LeadRecord,
  LeadStatus,
  LeadStatusEventRecord,
  FavouriteRecord,
  ProviderCardView,
} from "@/types/database";
import { DEMO_PROVIDERS } from "@/lib/data/seed-data";

export interface CreateLeadInput {
  customerId: string;
  businessId: string;
  providerServiceId?: string;
  categoryId: string;
  message: string;
  customerNameSnapshot: string;
  customerContactSnapshot: string;
  locationId?: string;
  preferredDate?: string;
  source?: string;
}

export const ALLOWED_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["viewed", "contacted", "declined", "spam", "cancelled"],
  viewed: ["contacted", "quoted", "declined", "spam", "cancelled"],
  contacted: ["quoted", "accepted", "declined", "cancelled"],
  quoted: ["accepted", "declined", "cancelled"],
  accepted: ["in_progress", "declined", "cancelled"],
  in_progress: ["completed", "disputed", "cancelled"],
  completed: [], // Terminal: job completed, unlocks verified customer review
  declined: [], // Terminal
  cancelled: [], // Terminal
  disputed: ["completed", "cancelled"],
  spam: [], // Terminal
};

export function canTransitionLead(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return false;
  const allowed = ALLOWED_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

// Fallback in-memory stores for sandbox/mock runs
const localLeads = new Map<string, LeadRecord>();
const localLeadEvents = new Map<string, LeadStatusEventRecord[]>();
const localFavourites = new Map<string, Set<string>>(); // customerId -> Set of businessIds

// Seed with demonstration leads
function seedInitialLeads() {
  if (localLeads.size > 0) return;

  const demoLead1: LeadRecord = {
    id: "lead-sample-01",
    customer_id: "cust-sample-01",
    business_id: "biz-sample-01",
    category_id: "cat-electrical",
    message: "Tripping MCB in kitchen after heavy rain. Needs urgent inspection in Galle.",
    customer_name_snapshot: "Nimal Perera",
    customer_contact_snapshot: "0771122334",
    preferred_date: "2026-11-15",
    status: "new",
    source: "platform_enquiry",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    business: {
      name: "Galle Precision Electricals",
      slug: "galle-precision-electricals",
      district: "Galle",
    },
    service: {
      title: "Domestic Electrical Wiring & Troubleshooting",
    },
  };

  const demoLead2: LeadRecord = {
    id: "lead-sample-02",
    customer_id: "cust-sample-01",
    business_id: "biz-sample-01",
    category_id: "cat-solar",
    message: "Requesting quotation for 5kVA hybrid solar backup system for guest house.",
    customer_name_snapshot: "Nimal Perera",
    customer_contact_snapshot: "0771122334",
    preferred_date: "2026-11-20",
    status: "contacted",
    source: "platform_enquiry",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    business: {
      name: "Galle Precision Electricals",
      slug: "galle-precision-electricals",
      district: "Galle",
    },
    service: {
      title: "Solar Inverter & Battery Storage Setup",
    },
  };

  localLeads.set(demoLead1.id, demoLead1);
  localLeads.set(demoLead2.id, demoLead2);

  localLeadEvents.set(demoLead1.id, [
    {
      id: crypto.randomUUID(),
      lead_id: demoLead1.id,
      changed_by: demoLead1.customer_id,
      from_status: "new",
      to_status: "new",
      note: "Initial enquiry submitted by customer.",
      created_at: demoLead1.created_at,
    },
  ]);

  localLeadEvents.set(demoLead2.id, [
    {
      id: crypto.randomUUID(),
      lead_id: demoLead2.id,
      changed_by: demoLead2.customer_id,
      from_status: "new",
      to_status: "new",
      note: "Initial enquiry submitted by customer.",
      created_at: demoLead2.created_at,
    },
    {
      id: crypto.randomUUID(),
      lead_id: demoLead2.id,
      changed_by: "provider-user-01",
      from_status: "new",
      to_status: "contacted",
      note: "Called customer via WhatsApp to clarify requirements.",
      created_at: demoLead2.updated_at,
    },
  ]);

  const defaultFavs = new Set<string>();
  defaultFavs.add("biz-sample-01");
  localFavourites.set("cust-sample-01", defaultFavs);
}

seedInitialLeads();

export class LeadService {
  static async createLead(input: CreateLeadInput): Promise<LeadRecord> {
    const leadId = crypto.randomUUID();
    const now = new Date().toISOString();

    const record: LeadRecord = {
      id: leadId,
      customer_id: input.customerId,
      business_id: input.businessId,
      provider_service_id: input.providerServiceId || null,
      category_id: input.categoryId,
      message: input.message,
      customer_name_snapshot: input.customerNameSnapshot,
      customer_contact_snapshot: input.customerContactSnapshot,
      location_id: input.locationId || null,
      preferred_date: input.preferredDate || null,
      status: "new",
      source: input.source || "platform_enquiry",
      created_at: now,
      updated_at: now,
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .insert({
          id: record.id,
          customer_id: record.customer_id,
          business_id: record.business_id,
          provider_service_id: record.provider_service_id,
          category_id: record.category_id,
          message: record.message,
          customer_name_snapshot: record.customer_name_snapshot,
          customer_contact_snapshot: record.customer_contact_snapshot,
          location_id: record.location_id,
          preferred_date: record.preferred_date,
          status: record.status,
          source: record.source,
        })
        .select()
        .single();

      if (!error && data) {
        return data as LeadRecord;
      }
    } catch {
      // Sandbox fallback
    }

    localLeads.set(leadId, record);

    const initialEvent: LeadStatusEventRecord = {
      id: crypto.randomUUID(),
      lead_id: leadId,
      changed_by: input.customerId,
      from_status: "new",
      to_status: "new",
      note: "Customer enquiry submitted.",
      created_at: now,
    };
    localLeadEvents.set(leadId, [initialEvent]);

    return record;
  }

  static async getLeadById(leadId: string): Promise<LeadRecord | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*, businesses(name, slug), provider_services(title)")
        .eq("id", leadId)
        .single();

      if (!error && data) return data as LeadRecord;
    } catch {
      // Fallback
    }

    return localLeads.get(leadId) || null;
  }

  static async getLeadsForCustomer(customerId: string): Promise<LeadRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*, businesses(name, slug), provider_services(title)")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data as LeadRecord[];
    } catch {
      // Fallback
    }

    return Array.from(localLeads.values())
      .filter((l) => l.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getLeadsForBusiness(businessId: string): Promise<LeadRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*, provider_services(title)")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data as LeadRecord[];
    } catch {
      // Fallback
    }

    return Array.from(localLeads.values())
      .filter((l) => l.business_id === businessId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async updateLeadStatus(
    leadId: string,
    toStatus: LeadStatus,
    changedBy: string,
    note?: string
  ): Promise<{ success: boolean; lead?: LeadRecord; error?: string }> {
    const lead = await this.getLeadById(leadId);
    if (!lead) {
      return { success: false, error: "Lead not found." };
    }

    if (!canTransitionLead(lead.status, toStatus)) {
      return {
        success: false,
        error: `Cannot transition lead from '${lead.status}' to '${toStatus}'. This state change is disallowed by business rules.`,
      };
    }

    const now = new Date().toISOString();

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .update({
          status: toStatus,
          updated_at: now,
        })
        .eq("id", leadId)
        .select()
        .single();

      if (!error && data) {
        return { success: true, lead: data as LeadRecord };
      }
    } catch {
      // Fallback
    }

    const updatedLead: LeadRecord = {
      ...lead,
      status: toStatus,
      updated_at: now,
    };
    localLeads.set(leadId, updatedLead);

    // Record immutable audit event
    const event: LeadStatusEventRecord = {
      id: crypto.randomUUID(),
      lead_id: leadId,
      changed_by: changedBy,
      from_status: lead.status,
      to_status: toStatus,
      note: note || `Status changed from ${lead.status} to ${toStatus}`,
      created_at: now,
    };

    const currentEvents = localLeadEvents.get(leadId) || [];
    currentEvents.push(event);
    localLeadEvents.set(leadId, currentEvents);

    return { success: true, lead: updatedLead };
  }

  static async getStatusHistory(leadId: string): Promise<LeadStatusEventRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("lead_status_events")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) return data as LeadStatusEventRecord[];
    } catch {
      // Fallback
    }

    return localLeadEvents.get(leadId) || [];
  }

  static async toggleFavourite(
    customerId: string,
    businessId: string
  ): Promise<{ favourited: boolean }> {
    try {
      const supabase = await createClient();
      const { data: existing } = await supabase
        .from("favourites")
        .select("*")
        .eq("customer_id", customerId)
        .eq("business_id", businessId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("favourites")
          .delete()
          .eq("customer_id", customerId)
          .eq("business_id", businessId);
        return { favourited: false };
      } else {
        await supabase.from("favourites").insert({
          customer_id: customerId,
          business_id: businessId,
        });
        return { favourited: true };
      }
    } catch {
      // Fallback
    }

    const favSet = localFavourites.get(customerId) || new Set<string>();
    if (favSet.has(businessId)) {
      favSet.delete(businessId);
      localFavourites.set(customerId, favSet);
      return { favourited: false };
    } else {
      favSet.add(businessId);
      localFavourites.set(customerId, favSet);
      return { favourited: true };
    }
  }

  static async isFavourited(customerId: string, businessId: string): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("favourites")
        .select("business_id")
        .eq("customer_id", customerId)
        .eq("business_id", businessId)
        .maybeSingle();

      if (data) return true;
    } catch {
      // Fallback
    }

    const favSet = localFavourites.get(customerId);
    return favSet ? favSet.has(businessId) : false;
  }

  static async getFavouritesForCustomer(customerId: string): Promise<FavouriteRecord[]> {
    const favSet = localFavourites.get(customerId) || new Set<string>();
    const results: FavouriteRecord[] = [];

    for (const bizId of favSet) {
      const providerCard: ProviderCardView | undefined = DEMO_PROVIDERS.find(
        (p) => p.id === bizId
      );

      results.push({
        customer_id: customerId,
        business_id: bizId,
        created_at: new Date().toISOString(),
        business: providerCard,
      });
    }

    return results;
  }
}
