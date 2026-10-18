import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialData from "@/data/contributions.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";

  const jsonPath = path.join(process.cwd(), "src", "data", "contributions.json");

  // If local file exists, read it
  if (!forceRefresh && fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(content);
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    } catch {}
  }

  // Fallback to imported initialData
  return NextResponse.json(initialData, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
