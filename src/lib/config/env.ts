import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STORAGE_PROVIDER: z.enum(["supabase", "vultr", "vultr-s3"]).default("supabase"),
  SUPABASE_STORAGE_PUBLIC_BUCKET: z.string().default("provider-public"),
  SUPABASE_STORAGE_PRIVATE_BUCKET: z.string().default("private-documents"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`[PublicEnv] Invalid environment configuration: ${issues}`);
  }

  return result.data;
}

export function getServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "supabase",
    SUPABASE_STORAGE_PUBLIC_BUCKET: process.env.SUPABASE_STORAGE_PUBLIC_BUCKET || "provider-public",
    SUPABASE_STORAGE_PRIVATE_BUCKET: process.env.SUPABASE_STORAGE_PRIVATE_BUCKET || "private-documents",
  });

  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`[ServerEnv] Invalid server environment configuration: ${issues}`);
  }

  return result.data;
}
