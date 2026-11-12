import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getStorageProvider,
  getPublicMediaBucket,
  getPrivateFilesBucket,
  validateUploadRequest,
  generateObjectKey,
  StorageVisibility,
} from "@/lib/storage";

const sessionSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File MIME type is required"),
  fileSizeBytes: z.number().positive().optional(),
  purpose: z.enum(["logo", "cover", "portfolio", "verification_doc"]),
  verificationType: z
    .enum(["phone_confirmed", "identity_checked", "business_details_checked", "qualification_checked"])
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { businessId, fileName, fileType, fileSizeBytes, purpose, verificationType } = parsed.data;

    // Determine visibility & storage bucket
    const visibility: StorageVisibility = purpose === "verification_doc" ? "private" : "public";
    const bucket = visibility === "private" ? getPrivateFilesBucket() : getPublicMediaBucket();

    // Enforce file format and size limits
    const validation = validateUploadRequest({
      contentType: fileType,
      sizeBytes: fileSizeBytes,
      visibility,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Determine storage prefix
    const prefix =
      visibility === "private"
        ? `verifications/${businessId}/${verificationType || "documents"}`
        : `businesses/${businessId}/${purpose}`;

    const objectKey = generateObjectKey(prefix, fileName);

    // Generate signed upload URL via active StorageProvider
    const storageProvider = getStorageProvider();
    const result = await storageProvider.createUploadUrl({
      bucket,
      path: objectKey,
      contentType: fileType,
      sizeBytes: fileSizeBytes,
      expiresInSeconds: 900, // 15 minutes
    });

    return NextResponse.json({
      success: true,
      provider: storageProvider.name,
      uploadUrl: result.uploadUrl,
      objectKey: result.objectPath,
      bucket,
      visibility,
      expiresAt: result.expiresAt,
      requiredHeaders: result.requiredHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to create upload session", message },
      { status: 500 }
    );
  }
}
