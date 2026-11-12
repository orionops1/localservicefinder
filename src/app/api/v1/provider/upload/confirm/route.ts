import { NextResponse } from "next/server";
import { z } from "zod";
import { getStorageProvider } from "@/lib/storage";
import { ProviderService } from "@/features/provider/provider-service";

const confirmSchema = z.object({
  businessId: z.string().uuid(),
  objectKey: z.string().min(1),
  bucket: z.string().min(1),
  fileName: z.string().min(1),
  fileSizeBytes: z.number().positive(),
  fileType: z.string().min(1),
  purpose: z.enum(["logo", "cover", "portfolio", "verification_doc"]),
  verificationType: z
    .enum(["phone_confirmed", "identity_checked", "business_details_checked", "qualification_checked"])
    .optional(),
  submittedBy: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = confirmSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      businessId,
      objectKey,
      bucket,
      fileName,
      fileSizeBytes,
      fileType,
      purpose,
      verificationType,
      submittedBy,
    } = parsed.data;

    const storageProvider = getStorageProvider();

    // Check object existence and metadata in storage if live
    const metadata = await storageProvider.getObjectMetadata({
      bucket,
      path: objectKey,
    });

    const confirmedSize = metadata?.sizeBytes || fileSizeBytes;
    const confirmedMime = metadata?.contentType || fileType;

    if (purpose === "verification_doc") {
      const submission = await ProviderService.addVerification({
        businessId,
        submittedBy: submittedBy || crypto.randomUUID(),
        checkType: verificationType || "identity_checked",
        privateStoragePath: objectKey,
      });

      return NextResponse.json({
        success: true,
        type: "verification_submission",
        record: submission,
      });
    } else {
      const media = await ProviderService.addMedia({
        businessId,
        storagePath: objectKey,
        fileName,
        fileSizeBytes: confirmedSize,
        mimeType: confirmedMime,
        mediaType: purpose,
      });

      const publicUrl = storageProvider.getPublicUrl({
        bucket,
        path: objectKey,
      });

      return NextResponse.json({
        success: true,
        type: "provider_media",
        record: media,
        publicUrl,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to confirm upload", message },
      { status: 500 }
    );
  }
}
