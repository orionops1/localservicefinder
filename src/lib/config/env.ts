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
  SUPABASE_PUBLIC_MEDIA_BUCKET: z.string().default("public-media"),
  SUPABASE_PRIVATE_FILES_BUCKET: z.string().default("private-files"),
  VULTR_S3_ENDPOINT: z.string().url().optional(),
  VULTR_S3_REGION: z.string().default("us-east-1"),
  VULTR_S3_ACCESS_KEY: z.string().optional(),
  VULTR_S3_SECRET_KEY: z.string().optional(),
  VULTR_PUBLIC_MEDIA_BUCKET: z.string().default("lsf-public-media"),
  VULTR_PRIVATE_FILES_BUCKET: z.string().default("lsf-private-files"),
  VULTR_PUBLIC_MEDIA_BASE_URL: z.string().optional(),
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
    SUPABASE_PUBLIC_MEDIA_BUCKET: process.env.SUPABASE_PUBLIC_MEDIA_BUCKET || "public-media",
    SUPABASE_PRIVATE_FILES_BUCKET: process.env.SUPABASE_PRIVATE_FILES_BUCKET || "private-files",
    VULTR_S3_ENDPOINT: process.env.VULTR_S3_ENDPOINT,
    VULTR_S3_REGION: process.env.VULTR_S3_REGION || "us-east-1",
    VULTR_S3_ACCESS_KEY: process.env.VULTR_S3_ACCESS_KEY,
    VULTR_S3_SECRET_KEY: process.env.VULTR_S3_SECRET_KEY,
    VULTR_PUBLIC_MEDIA_BUCKET: process.env.VULTR_PUBLIC_MEDIA_BUCKET || "lsf-public-media",
    VULTR_PRIVATE_FILES_BUCKET: process.env.VULTR_PRIVATE_FILES_BUCKET || "lsf-private-files",
    VULTR_PUBLIC_MEDIA_BASE_URL: process.env.VULTR_PUBLIC_MEDIA_BASE_URL,
  });

  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`[ServerEnv] Invalid server environment configuration: ${issues}`);
  }

  return result.data;
}
