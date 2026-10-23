"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import initialData from "@/data/contributions.json";

interface ContributionCell {
  col: number;
  row: number;
  date: string;
  level: number;
  tooltip: string;
}

interface MonthLabel {
  name: string;
  col: number;
}

interface ContributionData {
  total: string;
  months: MonthLabel[];
  cells: ContributionCell[];
}

const palette = {
  bg: "transparent",
  text_name: "#26211b",
  text_count: "#5b5246",
  text_muted: "#7a4a2a",
  levels: ["#ebdcc2", "#97b788", "#5b8e51", "#286332", "#134e23"],
  level_borders: ["#dfcaa4", "#85a476", "#4e7e45", "#1e4f26", "#0c3517"],
  level_names: ["No activity", "1-3 contributions", "4-9 contributions", "10-19 contributions", "20+ contributions"],
};

interface TooltipCoords {
  cx: number;
  cy: number;
  tipX: number;
  tipY: number;
  tipWidth: number;
  tipHeight: number;
  localArrowX: number;
  arrowDir: "up" | "down";
}

export default function GitHubContributionGraph() {
  const [data, setData] = useState<ContributionData>(initialData as ContributionData);
  const [hoveredCell, setHoveredCell] = useState<ContributionCell | null>(null);
  const [pinnedCell, setPinnedCell] = useState<ContributionCell | null>(null);
  const [activeLegendLevel, setActiveLegendLevel] = useState<number | null>(null);
  const [lastCoords, setLastCoords] = useState<TooltipCoords | null>(null);

  // Background live update check
  useEffect(() => {
    let isMounted = true;
    const hourStamp = new Date().toISOString().slice(0, 13);
    fetch(`/api/contributions?t=${hourStamp}`, { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API route returned non-200");
      })
      .then((fresh: ContributionData) => {
        if (isMounted && fresh && fresh.cells && fresh.cells.length > 0) {
          setData(fresh);
        }
      })
      .catch(() => {
        // Safe fallback: initialData is already loaded
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic layout constants matching the dataset
  const start_x = 36;
  const start_y = 72;
  const step = 16.75;
  const cell_size = 13.0;
  const h = 230;

  const maxCol = useMemo(() => {
    if (!data.cells || data.cells.length === 0) return 52;
    return Math.max(52, ...data.cells.map((c) => c.col));
  }, [data.cells]);

  const w = useMemo(() => Math.max(960, Math.ceil(start_x + (maxCol + 1) * step + 24)), [maxCol]);

  // Format date helper for tooltip
  const formatCellDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      return dt.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to extract contribution count text
  const getContributionText = (tooltip: string) => {
    if (!tooltip || tooltip.startsWith("No contributions")) {
      return "0 contributions";
    }
    const match = tooltip.match(/^(\d+)\s+contribution/);
    if (match) {
      const count = parseInt(match[1], 10);
      return count === 1 ? "1 contribution" : `${count} contributions`;
    }
    return tooltip;
  };

  // Hover always takes precedence while inside grid; pinnedCell anchors when outside
  const activeCell = hoveredCell || pinnedCell;

  // Compute floating tooltip coordinates in SVG space
  const tooltipCoords = useMemo<TooltipCoords | null>(() => {
    if (!activeCell) return null;
    const cx = start_x + activeCell.col * step + cell_size / 2;
    const cy = start_y + activeCell.row * step + cell_size / 2;
    const tipWidth = 186;
    const tipHeight = 36;

    // Adjust X so it never clips off the SVG edges
    let tipX = cx - tipWidth / 2;
    if (tipX < start_x - 10) tipX = start_x - 10;
    if (tipX + tipWidth > w - 16) tipX = w - 16 - tipWidth;

    // Arrow X relative to tooltip card
    const localArrowX = cx - tipX;

    // If top 2 rows, position bubble below cell; otherwise position above
    const isBelow = activeCell.row <= 1;
    const tipY = isBelow ? cy + cell_size / 2 + 8 : cy - cell_size / 2 - 8 - tipHeight;
    const arrowDir = isBelow ? "up" : "down";

    return { cx, cy, tipX, tipY, tipWidth, tipHeight, localArrowX, arrowDir };
  }, [activeCell]);

  // Keep last coords so tooltip fades out in place without teleporting to (0,0)
  useEffect(() => {
    if (tooltipCoords) {
      setLastCoords(tooltipCoords);
    }
  }, [tooltipCoords]);

  const displayCoords = tooltipCoords || lastCoords;

  const handleCellClick = (cell: ContributionCell, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinnedCell?.date === cell.date) {
      setPinnedCell(null);
    } else {
      setPinnedCell(cell);
      setHoveredCell(cell);
    }
  };

  const handleGridLeave = () => {
    setHoveredCell(null);
  };

  return (
    <section className="contrib-section-bottom" aria-label="GitHub Contributions Calendar">
      <div
        className="contrib-workbench-card"
        onClick={() => setPinnedCell(null)}
      >
        <span className="tape" />

        {/* Horizontally scrollable container with interactive SVG embedded directly into the DOM */}
        <div
          className="contrib-scroll"
          onMouseLeave={handleGridLeave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${w} ${h}`}
            width="100%"
            height="100%"
            className="contrib-interactive-svg"
            style={{
              fontFamily: "Georgia, serif",
              background: "transparent",
              overflow: "visible",
            }}
          >
            <defs>
              <filter id="tooltip-card-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(38,33,27,0.28)" />
              </filter>
            </defs>

            {/* Top Header: Clean 'Aaron Nguyen' title */}
            <g transform="translate(36, 34)">
              <text x="0" y="0" fontSize="22" fontWeight="700" fill={palette.text_name}>
                Aaron Nguyen
              </text>
            </g>

            {/* Months (Dynamic from dataset) */}
            {data.months.map((m, idx) => (
              <text
                key={`${m.name}-${idx}`}
                x={start_x + m.col * step}
                y={start_y - 10}
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fill={palette.text_muted}
              >
                {m.name}
              </text>
            ))}

            {/* Days of Week (Mon, Wed, Fri) */}
            <text
              x={start_x - 10}
              y={start_y + 1 * step + 10}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9.5"
              fill={palette.text_muted}
              textAnchor="end"
            >
              Mon
            </text>
            <text
              x={start_x - 10}
              y={start_y + 3 * step + 10}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9.5"
              fill={palette.text_muted}
              textAnchor="end"
            >
              Wed
            </text>
            <text
              x={start_x - 10}
              y={start_y + 5 * step + 10}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9.5"
              fill={palette.text_muted}
              textAnchor="end"
            >
              Fri
            </text>

            {/* Grid Cells: Interactive DOM Elements */}
            <g className="contrib-grid-layer">
              {data.cells.map((cell) => {
                const cx = start_x + cell.col * step;
                const cy = start_y + cell.row * step;
                const lvl = Math.min(Math.max(cell.level || 0, 0), 4);
                const fill = palette.levels[lvl];
                const border = palette.level_borders[lvl];

                // Legend filter opacity
                const isDimmed = activeLegendLevel !== null && activeLegendLevel !== lvl;

                return (
                  <rect
                    key={cell.date}
                    x={cx}
                    y={cy}
                    width={cell_size}
                    height={cell_size}
                    rx="2.5"
                    fill={fill}
                    stroke={border}
                    strokeWidth={0.8}
                    className="contrib-cell"
                    style={{
                      cursor: "pointer",
                      opacity: isDimmed ? 0.22 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onClick={(e) => handleCellClick(cell, e)}
                    tabIndex={-1}
                    aria-label={`${cell.date}: ${cell.tooltip}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCellClick(cell, e as unknown as React.MouseEvent);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* Pinned Cell Anchor Marker (if inspecting a different day) */}
            {pinnedCell && pinnedCell.date !== activeCell?.date && (
              <rect
                x={start_x + pinnedCell.col * step - 1.5}
                y={start_y + pinnedCell.row * step - 1.5}
                width={cell_size + 3}
                height={cell_size + 3}
                rx="3.5"
                fill="none"
                stroke="#8a1c1c"
                strokeWidth="1.8"
                strokeDasharray="2.5 1.5"
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Smooth Floating Active Cell Highlight Ring (Glides across grid) */}
            {activeCell && (
              <rect
                x={start_x + activeCell.col * step - 1.5}
                y={start_y + activeCell.row * step - 1.5}
                width={cell_size + 3}
                height={cell_size + 3}
                rx="3.5"
                fill="none"
                stroke={pinnedCell?.date === activeCell.date ? "#8a1c1c" : "#1e1915"}
                strokeWidth={pinnedCell?.date === activeCell.date ? "2.2" : "1.8"}
                style={{
                  pointerEvents: "none",
                  transition: "x 0.12s cubic-bezier(0.16, 1, 0.3, 1), y 0.12s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.15s ease",
                }}
              />
            )}

            {/* Floating Interactive Tooltip: Smooth GPU-gliding single container */}
            {displayCoords && (
              <g
                className="contrib-floating-tooltip"
                style={{
                  pointerEvents: "none",
                  opacity: activeCell ? 1 : 0,
                  transform: `translate3d(${displayCoords.tipX}px, ${displayCoords.tipY}px, 0)`,
                  transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease",
                }}
              >
                {/* Tooltip Background Card */}
                <rect
                  x="0"
                  y="0"
                  width={displayCoords.tipWidth}
                  height={displayCoords.tipHeight}
                  rx="6"
                  fill="#fffdf8"
                  stroke="#26211b"
                  strokeWidth="1.2"
                  filter="url(#tooltip-card-shadow)"
                />

                {/* Arrow Pointer Notch */}
                {displayCoords.arrowDir === "down" ? (
                  <path
                    d={`M ${displayCoords.localArrowX - 5} ${displayCoords.tipHeight} L ${displayCoords.localArrowX} ${displayCoords.tipHeight + 6} L ${displayCoords.localArrowX + 5} ${displayCoords.tipHeight} Z`}
                    fill="#fffdf8"
                    stroke="#26211b"
                    strokeWidth="1.2"
                  />
                ) : (
                  <path
                    d={`M ${displayCoords.localArrowX - 5} 0 L ${displayCoords.localArrowX} -6 L ${displayCoords.localArrowX + 5} 0 Z`}
                    fill="#fffdf8"
                    stroke="#26211b"
                    strokeWidth="1.2"
                  />
                )}

                {/* Inner cover to clean arrow border overlap */}
                {displayCoords.arrowDir === "down" ? (
                  <rect
                    x={displayCoords.localArrowX - 4}
                    y={displayCoords.tipHeight - 1}
                    width={8}
                    height={2}
                    fill="#fffdf8"
                  />
                ) : (
                  <rect
                    x={displayCoords.localArrowX - 4}
                    y="0"
                    width={8}
                    height={2}
                    fill="#fffdf8"
                  />
                )}

                {/* Contribution Count (Bold JetBrains Mono) */}
                <text
                  x="12"
                  y="16"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="11.5"
                  fontWeight="700"
                  fill="#134e23"
                >
                  {activeCell ? getContributionText(activeCell.tooltip) : ""}
                </text>

                {/* Full Formatted Date */}
                <text
                  x="12"
                  y="28"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="9.5"
                  fill="#5b5246"
                >
                  {activeCell ? formatCellDate(activeCell.date) : ""}
                </text>
              </g>
            )}

            {/* Bottom Legend: Interactive Less -> More with hover filtering */}
            {(() => {
              const legend_y = start_y + 7 * step + 18;
              const legend_end_x = start_x + maxCol * step + cell_size;
              const legend_start_x = legend_end_x - 140;

              return (
                <g transform={`translate(${legend_start_x}, ${legend_y})`}>
                  <text
                    x="0"
                    y="9"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="9.5"
                    fill={palette.text_muted}
                  >
                    Less
                  </text>

                  {palette.levels.map((lvlFill, idx) => {
                    const isHovered = activeLegendLevel === idx;
                    return (
                      <rect
                        key={idx}
                        x={30 + idx * 14}
                        y="0"
                        width="11"
                        height="11"
                        rx="2"
                        fill={lvlFill}
                        stroke={isHovered ? "#26211b" : palette.level_borders[idx]}
                        strokeWidth={isHovered ? 1.5 : 0.8}
                        className="contrib-legend-swatch"
                        style={{
                          cursor: "pointer",
                          transformOrigin: `${30 + idx * 14 + 5.5}px 5.5px`,
                          transform: isHovered ? "scale(1.25)" : "scale(1)",
                          transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={() => setActiveLegendLevel(idx)}
                        onMouseLeave={() => setActiveLegendLevel(null)}
                      >
                        <title>{`${palette.level_names[idx]}: Level ${idx}`}</title>
                      </rect>
                    );
                  })}

                  <text
                    x={30 + 5 * 14 + 6}
                    y="9"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="9.5"
                    fill={palette.text_muted}
                  >
                    More
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>
    </section>
  );
}
