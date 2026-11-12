import { describe, it, expect, beforeEach } from "vitest";
import { S3Client } from "@aws-sdk/client-s3";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  validateUploadRequest,
  generateObjectKey,
  getPublicMediaBucket,
  getPrivateFilesBucket,
  setStorageProvider,
  VultrS3StorageProvider,
  SupabaseStorageProvider,
} from "@/lib/storage";

describe("Storage Subsystem", () => {
  beforeEach(() => {
    setStorageProvider(null);
  });

  describe("validateUploadRequest", () => {
    it("allows valid public media formats under 5 MB", () => {
      const jpgResult = validateUploadRequest({
        contentType: "image/jpeg",
        sizeBytes: 2 * 1024 * 1024,
        visibility: "public",
      });
      expect(jpgResult.valid).toBe(true);

      const webpResult = validateUploadRequest({
        contentType: "image/webp",
        sizeBytes: 4.9 * 1024 * 1024,
        visibility: "public",
      });
      expect(webpResult.valid).toBe(true);
    });

    it("rejects non-image formats for public media", () => {
      const pdfResult = validateUploadRequest({
        contentType: "application/pdf",
        sizeBytes: 1024 * 1024,
        visibility: "public",
      });
      expect(pdfResult.valid).toBe(false);
      expect(pdfResult.error).toContain("Public media must be an image");

      const exeResult = validateUploadRequest({
        contentType: "application/x-msdownload",
        visibility: "public",
      });
      expect(exeResult.valid).toBe(false);
    });

    it("rejects oversized public media (> 5 MB)", () => {
      const oversizedResult = validateUploadRequest({
        contentType: "image/png",
        sizeBytes: 6 * 1024 * 1024,
        visibility: "public",
      });
      expect(oversizedResult.valid).toBe(false);
      expect(oversizedResult.error).toContain("5 MB limit");
    });

    it("allows PDF and image documents for private verification", () => {
      const pdfResult = validateUploadRequest({
        contentType: "application/pdf",
        sizeBytes: 8 * 1024 * 1024,
        visibility: "private",
      });
      expect(pdfResult.valid).toBe(true);

      const nicImageResult = validateUploadRequest({
        contentType: "image/jpeg",
        sizeBytes: 3 * 1024 * 1024,
        visibility: "private",
      });
      expect(nicImageResult.valid).toBe(true);
    });

    it("rejects oversized private documents (> 10 MB)", () => {
      const oversizedPdf = validateUploadRequest({
        contentType: "application/pdf",
        sizeBytes: 12 * 1024 * 1024,
        visibility: "private",
      });
      expect(oversizedPdf.valid).toBe(false);
      expect(oversizedPdf.error).toContain("10 MB limit");
    });
  });

  describe("generateObjectKey", () => {
    it("generates an opaque, path-safe key with UUID and sanitized extension", () => {
      const key = generateObjectKey("portfolio/biz-123", "my photo (1).JPEG");
      expect(key).toMatch(/^portfolio\/biz-123\/\d{4}-\d{2}-\d{2}\/[a-f0-9-]+\.jpeg$/);
      expect(key).not.toContain("my photo");
      expect(key).not.toContain(" ");
    });

    it("cleans slashes from prefix", () => {
      const key = generateObjectKey("/documents/verifications/", "nic.pdf");
      expect(key.startsWith("/")).toBe(false);
      expect(key).toMatch(/^documents\/verifications\/\d{4}-\d{2}-\d{2}\/[a-f0-9-]+\.pdf$/);
    });
  });

  describe("Bucket Configuration", () => {
    it("returns expected default public and private buckets", () => {
      expect(getPublicMediaBucket()).toBeDefined();
      expect(getPrivateFilesBucket()).toBeDefined();
      expect(getPublicMediaBucket()).not.toBe(getPrivateFilesBucket());
    });
  });

  describe("VultrS3StorageProvider URL generation", () => {
    it("generates correct public URL path", () => {
      const provider = new VultrS3StorageProvider({} as unknown as S3Client);
      const url = provider.getPublicUrl({
        bucket: "lsf-public-media",
        path: "businesses/123/logo.webp",
      });
      expect(url).toBe("https://sgp1.vultrobjects.com/lsf-public-media/businesses/123/logo.webp");
    });
  });

  describe("SupabaseStorageProvider public URL generation", () => {
    it("delegates to supabase client storage", () => {
      const mockClient = {
        storage: {
          from: (bucket: string) => ({
            getPublicUrl: (path: string) => ({
              data: { publicUrl: `https://mock.supabase.co/storage/v1/object/public/${bucket}/${path}` },
            }),
          }),
        },
      } as unknown as SupabaseClient;

      const provider = new SupabaseStorageProvider(mockClient);
      const url = provider.getPublicUrl({
        bucket: "public-media",
        path: "covers/cover.png",
      });
      expect(url).toBe("https://mock.supabase.co/storage/v1/object/public/public-media/covers/cover.png");
    });
  });
});
