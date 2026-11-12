# Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022) Compliance Architecture

**Product:** Sri Lanka Local Services Finder (`LocalServices.lk`)  
**Effective Date:** November 2026  
**Governing Law:** Personal Data Protection Act No. 9 of 2022 (as amended) — Democratic Socialist Republic of Sri Lanka.

---

## 1. Regulatory Context & Applicability

The Personal Data Protection Act No. 9 of 2022 establishes the statutory framework for processing personal data of data subjects within Sri Lanka. As an online marketplace matching consumers with trade and domestic service providers, `LocalServices.lk` functions as a **Data Controller** regarding customer profiles, enquiry leads, provider business records, and verification evidence.

---

## 2. Lawful Grounds for Processing (Section 5)

Data processing across the platform relies on the following lawful bases:
1. **Consent (Section 5(1)(a)):**
   - Explicit opt-in when customers submit service enquiries to trade providers.
   - Explicit confirmation when providers upload trade qualifications and NIC copies for identity verification.
2. **Contractual Necessity (Section 5(1)(b)):**
   - Processing contact details and job scopes necessary to facilitate quotations, job bookings, and status transitions between customers and service providers.
3. **Legal Compliance (Section 5(1)(c)):**
   - Maintenance of business registration records, anti-fraud moderation logs, and taxation records.

---

## 3. Data Minimization & Security Architecture (Section 7 & 10)

### 3.1 Strict Separation of Public Media vs. Private Evidence
- **Public Media (`lsf-public-media` / `public-media`):**
  - Contains strictly non-sensitive public assets: provider logos, portfolio photos, and approved workshop banners.
- **Private Identity & Evidence (`lsf-private-files` / `private-files`):**
  - Contains sensitive personal identification: National Identity Cards (NIC), Passports, and Business Registration (BR) documents.
  - **Zero Public Access:** Buckets block all unauthenticated public reads at the storage layer.
  - **Cryptographic Ephemeral URLs:** Documents are inspected solely via short-lived (5-minute / 300-second) presigned URLs generated server-side following role-based authentication (`is_admin()` or `is_verifier_or_admin()`).

### 3.2 Lead Snapshot Immutability
- Customer contact snapshots are stored only upon enquiry creation (`leads.customer_name_snapshot` and `leads.customer_contact_snapshot`).
- Inquiries can only be viewed by the customer who created them and authorized members of the target business, enforced through PostgreSQL Row Level Security (RLS).

### 3.3 Anonymous Engagement Telemetry
- Direct contact taps (phone calls and WhatsApp click-to-chat) are tracked with minimal anonymized counters (`channel`, `timestamp`, `business_id`).
- No IP addresses, device identifiers, or GPS trajectories are retained in engagement logs.

---

## 4. Rights of Data Subjects (Part II)

Under Part II of the PDPA, users and providers possess the following statutory rights:

| Right | Statutory Reference | Platform Implementation |
|---|---|---|
| **Right of Access** | Section 13 | Customers can view all submitted enquiries at `/customer/enquiries`. Providers view complete business records at `/provider/profile`. |
| **Right to Rectification** | Section 14 | Providers can modify business names, descriptions, and contact numbers in the Provider Portal. |
| **Right to Erasure** | Section 15 | Customers can cancel pending enquiries. Account deletion requests purge customer profiles and cascade-delete saved favourites. |
| **Right to Withdraw Consent** | Section 16 | Providers can withdraw applications before approval, transitioning status to `draft` or requesting profile deletion. |

---

## 5. Cross-Border Data Transfer (Section 26)

- Database, authentication, and application servers are hosted in the **Singapore (`ap-southeast-1` / `sgp1`)** regional cloud availability zones (Supabase PostgreSQL and Vultr Object Storage).
- Singapore maintains comparable high-standard data protection legislation (Personal Data Protection Act 2012 of Singapore). Data transfers meet cross-border adequacy requirements and are secured via end-to-end TLS 1.3 encryption.

---

## 6. Retention & Disposal Schedule

- **Enquiry Leads & Transition Events:** Retained for 24 months from completion to support dispute resolution and verified review audits, after which records are archived or anonymized.
- **Verification Evidence (NIC / BR):** Stored only while the provider's account remains active plus 12 months for compliance records, after which binary files are permanently purged from object storage.
- **Audit Logs:** Immutable admin action logs in `admin_audit_logs` are retained for 5 years to maintain regulatory compliance.
