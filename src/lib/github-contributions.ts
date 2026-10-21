import fs from "fs";
import path from "path";
import initialData from "@/data/contributions.json";

export interface ContributionCell {
  col: number;
  row: number;
  date: string;
  level: number;
  tooltip: string;
}

export interface MonthLabel {
  name: string;
  col: number;
}

export interface ContributionData {
  total: string;
  months: MonthLabel[];
  cells: ContributionCell[];
}

export const palette = {
  bg: "transparent",
  text_name: "#26211b",
  text_count: "#5b5246",
  text_muted: "#7a4a2a",
  levels: ["#ebdcc2", "#97b788", "#5b8e51", "#286332", "#8a1c1c"],
  level_borders: ["#dfcaa4", "#85a476", "#4e7e45", "#1e4f26", "#661212"],
  level_names: ["No activity", "1-3 contributions", "4-9 contributions", "10-19 contributions", "20+ contributions"],
};

export function renderContributionSvg(data: ContributionData): string {
  const maxCol = Math.max(52, ...(data.cells || []).map((c) => c.col));
  const start_x = 36;
  const start_y = 72;
  const step = 16.75;
  const cell_size = 13.0;
  const h = 230;
  const w = Math.max(960, Math.ceil(start_x + (maxCol + 1) * step + 24));

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="font-family: Georgia, serif; background:transparent;">
  <!-- Top Header: ONLY 'Aaron Nguyen' and the number, with 75px gap to guarantee zero overlap -->
  <g transform="translate(36, 34)">
    <text x="0" y="0" font-size="22" font-weight="700" fill="${palette.text_name}">Aaron Nguyen</text>
    <text x="210" y="-1" font-size="13.5" font-family="'JetBrains Mono', monospace, ui-monospace" fill="${palette.text_count}">${data.total} contributions in the last year</text>
  </g>
`;

  // Dynamically rendered Months
  for (const m of data.months) {
    svg += `  <text x="${start_x + m.col * step}" y="${start_y - 10}" font-family="'JetBrains Mono', monospace" font-size="10" fill="${palette.text_muted}">${m.name}</text>\n`;
  }

  // Days (Mon, Wed, Fri)
  svg += `  <text x="${start_x - 10}" y="${start_y + 1 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Mon</text>\n`;
  svg += `  <text x="${start_x - 10}" y="${start_y + 3 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Wed</text>\n`;
  svg += `  <text x="${start_x - 10}" y="${start_y + 5 * step + 10}" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="${palette.text_muted}" text-anchor="end">Fri</text>\n`;

  // Grid Cells
  for (const cell of data.cells) {
    const lvl = Math.min(Math.max(cell.level || 0, 0), 4);
    const fill = palette.levels[lvl];
    const border = palette.level_borders[lvl];
    const cx = start_x + cell.col * step;
    const cy = start_y + cell.row * step;
    const tooltipText = cell.tooltip || `${cell.date}: level ${lvl}`;
    const safeTitle = tooltipText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    svg += `  <rect x="${cx}" y="${cy}" width="${cell_size}" height="${cell_size}" rx="2.5" fill="${fill}" stroke="${border}" stroke-width="0.8"><title>${safeTitle}</title></rect>\n`;
  }

  const legend_y = start_y + 7 * step + 18;
  const legend_end_x = start_x + maxCol * step + cell_size;
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

export async function fetchFromGraphQL(username: string, token: string): Promise<ContributionData | null> {
  const gqlQuery = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                date
                weekday
              }
            }
            months {
              name
              firstDay
              totalWeeks
            }
          }
        }
      }
    }
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-contributions-updater",
    },
    body: JSON.stringify({ query: gqlQuery, variables: { login: username } }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!res.ok) return null;

  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;

  const total = String(cal.totalContributions);
  const cells: ContributionCell[] = [];

  const levelMap: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };

  for (let w = 0; w < cal.weeks.length; w++) {
    const week = cal.weeks[w];
    for (const day of week.contributionDays) {
      const lvl = levelMap[day.contributionLevel] ?? 0;
      const count = day.contributionCount;
      const countLabel = count === 1 ? "1 contribution" : `${count} contributions`;
      cells.push({
        col: w,
        row: day.weekday,
        date: day.date,
        level: lvl,
        tooltip: `${countLabel} on ${day.date}`,
      });
    }
  }

  const months: MonthLabel[] = [];
  let lastMonth = "";
  for (let w = 0; w < cal.weeks.length; w++) {
    const firstDay = cal.weeks[w].contributionDays[0];
    if (firstDay) {
      const d = new Date(firstDay.date + "T00:00:00Z");
      const mName = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      if (mName !== lastMonth) {
        months.push({ name: mName, col: w });
        lastMonth = mName;
      }
    }
  }

  return { total, months, cells };
}

