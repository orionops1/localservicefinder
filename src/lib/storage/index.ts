import { StorageProvider, StorageVisibility } from "./types";
import { SupabaseStorageProvider } from "./providers/supabase-storage-provider";
import { VultrS3StorageProvider } from "./providers/vultr-s3-storage-provider";
import { getServerEnv } from "@/lib/config/env";
import crypto from "node:crypto";

export * from "./types";
export * from "./providers/supabase-storage-provider";
export * from "./providers/vultr-s3-storage-provider";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

let storageProviderInstance: StorageProvider | null = null;

/**
 * Returns the configured storage provider instance.
 * Defaults to Supabase Storage; switches to Vultr S3 if STORAGE_PROVIDER is "vultr" or "vultr-s3".
 */
export function getStorageProvider(): StorageProvider {
  if (storageProviderInstance) {
    return storageProviderInstance;
  }

  const serverEnv = getServerEnv();
  if (serverEnv.STORAGE_PROVIDER === "vultr" || serverEnv.STORAGE_PROVIDER === "vultr-s3") {
    storageProviderInstance = new VultrS3StorageProvider();
  } else {
    storageProviderInstance = new SupabaseStorageProvider();
  }

  return storageProviderInstance;
}

/**
 * Override the storage provider instance (primarily for testing and mocks).
 */
export function setStorageProvider(provider: StorageProvider | null): void {
  storageProviderInstance = provider;
}

/**
 * Returns the public media bucket name based on active provider configuration.
 */
export function getPublicMediaBucket(): string {
  const env = getServerEnv();
  if (env.STORAGE_PROVIDER === "vultr" || env.STORAGE_PROVIDER === "vultr-s3") {
    return env.VULTR_PUBLIC_MEDIA_BUCKET;
  }
  return env.SUPABASE_PUBLIC_MEDIA_BUCKET || env.SUPABASE_STORAGE_PUBLIC_BUCKET;
}

/**
 * Returns the private files bucket name based on active provider configuration.
 */
export function getPrivateFilesBucket(): string {
  const env = getServerEnv();
  if (env.STORAGE_PROVIDER === "vultr" || env.STORAGE_PROVIDER === "vultr-s3") {
    return env.VULTR_PRIVATE_FILES_BUCKET;
  }
  return env.SUPABASE_PRIVATE_FILES_BUCKET || env.SUPABASE_STORAGE_PRIVATE_BUCKET;
}

/**
 * Validates upload request MIME types and payload limits.
 */
export function validateUploadRequest(input: {
  contentType: string;
  sizeBytes?: number;
  visibility: StorageVisibility;
}): { valid: boolean; error?: string } {
  const { contentType, sizeBytes, visibility } = input;

  if (visibility === "public") {
    if (!ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return {
        valid: false,
        error: `Invalid file type "${contentType}". Public media must be an image (JPEG, PNG, or WebP).`,
      };
    }
    if (sizeBytes && sizeBytes > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 5 MB limit for public media.`,
      };
    }
  } else {
    const isDoc = ALLOWED_DOCUMENT_TYPES.includes(contentType as (typeof ALLOWED_DOCUMENT_TYPES)[number]);
    const isImg = ALLOWED_IMAGE_TYPES.includes(contentType as (typeof ALLOWED_IMAGE_TYPES)[number]);

    if (!isDoc && !isImg) {
      return {
        valid: false,
        error: `Invalid file type "${contentType}". Verification documents must be PDF, JPEG, PNG, or WebP.`,
      };
    }

    const limit = isDoc ? MAX_DOCUMENT_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (sizeBytes && sizeBytes > limit) {
      return {
        valid: false,
        error: `File size exceeds the ${isDoc ? "10 MB" : "5 MB"} limit for documents.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Generates an opaque, path-safe, collision-free object key.
 * Preserves the file extension if recognized, and eliminates raw client-supplied paths.
 */
export function generateObjectKey(prefix: string, originalFilename: string): string {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const extensionMatch = originalFilename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : "";
  const randomId = crypto.randomUUID();
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return `${cleanPrefix}/${dateStr}/${randomId}${ext}`;
}
