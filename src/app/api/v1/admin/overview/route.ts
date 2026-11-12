import { NextResponse } from "next/server";
import { AdminService } from "@/features/admin/admin-service";

export async function GET() {
  try {
    const metrics = await AdminService.getPlatformMetrics();
    const recentAuditLogs = await AdminService.getAdminAuditLogs(5);
    const pendingProviders = await AdminService.getProvidersForModeration("pending_review");
    const pendingVerifications = await AdminService.getVerificationsForModeration("pending");

    return NextResponse.json({
      metrics,
      recentAuditLogs,
      pendingProvidersCount: pendingProviders.length,
      pendingVerificationsCount: pendingVerifications.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to fetch admin overview", message }, { status: 500 });
  }
}
