import { createClient } from "@/lib/supabase/server";
import { BusinessRecord, ProviderServiceItem, VerificationSubmissionRecord } from "@/types/database";

export interface ProviderServiceAreaRecord {
  id: string;
  business_id: string;
  district_id: number;
  locality_id?: string | null;
  radius_km?: number;
  districts?: {
    name_en: string;
    slug: string;
  };
}

export interface ProviderMediaRecord {
  id: string;
  business_id: string;
  storage_path: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  media_type: "logo" | "cover" | "portfolio";
  sort_order: number;
  created_at: string;
}

export interface CreateBusinessInput {
  ownerId: string;
  name: string;
  slug?: string;
  description: string;
  businessType: "individual" | "sole_proprietor" | "registered_company";
  registrationNumber?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  localityId?: string;
}

export interface AddServiceInput {
  businessId: string;
  categoryId: string;
  title: string;
  description?: string;
  pricingType: "fixed" | "starting_at" | "hourly" | "quote";
  priceMin?: number;
  priceMax?: number;
  currency?: string;
}

export interface AddServiceAreaInput {
  businessId: string;
  districtId: number;
  localityId?: string;
  radiusKm?: number;
}

export interface AddMediaInput {
  businessId: string;
  storagePath: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  mediaType: "logo" | "cover" | "portfolio";
  sortOrder?: number;
}

export interface AddVerificationInput {
  businessId: string;
  submittedBy: string;
  checkType: "phone_confirmed" | "identity_checked" | "business_details_checked" | "qualification_checked";
  privateStoragePath: string;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .concat("-", Math.random().toString(36).substring(2, 6));
}

// Fallback in-memory store for local sandbox when Supabase connection isn't configured
const localBusinesses = new Map<string, BusinessRecord>();
const localServices = new Map<string, ProviderServiceItem[]>();
const localAreas = new Map<string, ProviderServiceAreaRecord[]>();
const localMedia = new Map<string, ProviderMediaRecord[]>();
const localVerifications = new Map<string, VerificationSubmissionRecord[]>();

