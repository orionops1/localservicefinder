import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
import { getServerEnv } from "@/lib/config/env";

export class VultrS3StorageProvider implements StorageProvider {
  public readonly name = "vultr" as const;
  private s3Client: S3Client;
  private endpoint: string;
  private publicBaseUrl?: string;

  constructor(clientOverride?: S3Client) {
    if (clientOverride) {
      this.s3Client = clientOverride;
      this.endpoint = "https://sgp1.vultrobjects.com";
    } else {
      const serverEnv = getServerEnv();
      this.endpoint = serverEnv.VULTR_S3_ENDPOINT || "https://sgp1.vultrobjects.com";
      this.publicBaseUrl = serverEnv.VULTR_PUBLIC_MEDIA_BASE_URL;

      this.s3Client = new S3Client({
        region: serverEnv.VULTR_S3_REGION || "us-east-1",
        endpoint: this.endpoint,
        credentials: {
          accessKeyId: serverEnv.VULTR_S3_ACCESS_KEY || "",
          secretAccessKey: serverEnv.VULTR_S3_SECRET_KEY || "",
        },
        forcePathStyle: true,
      });
    }
  }

  async createUploadUrl(input: CreateUploadUrlInput): Promise<UploadUrlResult> {
    const expiresInSeconds = input.expiresInSeconds ?? 900;
    const command = new PutObjectCommand({
      Bucket: input.bucket,
      Key: input.path,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      uploadUrl,
      objectPath: input.path,
      expiresAt,
      requiredHeaders: {
        "Content-Type": input.contentType,
      },
    };
  }

  async createDownloadUrl(input: CreateDownloadUrlInput): Promise<DownloadUrlResult> {
    const expiresInSeconds = input.expiresInSeconds ?? 3600;
    const command = new GetObjectCommand({
      Bucket: input.bucket,
      Key: input.path,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
      url,
      expiresAt,
    };
  }

  async deleteObject(input: DeleteObjectInput): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: input.bucket,
      Key: input.path,
    });

    await this.s3Client.send(command);
  }

  async getObjectMetadata(input: GetObjectMetadataInput): Promise<ObjectMetadata | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: input.bucket,
        Key: input.path,
      });

      const response = await this.s3Client.send(command);

      return {
        sizeBytes: response.ContentLength ?? 0,
        contentType: response.ContentType ?? "application/octet-stream",
        lastModified: response.LastModified,
      };
    } catch {
      return null;
    }
  }

  getPublicUrl(input: { bucket: string; path: string }): string | null {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, "")}/${input.path.replace(/^\//, "")}`;
    }
    // Path-style S3 endpoint URL
    const cleanEndpoint = this.endpoint.replace(/\/$/, "");
    return `${cleanEndpoint}/${input.bucket}/${input.path.replace(/^\//, "")}`;
  }
}
