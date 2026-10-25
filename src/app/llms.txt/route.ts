import { getLlmsTxt } from "@/data/llms-content";

export async function GET() {
  const content = getLlmsTxt();
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
