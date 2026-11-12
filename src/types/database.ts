export type Locale = "en" | "si" | "ta";

export interface Province {
  id: number;
  slug: string;
  name_en: string;
  name_si: string;
  name_ta: string;
}

export interface District {
  id: number;
  province_id: number;
  slug: string;
  name_en: string;
  name_si: string;
  name_ta: string;
}

export interface Locality {
  id: string;
  district_id: number;
  slug: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  lat?: number;
  lng?: number;
}

export interface ServiceCategory {
  id: string;
  parent_id?: string | null;
  slug: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  description_en?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  subcategories?: ServiceCategory[];
}

export interface ProviderServiceItem {
  id: string;
  title: string;
  description?: string;
  pricing_type: "fixed" | "starting_at" | "hourly" | "quote";
  price_min?: number | null;
  price_max?: number | null;
  currency: string;
  category_id?: string;
  category_slug?: string;
}

export interface ProviderMediaItem {
  id: string;
  storage_path: string;
  media_type: "logo" | "cover" | "portfolio";
  alt_text?: string;
  sort_order: number;
}

export interface ProviderCoverageArea {
  locality_name: string;
  district_name: string;
  radius_km?: number;
}

export interface ProviderReviewSummary {
  average_rating: number;
  total_reviews: number;
}

export interface ProviderCardView {
  id: string;
  name: string;
  slug: string;
  description: string;
  business_type: "individual" | "sole_proprietor" | "registered_company";
  status: "approved";
  primary_category: string;
  categories: string[];
  district: string;
  towns: string[];
  public_phone?: string;
  public_whatsapp?: string;
  rating_summary: ProviderReviewSummary;
  starting_price?: {
    amount: number;
    currency: string;
    type: string;
  };
  badges: Array<{
    type: "phone_confirmed" | "identity_checked" | "business_details_checked" | "qualification_checked";
    label: string;
  }>;
  featured_services: string[];
  image_url?: string;
}

export interface ProviderDetailView extends ProviderCardView {
  public_email?: string;
  website_url?: string;
  services: ProviderServiceItem[];
  coverage_areas: ProviderCoverageArea[];
  media: ProviderMediaItem[];
  published_at?: string;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  district?: string;
  town?: string;
  minRating?: number;
  verifiedOnly?: boolean;
  priceMode?: string;
  sort?: "relevance" | "rating" | "name";
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  items: ProviderCardView[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type BusinessStatus = "draft" | "pending_review" | "approved" | "rejected" | "suspended";

export interface BusinessRecord {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  business_type: "individual" | "sole_proprietor" | "registered_company";
  registration_number?: string | null;
  contact_email: string;
  contact_phone: string;
  whatsapp_number?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  locality_id?: string | null;
  status: BusinessStatus;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationSubmissionRecord {
  id: string;
  business_id: string;
  submitted_by: string;
  check_type: "phone_confirmed" | "identity_checked" | "business_details_checked" | "qualification_checked";
  private_storage_path: string;
  status: "pending" | "approved" | "rejected" | "expired";
  reviewer_id?: string | null;
  decision_reason?: string | null;
  checked_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

export type LeadStatus =
  | "new"
  | "viewed"
  | "contacted"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "completed"
  | "declined"
  | "cancelled"
  | "disputed"
  | "spam";

export interface LeadRecord {
  id: string;
  customer_id: string;
  business_id: string;
  provider_service_id?: string | null;
  category_id: string;
  message: string;
  customer_name_snapshot: string;
  customer_contact_snapshot: string;
  location_id?: string | null;
  preferred_date?: string | null;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
  business?: {
    name: string;
    slug: string;
    district?: string;
  };
  service?: {
    title: string;
  };
}

export interface LeadStatusEventRecord {
  id: string;
  lead_id: string;
  changed_by: string;
  from_status: LeadStatus;
  to_status: LeadStatus;
  note?: string | null;
  created_at: string;
}

export interface FavouriteRecord {
  customer_id: string;
  business_id: string;
  created_at: string;
  business?: ProviderCardView;
}

export interface AdminAuditLogRecord {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  before_data?: Record<string, unknown> | null;
  after_data?: Record<string, unknown> | null;
  reason?: string | null;
  created_at: string;
  actor_name?: string;
}

export interface PlatformMetrics {
  totalProviders: number;
  approvedProviders: number;
  pendingProviders: number;
  pendingVerifications: number;
  totalLeads: number;
  activeLeads: number;
  completedLeads: number;
  totalCategories: number;
  totalDistrictsCovered: number;
}
