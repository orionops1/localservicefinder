import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health Probe API (/api/health)", () => {
  it("returns HTTP 200 with status ok and valid metadata", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("local-services-finder");
    expect(body).toHaveProperty("timestamp");
    expect(body).toHaveProperty("version");

    // Strict security check: ensure no database connection strings or secrets leak
    expect(body).not.toHaveProperty("database");
    expect(body).not.toHaveProperty("key");
    expect(body).not.toHaveProperty("secret");
  });
});
