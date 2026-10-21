import { NextResponse } from "next/server";
import { getOrUpdateContributionData, renderContributionSvg } from "@/lib/github-contributions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  const data = await getOrUpdateContributionData(forceRefresh);
  const svg = renderContributionSvg(data);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
