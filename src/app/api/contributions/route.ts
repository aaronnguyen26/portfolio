import { NextResponse } from "next/server";
import { getOrUpdateContributionData } from "@/lib/github-contributions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  const data = await getOrUpdateContributionData(forceRefresh);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
