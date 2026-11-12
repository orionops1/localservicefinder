import { describe, it, expect } from "vitest";
import { PROVINCES, DISTRICTS, LOCALITIES } from "@/lib/data/seed-data";

describe("Sri Lanka Administrative Taxonomy Integrity", () => {
  it("contains exactly 9 provinces", () => {
    expect(PROVINCES.length).toBe(9);
    const ids = new Set(PROVINCES.map((p) => p.id));
    expect(ids.size).toBe(9);
  });

  it("contains all 25 districts mapped to valid provinces", () => {
    expect(DISTRICTS.length).toBe(25);
    const provinceIds = new Set(PROVINCES.map((p) => p.id));

    DISTRICTS.forEach((district) => {
      expect(provinceIds.has(district.province_id)).toBe(true);
      expect(district.name_en).toBeTruthy();
      expect(district.name_si).toBeTruthy();
      expect(district.name_ta).toBeTruthy();
    });
  });

  it("includes the Southern Province pilot districts (Galle, Matara, Hambantota)", () => {
    const southernDistricts = DISTRICTS.filter((d) => d.province_id === 3);
    expect(southernDistricts.length).toBe(3);
    const slugs = southernDistricts.map((d) => d.slug);
    expect(slugs).toContain("galle");
    expect(slugs).toContain("matara");
    expect(slugs).toContain("hambantota");
  });

  it("includes valid WGS84 coordinate bounds for key localities", () => {
    LOCALITIES.forEach((loc) => {
      if (loc.lat && loc.lng) {
        // Sri Lanka bounding box: Latitude 5.9°N to 9.9°N, Longitude 79.5°E to 81.9°E
        expect(loc.lat).toBeGreaterThanOrEqual(5.8);
        expect(loc.lat).toBeLessThanOrEqual(10.0);
        expect(loc.lng).toBeGreaterThanOrEqual(79.5);
        expect(loc.lng).toBeLessThanOrEqual(82.0);
      }
    });
  });
});
