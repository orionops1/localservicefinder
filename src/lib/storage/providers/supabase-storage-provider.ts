import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  StorageProvider,
  CreateUploadUrlInput,
  UploadUrlResult,
  CreateDownloadUrlInput,
  DownloadUrlResult,
  DeleteObjectInput,
  GetObjectMetadataInput,
  ObjectMetadata,
} from "../types";
import { getServerEnv, getPublicEnv } from "@/lib/config/env";

export class SupabaseStorageProvider implements StorageProvider {
  public readonly name = "supabase" as const;
  private client: SupabaseClient;

  constructor(clientOverride?: SupabaseClient) {
    if (clientOverride) {
      this.client = clientOverride;
    } else {
      const publicEnv = getPublicEnv();
      const serverEnv = getServerEnv();
      const apiKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY || publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      this.client = createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, apiKey, {
        auth: { persistSession: false },
      });
    }
  }

  async createUploadUrl(input: CreateUploadUrlInput): Promise<UploadUrlResult> {
    const expiresInSeconds = input.expiresInSeconds ?? 900;
    const { data, error } = await this.client.storage
      .from(input.bucket)
      .createSignedUploadUrl(input.path);

    if (error || !data) {
      throw new Error(`Failed to create Supabase signed upload URL: ${error?.message || "Unknown error"}`);
    }

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      uploadUrl: data.signedUrl,
      objectPath: input.path,
      expiresAt,
    };
  }

  async createDownloadUrl(input: CreateDownloadUrlInput): Promise<DownloadUrlResult> {
    const expiresInSeconds = input.expiresInSeconds ?? 3600;
    const { data, error } = await this.client.storage
      .from(input.bucket)
      .createSignedUrl(input.path, expiresInSeconds);

    if (error || !data) {
      throw new Error(`Failed to create Supabase signed download URL: ${error?.message || "Unknown error"}`);
    }

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      url: data.signedUrl,
      expiresAt,
    };
  }

  async deleteObject(input: DeleteObjectInput): Promise<void> {
    const { error } = await this.client.storage.from(input.bucket).remove([input.path]);
    if (error) {
      throw new Error(`Failed to delete Supabase object at ${input.bucket}/${input.path}: ${error.message}`);
    }
  }

  async getObjectMetadata(input: GetObjectMetadataInput): Promise<ObjectMetadata | null> {
    // Supabase Storage list call to find matching file entry
    const pathParts = input.path.split("/");
    const filename = pathParts.pop() || "";
    const folder = pathParts.join("/");

    const { data, error } = await this.client.storage.from(input.bucket).list(folder, {
      search: filename,
    });

    if (error || !data || data.length === 0) {
      return null;
    }

    const match = data.find((item) => item.name === filename);
    if (!match) {
      return null;
    }

    return {
      sizeBytes: match.metadata?.size ?? 0,
      contentType: match.metadata?.mimetype ?? "application/octet-stream",
      lastModified: match.updated_at ? new Date(match.updated_at) : undefined,
    };
  }

  getPublicUrl(input: { bucket: string; path: string }): string | null {
    const { data } = this.client.storage.from(input.bucket).getPublicUrl(input.path);
    return data?.publicUrl || null;
  }
}
