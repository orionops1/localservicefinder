import { NextResponse } from "next/server";
import { getAllCategories } from "@/features/discovery/search-service";

export async function GET() {
  const categories = getAllCategories();

  return NextResponse.json(
    {
      data: categories,
      meta: {
        total: categories.length,
        timestamp: new Date().toISOString(),
      },
      error: null,
    },
    { status: 200 }
  );
}