export async function fetchFromPublicScrape(username: string): Promise<ContributionData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  const ghRes = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!ghRes.ok) return null;

  const html = await ghRes.text();
  const h2Match = html.match(/([0-9,]+)\s+contributions\s+in the last year/);
  const total = h2Match ? h2Match[1] : "710";

  // Dynamic month labels from thead
  const monthMatches = [
    ...html.matchAll(
      /<td class="ContributionCalendar-label"[^>]*colspan="(\d+)"[^>]*>[\s\S]*?<span aria-hidden="true"[^>]*>([^<]+)<\/span>/g
    ),
  ];

  const months: MonthLabel[] = [];
  let curCol = 0;
  for (const m of monthMatches) {
    const colspan = parseInt(m[1], 10);
    const name = m[2].trim();
    months.push({ name, col: curCol });
    curCol += colspan;
  }

  // Tooltip dictionary
  const tooltips: Record<string, string> = {};
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)) {
    tooltips[m[1]] = m[2].trim();
  }

  // Day cells
  const dayTags = [
    ...html.matchAll(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g),
  ].map((m) => m[0]);

  // First collect all valid dates to determine the true calendar start Sunday
  const parsedDays: { date: string; level: number; cellId: string }[] = [];
  for (const tag of dayTags) {
    const dateMatch = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/);
    const levelMatch = tag.match(/data-level="(\d+)"/);
    const idMatch = tag.match(/id="([^"]+)"/);

    if (dateMatch && levelMatch) {
      parsedDays.push({
        date: dateMatch[1],
        level: parseInt(levelMatch[1], 10),
        cellId: idMatch ? idMatch[1] : "",
      });
    }
  }

  if (parsedDays.length === 0) return null;

  // Sort chronologically to find the true first date
  parsedDays.sort((a, b) => a.date.localeCompare(b.date));

  // Determine the Sunday that anchors column 0
  const firstDate = new Date(parsedDays[0].date + "T00:00:00Z");
  const startSunday = new Date(firstDate);
  startSunday.setUTCDate(firstDate.getUTCDate() - firstDate.getUTCDay());

  const cells: ContributionCell[] = [];
  for (const day of parsedDays) {
    const curDate = new Date(day.date + "T00:00:00Z");
    const diffDays = Math.round(
      (curDate.getTime() - startSunday.getTime()) / 86400000
    );
    const row = curDate.getUTCDay();
    const col = Math.floor(diffDays / 7);

    const tooltip = tooltips[day.cellId] || `${day.date}: level ${day.level}`;
    cells.push({
      col,
      row,
      date: day.date,
      level: day.level,
      tooltip,
    });
  }

  return { total, months, cells };
}

// In-memory cache with 15-minute expiration
let cachedContributionData: ContributionData | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function getOrUpdateContributionData(forceRefresh = false): Promise<ContributionData> {
  const now = Date.now();

  if (!forceRefresh && cachedContributionData && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedContributionData;
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  let data: ContributionData | null = null;

  // Tier 1: GraphQL with token (immune to IP rate limits)
  if (token) {
    try {
      data = await fetchFromGraphQL("aaronnguyen26", token);
    } catch (err) {
      console.warn("GraphQL contributions fetch failed, proceeding to scrape:", err);
    }
  }

  // Tier 2: Public scrape with dynamic calculations
  if (!data) {
    try {
      data = await fetchFromPublicScrape("aaronnguyen26");
    } catch (err) {
      console.warn("Public scrape contributions fetch failed, proceeding to fallback:", err);
    }
  }

  // If live data was acquired, update memory and write to disk where permitted
  if (data) {
    cachedContributionData = data;
    lastFetchTimestamp = now;

    // In local dev or build script, sync disk copies
    try {
      const jsonPath = path.join(process.cwd(), "src", "data", "contributions.json");
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");

      const svgPath = path.join(process.cwd(), "public", "github_contributions.svg");
      fs.writeFileSync(svgPath, renderContributionSvg(data), "utf-8");
    } catch {
      // Safe ignore in read-only environments (e.g. Vercel production serverless)
    }

    return data;
  }

  // Tier 3: Disk / initial fallback
  if (cachedContributionData) {
    return cachedContributionData;
  }

  try {
    const jsonPath = path.join(process.cwd(), "src", "data", "contributions.json");
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, "utf-8");
      cachedContributionData = JSON.parse(fileContent);
      lastFetchTimestamp = now;
      return cachedContributionData!;
    }
  } catch {}

  cachedContributionData = initialData as ContributionData;
  lastFetchTimestamp = now;
  return cachedContributionData;
}
