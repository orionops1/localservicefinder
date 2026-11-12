import { NextResponse } from "next/server";
import { AdminService } from "@/features/admin/admin-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const logs = await AdminService.getAdminAuditLogs(limit);
    return NextResponse.json({ logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: "Failed to fetch audit logs", message }, { status: 500 });
  }
}
