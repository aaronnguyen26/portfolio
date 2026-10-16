import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Daily check handled via getOrUpdateDailyContributions() algorithm

const monthLabels: [string, number][] = [
  ["Oct", 0], ["Nov", 3], ["Dec", 8], ["Jan", 12],
  ["Feb", 16], ["Mar", 20], ["Apr", 25], ["May", 29],
  ["Jun", 34], ["Jul", 38], ["Aug", 42], ["Sep", 47], ["Oct", 51],
];

const palette = {
  bg: "transparent",
  text_name: "#26211b",
  text_count: "#5b5246",
  text_muted: "#7a4a2a",
  levels: ["#ebdcc2", "#97b788", "#5b8e51", "#286332", "#8a1c1c"],
  level_borders: ["#dfcaa4", "#85a476", "#4e7e45", "#1e4f26", "#661212"],
};

function renderSvg(
  grid: Record<string, { date: string; level: number }>,
  total: string | number
): string {
  // Full-width wide viewBox to span edge-to-edge
  const w = 960;
  const h = 230;
  const start_x = 36;
  const start_y = 72;
  const step = 16.75;
  const cell_size = 13.0;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="font-family: Georgia, serif; background:transparent;">
  <!-- Top Header: ONLY 'Aaron Nguyen' and the number, with 75px gap to guarantee zero overlap -->
  <g transform="translate(36, 34)">
    <text x="0" y="0" font-size="22" font-weight="700" fill="${palette.text_name}">Aaron Nguyen</text>
    <text x="210" y="-1" font-size="13.5" font-family="'JetBrains Mono', monospace, ui-monospace" fill="${palette.text_count}">${total} contributions in the last year</text>
  </g>
`;

  // Months
  for (const [mName, mCol] of monthLabels) {
    svg += `  <text x="${start_x + mCol * step}" y="${start_y - 10}" font-family="'JetBrains Mono', monospace" font-size="10" fill="${palette.text_muted}">${mName}</text>\n`;
  }

  // Days (Mon, Wed, Fri)
  svg += `  <text x="${start_x - 10}" y="${start_y + 1 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Mon</text>\n`;
  svg += `  <text x="${start_x - 10}" y="${start_y + 3 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Wed</text>\n`;
  svg += `  <text x="${start_x - 10}" y="${start_y + 5 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Fri</text>\n`;

  // Grid Cells (Larger 13px cells spanning the full width)
  for (const [coord, item] of Object.entries(grid)) {
    const [c, r] = coord.split(",").map(Number);
    const lvl = Math.min(item.level || 0, 4);
    const fill = palette.levels[lvl];
    const border = palette.level_borders[lvl];
    const cx = start_x + c * step;
    const cy = start_y + r * step;
    svg += `  <rect x="${cx}" y="${cy}" width="${cell_size}" height="${cell_size}" rx="2.5" fill="${fill}" stroke="${border}" stroke-width="0.8"><title>${item.date}: level ${lvl}</title></rect>\n`;
  }

  const legend_y = start_y + 7 * step + 18;
  const legend_end_x = start_x + 52 * step + cell_size; // aligns with end of grid (~920px)
  const legend_start_x = legend_end_x - 140;

  svg += `
  <!-- Bottom Legend: ONLY Less -> More (Right-aligned with edge of grid) -->
  <g transform="translate(${legend_start_x}, ${legend_y})">
    <text x="0" y="9" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}">Less</text>
`;
  for (let idx = 0; idx < palette.levels.length; idx++) {
    svg += `    <rect x="${30 + idx * 14}" y="0" width="11" height="11" rx="2" fill="${palette.levels[idx]}" stroke="${palette.level_borders[idx]}" stroke-width="0.8"/>\n`;
  }
  svg += `    <text x="${30 + 5 * 14 + 6}" y="9" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}">More</text>
  </g>
</svg>`;

  return svg;
}

let lastDailyCheckDate = "";
let cachedSvgContent = "";

async function getOrUpdateDailyContributions(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const filePath = path.join(process.cwd(), "public", "github_contributions.svg");

  if (lastDailyCheckDate === today && cachedSvgContent) {
    return cachedSvgContent;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const ghRes = await fetch("https://github.com/users/aaronnguyen26/contributions", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timeoutId);

    if (ghRes.ok) {
      const html = await ghRes.text();
      const h2Match = html.match(/([0-9,]+)\s+contributions\s+in the last year/);
      const total = h2Match ? h2Match[1] : "644";

      const rows = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
      const grid: Record<string, { date: string; level: number }> = {};

      for (let rIdx = 0; rIdx < 7; rIdx++) {
        const rowHtml = rows[rIdx + 1] || "";
        const tdMatches = [
          ...rowHtml.matchAll(
            /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g
          ),
        ];
        for (let cIdx = 0; cIdx < tdMatches.length; cIdx++) {
          grid[`${cIdx},${rIdx}`] = {
            date: tdMatches[cIdx][1],
            level: parseInt(tdMatches[cIdx][2], 10),
          };
        }
      }

      if (Object.keys(grid).length > 0) {
        const freshSvg = renderSvg(grid, total);
        cachedSvgContent = freshSvg;
        lastDailyCheckDate = today;

        try {
          fs.writeFileSync(filePath, freshSvg, "utf-8");
        } catch {}

        return freshSvg;
      }
    }
  } catch (err) {
    console.warn("Daily GitHub check deferred, using cached copy:", err);
  }

  if (!cachedSvgContent && fs.existsSync(filePath)) {
    cachedSvgContent = fs.readFileSync(filePath, "utf-8");
    lastDailyCheckDate = today;
  }

  return cachedSvgContent;
}

export async function GET() {
  const svg = await getOrUpdateDailyContributions();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
