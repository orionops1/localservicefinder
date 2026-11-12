import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getPublicEnv, getServerEnv } from "@/lib/config/env";

describe("Environment Configuration Parser", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("fails when required public Supabase URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => getPublicEnv()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("successfully parses valid public environment variables", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    const publicEnv = getPublicEnv();
    expect(publicEnv.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("test-anon-key");
  });

  it("defaults server storage provider to supabase for V1", () => {
    delete process.env.STORAGE_PROVIDER;
    const serverEnv = getServerEnv();
    expect(serverEnv.STORAGE_PROVIDER).toBe("supabase");
    expect(serverEnv.SUPABASE_STORAGE_PUBLIC_BUCKET).toBe("provider-public");
  });
});
