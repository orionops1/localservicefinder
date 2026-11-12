import { NextRequest, NextResponse } from "next/server";
import { searchProviders } from "@/features/discovery/search-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const district = searchParams.get("district") || undefined;
  const town = searchParams.get("town") || undefined;
  const verifiedOnly = searchParams.get("verifiedOnly") === "true";
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const sort = (searchParams.get("sort") as "relevance" | "rating" | "name") || "relevance";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 10;

  try {
    const result = await searchProviders({
      q,
      category,
      district,
      town,
      verifiedOnly,
      minRating,
      sort,
      page,
      pageSize,
    });

    return NextResponse.json(
      {
        data: result,
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
        error: {
          code: "SEARCH_FAILED",
          message: error instanceof Error ? error.message : "Search query processing failed",
        },
      },
      { status: 500 }
    );
  }
}
