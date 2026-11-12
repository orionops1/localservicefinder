export type StorageVisibility = "public" | "private";

export interface CreateUploadUrlInput {
  bucket: string;
  path: string;
  contentType: string;
  sizeBytes?: number;
  expiresInSeconds?: number;
}

export interface UploadUrlResult {
  uploadUrl: string;
  objectPath: string;
  expiresAt: string;
  requiredHeaders?: Record<string, string>;
}

export interface CreateDownloadUrlInput {
  bucket: string;
  path: string;
  expiresInSeconds?: number;
}

export interface DownloadUrlResult {
  url: string;
  expiresAt: string;
}

export interface DeleteObjectInput {
  bucket: string;
  path: string;
}

export interface GetObjectMetadataInput {
  bucket: string;
  path: string;
}

export interface ObjectMetadata {
  sizeBytes: number;
  contentType: string;
  lastModified?: Date;
}

export interface StorageProvider {
  name: "supabase" | "vultr";
  createUploadUrl(input: CreateUploadUrlInput): Promise<UploadUrlResult>;
  createDownloadUrl(input: CreateDownloadUrlInput): Promise<DownloadUrlResult>;
  deleteObject(input: DeleteObjectInput): Promise<void>;
  getObjectMetadata(input: GetObjectMetadataInput): Promise<ObjectMetadata | null>;
  getPublicUrl(input: { bucket: string; path: string }): string | null;
}