export class ProviderService {
  static async getBusinessByOwner(ownerId: string): Promise<BusinessRecord | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) return data as BusinessRecord;
    } catch {
      // Fallback to local store
    }

    for (const b of localBusinesses.values()) {
      if (b.owner_id === ownerId) return b;
    }
    return null;
  }

  static async getBusinessById(businessId: string): Promise<BusinessRecord | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single();

      if (!error && data) return data as BusinessRecord;
    } catch {
      // Fallback
    }

    return localBusinesses.get(businessId) || null;
  }

  static async createBusiness(input: CreateBusinessInput): Promise<BusinessRecord> {
    const slug = input.slug || generateSlug(input.name);
    const newRecord: BusinessRecord = {
      id: crypto.randomUUID(),
      owner_id: input.ownerId,
      name: input.name,
      slug,
      description: input.description,
      business_type: input.businessType,
      registration_number: input.registrationNumber || null,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      whatsapp_number: input.whatsappNumber || null,
      address_line1: input.addressLine1 || null,
      address_line2: input.addressLine2 || null,
      locality_id: input.localityId || null,
      status: "draft",
      rejection_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          id: newRecord.id,
          owner_id: newRecord.owner_id,
          name: newRecord.name,
          slug: newRecord.slug,
          description: newRecord.description,
          business_type: newRecord.business_type,
          registration_number: newRecord.registration_number,
          contact_email: newRecord.contact_email,
          contact_phone: newRecord.contact_phone,
          whatsapp_number: newRecord.whatsapp_number,
          address_line1: newRecord.address_line1,
          address_line2: newRecord.address_line2,
          locality_id: newRecord.locality_id,
          status: newRecord.status,
        })
        .select()
        .single();

      if (!error && data) {
        return data as BusinessRecord;
      }
    } catch {
      // In local/sandbox fallback
    }

    localBusinesses.set(newRecord.id, newRecord);
    return newRecord;
  }

  static async updateBusiness(
    businessId: string,
    updates: Partial<Omit<BusinessRecord, "id" | "owner_id" | "created_at">>
  ): Promise<BusinessRecord | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("businesses")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId)
        .select()
        .single();

      if (!error && data) return data as BusinessRecord;
    } catch {
      // Fallback
    }

    const existing = localBusinesses.get(businessId);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localBusinesses.set(businessId, updated);
    return updated;
  }

  static async submitForReview(businessId: string): Promise<{ success: boolean; error?: string }> {
    const business = await this.getBusinessById(businessId);
    if (!business) {
      return { success: false, error: "Business not found." };
    }

    if (!business.contact_phone || !business.contact_email || !business.description) {
      return {
        success: false,
        error: "Business must have a description, contact phone, and contact email before submission.",
      };
    }

    const updated = await this.updateBusiness(businessId, { status: "pending_review" });
    if (!updated) {
      return { success: false, error: "Failed to update status to pending review." };
    }

    return { success: true };
  }

  static async addService(input: AddServiceInput): Promise<ProviderServiceItem> {
    const item: ProviderServiceItem = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      pricing_type: input.pricingType,
      price_min: input.priceMin ?? null,
      price_max: input.priceMax ?? null,
      currency: input.currency || "LKR",
      category_id: input.categoryId,
    };

    try {
      const supabase = await createClient();
      await supabase.from("provider_services").insert({
        id: item.id,
        business_id: input.businessId,
        category_id: input.categoryId,
        title: input.title,
        description: input.description,
        pricing_type: input.pricingType,
        price_min: input.priceMin,
        price_max: input.priceMax,
        currency: item.currency,
        is_active: true,
      });
    } catch {
      // Fallback
    }

    const current = localServices.get(input.businessId) || [];
    current.push(item);
    localServices.set(input.businessId, current);
    return item;
  }

  static async getServices(businessId: string): Promise<ProviderServiceItem[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("provider_services")
        .select("*")
        .eq("business_id", businessId);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          pricing_type: d.pricing_type,
          price_min: d.price_min,
          price_max: d.price_max,
          currency: d.currency,
          category_id: d.category_id,
        }));
      }
    } catch {
      // Fallback
    }

    return localServices.get(businessId) || [];
  }

  static async addServiceArea(input: AddServiceAreaInput): Promise<ProviderServiceAreaRecord> {
    const record: ProviderServiceAreaRecord = {
      id: crypto.randomUUID(),
      business_id: input.businessId,
      district_id: input.districtId,
      locality_id: input.localityId || null,
      radius_km: input.radiusKm || 25,
    };

    try {
      const supabase = await createClient();
      await supabase.from("provider_service_areas").insert(record);
    } catch {
      // Fallback
    }

    const current = localAreas.get(input.businessId) || [];
    current.push(record);
    localAreas.set(input.businessId, current);
    return record;
  }

  static async getServiceAreas(businessId: string): Promise<ProviderServiceAreaRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("provider_service_areas")
        .select("*, districts(name_en, slug)")
        .eq("business_id", businessId);

      if (!error && data && data.length > 0) return data as ProviderServiceAreaRecord[];
    } catch {
      // Fallback
    }

    return localAreas.get(businessId) || [];
  }

  static async addMedia(input: AddMediaInput): Promise<ProviderMediaRecord> {
    const record: ProviderMediaRecord = {
      id: crypto.randomUUID(),
      business_id: input.businessId,
      storage_path: input.storagePath,
      file_name: input.fileName,
      file_size_bytes: input.fileSizeBytes,
      mime_type: input.mimeType,
      media_type: input.mediaType,
      sort_order: input.sortOrder || 0,
      created_at: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      await supabase.from("provider_media").insert(record);
    } catch {
      // Fallback
    }

    const current = localMedia.get(input.businessId) || [];
    current.push(record);
    localMedia.set(input.businessId, current);
    return record;
  }

  static async getMedia(businessId: string): Promise<ProviderMediaRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("provider_media")
        .select("*")
        .eq("business_id", businessId)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) return data as ProviderMediaRecord[];
    } catch {
      // Fallback
    }

    return localMedia.get(businessId) || [];
  }

  static async addVerification(input: AddVerificationInput): Promise<VerificationSubmissionRecord> {
    const record: VerificationSubmissionRecord = {
      id: crypto.randomUUID(),
      business_id: input.businessId,
      submitted_by: input.submittedBy,
      check_type: input.checkType,
      private_storage_path: input.privateStoragePath,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      await supabase.from("verification_submissions").insert({
        id: record.id,
        business_id: record.business_id,
        submitted_by: record.submitted_by,
        check_type: record.check_type,
        private_storage_path: record.private_storage_path,
        status: record.status,
      });
    } catch {
      // Fallback
    }

    const current = localVerifications.get(input.businessId) || [];
    current.push(record);
    localVerifications.set(input.businessId, current);
    return record;
  }

  static async getVerifications(businessId: string): Promise<VerificationSubmissionRecord[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("verification_submissions")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data as VerificationSubmissionRecord[];
    } catch {
      // Fallback
    }

    return localVerifications.get(businessId) || [];
  }

  static async getVerificationById(submissionId: string): Promise<VerificationSubmissionRecord | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("verification_submissions")
        .select("*")
        .eq("id", submissionId)
        .single();

      if (!error && data) return data as VerificationSubmissionRecord;
    } catch {
      // Fallback
    }

    for (const list of localVerifications.values()) {
      const match = list.find((v) => v.id === submissionId);
      if (match) return match;
    }
    return null;
  }
}
