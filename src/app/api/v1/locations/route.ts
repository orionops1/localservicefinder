import { NextRequest, NextResponse } from "next/server";
import { PROVINCES, DISTRICTS, LOCALITIES } from "@/lib/data/seed-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "districts";
  const districtId = searchParams.get("districtId") ? Number(searchParams.get("districtId")) : null;

  if (type === "provinces") {
    return NextResponse.json({ data: PROVINCES, error: null }, { status: 200 });
  }

  if (type === "localities") {
    const filtered = districtId
      ? LOCALITIES.filter((l) => l.district_id === districtId)
      : LOCALITIES;
    return NextResponse.json({ data: filtered, error: null }, { status: 200 });
  }

  return NextResponse.json({ data: DISTRICTS, error: null }, { status: 200 });
}
