import { NextResponse } from "next/server";
import { getStorageProvider, getPrivateFilesBucket } from "@/lib/storage";
import { ProviderService } from "@/features/provider/provider-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await ProviderService.getVerificationById(id);

    if (!submission) {
      return NextResponse.json(
        { error: "Verification document not found" },
        { status: 404 }
      );
    }

    const privateBucket = getPrivateFilesBucket();
    const storageProvider = getStorageProvider();

    // Generate short-lived (5 minutes = 300 seconds) presigned download URL
    const result = await storageProvider.createDownloadUrl({
      bucket: privateBucket,
      path: submission.private_storage_path,
      expiresInSeconds: 300,
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      downloadUrl: result.url,
      expiresAt: result.expiresAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to generate download URL", message },
      { status: 500 }
    );
  }
}
