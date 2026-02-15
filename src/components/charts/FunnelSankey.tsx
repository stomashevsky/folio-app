"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import type { SankeyFunnelData, SankeyLink, SankeyLinkType } from "@/lib/types";
import { formatNumber } from "@/lib/utils/format";
import { CHART_COLORS } from "@/lib/constants/chart-colors";

/* ─── Props ─── */
export type SankeyMetric = "counts" | "rates";

interface FunnelSankeyProps {
  data: SankeyFunnelData;
  metric?: SankeyMetric;
}

/* ─── Constants ─── */
const VIEWBOX_W = 960;
const VIEWBOX_H = 420;
const NODE_WIDTH = 12;

const LINK_COLORS: Record<SankeyLinkType, string> = {
  success: CHART_COLORS.success,
  failure: CHART_COLORS.danger,
  abandon: CHART_COLORS.neutral,
};

const LINK_OPACITY: Record<SankeyLinkType, number> = {
  success: 0.18,
  failure: 0.30,
  abandon: 0.15,
};

const LINK_HOVER_OPACITY: Record<SankeyLinkType, number> = {
  success: 0.38,
  failure: 0.50,
  abandon: 0.30,
};

/* ─── Node Layout ─── */
interface NodeLayout {
  x: number;
  y: number;
  height: number;
}

const NODE_LAYOUTS: NodeLayout[] = [
  /* 0  Created          */ { x: 60,  y: 62,  height: 36 },
  /* 1  Started          */ { x: 177, y: 62,  height: 36 },
  /* 2  Doc Uploaded     */ { x: 294, y: 62,  height: 36 },
  /* 3  Doc Passed       */ { x: 411, y: 62,  height: 36 },
  /* 4  Doc Failed       */ { x: 411, y: 230, height: 24 },
  /* 5  Selfie Captured  */ { x: 529, y: 62,  height: 36 },
  /* 6  Selfie Passed    */ { x: 646, y: 62,  height: 36 },
  /* 7  Selfie Failed    */ { x: 646, y: 230, height: 24 },
  /* 8  Completed        */ { x: 763, y: 62,  height: 36 },
  /* 9  Approved         */ { x: 880, y: 52,  height: 36 },
  /* 10 Declined         */ { x: 880, y: 230, height: 24 },
  /* 11 Abandoned        */ { x: 177, y: 330, height: 24 },
];

/* ─── Utilities ─── */
const MIN_THICKNESS = 2;
const MAX_THICKNESS = 28;

function getLinkThickness(value: number, maxValue: number): number {
  if (maxValue === 0) return MIN_THICKNESS;
  const ratio = value / maxValue;
  return Math.max(MIN_THICKNESS, Math.round(ratio * MAX_THICKNESS));
}

/** Check if a link goes downward (branch to failure/abandon row) */
function isDownwardLink(link: SankeyLink): boolean {
  const sl = NODE_LAYOUTS[link.source];
  const tl = NODE_LAYOUTS[link.target];
  return tl.y > sl.y + sl.height;
}

/** Allocate vertical port positions for multiple links on a node's edge */
function allocatePorts(
  nodeIndex: number,
  links: SankeyLink[],
  thicknesses: number[],
  side: "source" | "target",
): Map<number, number> {
  const attached = links
    .map((link, i) => ({ link, i, thickness: thicknesses[i] }))
    .filter(({ link }) =>
      side === "source" ? link.source === nodeIndex : link.target === nodeIndex,
    )
    // Only allocate horizontal links on the side ports
    .filter(({ link }) => !isDownwardLink(link));

  if (attached.length <= 1) {
    const result = new Map<number, number>();
    for (const { i } of attached) {
      const layout = NODE_LAYOUTS[nodeIndex];
      result.set(i, layout.y + layout.height / 2);
    }
    return result;
  }

  // Sort: top-most targets/sources first
  attached.sort((a, b) => {
    const aY = side === "source"
      ? NODE_LAYOUTS[a.link.target].y
      : NODE_LAYOUTS[a.link.source].y;
    const bY = side === "source"
      ? NODE_LAYOUTS[b.link.target].y
      : NODE_LAYOUTS[b.link.source].y;
    return aY - bY;
  });

  const layout = NODE_LAYOUTS[nodeIndex];
  const gap = 2;
  const totalThickness = attached.reduce((s, a) => s + a.thickness, 0);
  const totalGaps = (attached.length - 1) * gap;
  const nodeCenter = layout.y + layout.height / 2;
  let currentY = nodeCenter - (totalThickness + totalGaps) / 2;

  const result = new Map<number, number>();
  for (const { i, thickness } of attached) {
    result.set(i, currentY + thickness / 2);
    currentY += thickness + gap;
  }
  return result;
}

/** Build SVG path for a filled Bezier ribbon */
function computeLinkPath(
  link: SankeyLink,
  thickness: number,
  sourcePorts: Map<number, number>,
  targetPorts: Map<number, number>,
  linkIndex: number,
): string {
  const sl = NODE_LAYOUTS[link.source];
  const tl = NODE_LAYOUTS[link.target];
  const half = thickness / 2;

  if (isDownwardLink(link)) {
    // Downward branch: exit from bottom center of source, enter top center of target
    const sx = sl.x + NODE_WIDTH / 2;
    const sy = sl.y + sl.height;
    const tx = tl.x + NODE_WIDTH / 2;
    const ty = tl.y;
    const dy = ty - sy;
    const cpy1 = sy + dy * 0.5;
    const cpy2 = ty - dy * 0.5;

    return [
      `M${sx - half},${sy}`,
      `C${sx - half},${cpy1} ${tx - half},${cpy2} ${tx - half},${ty}`,
      `L${tx + half},${ty}`,
      `C${tx + half},${cpy2} ${sx + half},${cpy1} ${sx + half},${sy}`,
      "Z",
    ].join(" ");
  }

  // Horizontal link: exit right edge → enter left edge
  const sx = sl.x + NODE_WIDTH;
  const sy = sourcePorts.get(linkIndex) ?? sl.y + sl.height / 2;
  const tx = tl.x;
  const ty = targetPorts.get(linkIndex) ?? tl.y + tl.height / 2;
  const dx = tx - sx;
  const cpx1 = sx + dx * 0.4;
  const cpx2 = tx - dx * 0.4;

  return [
    `M${sx},${sy - half}`,
    `C${cpx1},${sy - half} ${cpx2},${ty - half} ${tx},${ty - half}`,
    `L${tx},${ty + half}`,
    `C${cpx2},${ty + half} ${cpx1},${sy + half} ${sx},${sy + half}`,
    "Z",
  ].join(" ");
}

/** Compute link fill opacity based on hover state */
function getLinkFillOpacity(
  linkIndex: number,
  linkType: SankeyLinkType,
  hoveredNode: number | null,
  hoveredLink: number | null,
  links: SankeyLink[],
): number {
  const base = LINK_OPACITY[linkType];
  const hover = LINK_HOVER_OPACITY[linkType];

  if (hoveredLink !== null) {
    return linkIndex === hoveredLink ? hover : base * 0.4;
  }
  if (hoveredNode !== null) {
    const link = links[linkIndex];
    const connected = link.source === hoveredNode || link.target === hoveredNode;
    return connected ? hover : base * 0.4;
  }
  return base;
}

/* ─── Tooltip state ─── */
interface TooltipInfo {
  type: "node" | "link";
  index: number;
  x: number;
  y: number;
}

/* ─── Main Component ─── */
export function FunnelSankey({ data, metric = "counts" }: FunnelSankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [containerWidth, setContainerWidth] = useState(960);

  /* Pre-compute thicknesses */
  const { thicknesses } = useMemo(() => {
    const mv = Math.max(...data.links.map((l) => l.value), 1);
    return {
      thicknesses: data.links.map((l) => getLinkThickness(l.value, mv)),
    };
  }, [data]);

  /* Pre-compute port allocations */
  const { sourcePorts, targetPorts } = useMemo(() => {
    const sp = new Map<number, number>();
    const tp = new Map<number, number>();
    for (let n = 0; n < data.nodes.length; n++) {
      const sPorts = allocatePorts(n, data.links, thicknesses, "source");
      const tPorts = allocatePorts(n, data.links, thicknesses, "target");
      sPorts.forEach((v, k) => sp.set(k, v));
      tPorts.forEach((v, k) => tp.set(k, v));
    }
    return { sourcePorts: sp, targetPorts: tp };
  }, [data, thicknesses]);

  /* Pre-compute link paths */
  const linkPaths = useMemo(
    () =>
      data.links.map((link, i) =>
        computeLinkPath(link, thicknesses[i], sourcePorts, targetPorts, i),
      ),
    [data, thicknesses, sourcePorts, targetPorts],
  );

  /* Render order: abandon → failure → success (so success is visually on top) */
  const linkOrder = useMemo(() => {
    const priority: Record<SankeyLinkType, number> = { abandon: 0, failure: 1, success: 2 };
    return [...data.links.keys()].sort(
      (a, b) => priority[data.links[a].type] - priority[data.links[b].type],
    );
  }, [data]);

  /* Update container width on mount and resize */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setContainerWidth(container.clientWidth);
    const handleResize = () => {
      if (container) setContainerWidth(container.clientWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Mouse handlers */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent, type: "node" | "link", index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({ type, index, x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [],
  );

  const clearHover = useCallback(() => {
    setHoveredNode(null);
    setHoveredLink(null);
    setTooltip(null);
  }, []);

  /* Tooltip content */
  const tooltipContent = useMemo(() => {
    if (!tooltip) return null;
    const total = data.nodes[0]?.count || 1;

    if (tooltip.type === "node") {
      const node = data.nodes[tooltip.index];
      const overallRate = Math.round((node.count / total) * 1000) / 10;
      return (
        <>
          <p className="text-sm font-medium text-[var(--color-text)]">{node.name}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {formatNumber(node.count)} inquiries
            {tooltip.index > 0 && (
              <span className="text-[var(--color-text-tertiary)]"> · {overallRate}% of total</span>
            )}
          </p>
        </>
      );
    }
    const link = data.links[tooltip.index];
    const source = data.nodes[link.source];
    const target = data.nodes[link.target];
    const pct = source.count > 0 ? Math.round((link.value / source.count) * 1000) / 10 : 0;
    return (
      <>
        <p className="text-xs text-[var(--color-text)]">
          {source.name} → {target.name}
        </p>
        <p className="text-sm font-medium text-[var(--color-text)] mt-0.5">
          {formatNumber(link.value)}{" "}
          <span className="text-xs text-[var(--color-text-tertiary)]">({pct}%)</span>
        </p>
      </>
    );
  }, [tooltip, data]);

  return (
    <div ref={containerRef} className="relative" style={{ height: 420 }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Links layer */}
        <g>
          {linkOrder.map((i) => {
            const link = data.links[i];
            return (
              <path
                key={`link-${i}`}
                d={linkPaths[i]}
                fill={LINK_COLORS[link.type]}
                fillOpacity={getLinkFillOpacity(i, link.type, hoveredNode, hoveredLink, data.links)}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseMove={(e) => handleMouseMove(e, "link", i)}
                onMouseLeave={clearHover}
                style={{ cursor: "pointer", transition: "fill-opacity 150ms ease" }}
              />
            );
          })}
        </g>

        {/* Nodes layer */}
        <g>
          {data.nodes.map((node, i) => {
            const layout = NODE_LAYOUTS[i];
            if (!layout) return null;
            const labelX = layout.x + NODE_WIDTH + 8;
            const labelYName = layout.y + layout.height / 2 - 6;
            const labelYCount = layout.y + layout.height / 2 + 9;

            const total = data.nodes[0]?.count || 1;
            const rate = Math.round((node.count / total) * 1000) / 10;
            const countLabel =
              metric === "rates" && i > 0
                ? `${rate}% · ${formatNumber(node.count)}`
                : formatNumber(node.count);

            return (
              <g
                key={`node-${i}`}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseMove={(e) => handleMouseMove(e, "node", i)}
                onMouseLeave={clearHover}
                style={{ cursor: "pointer" }}
              >
                {/* Hit area */}
                <rect
                  x={layout.x - 4}
                  y={layout.y - 4}
                  width={NODE_WIDTH + 8}
                  height={layout.height + 8}
                  fill="transparent"
                />
                {/* Node bar */}
                <rect
                  x={layout.x}
                  y={layout.y}
                  width={NODE_WIDTH}
                  height={layout.height}
                  fill={node.color}
                  rx={3}
                  ry={3}
                  opacity={hoveredNode === i ? 1 : 0.85}
                  style={{ transition: "opacity 150ms ease" }}
                />
                {/* Label: name */}
                <text
                  x={labelX}
                  y={labelYName}
                  fill="var(--color-text)"
                  fontSize={11}
                  fontWeight={500}
                  dominantBaseline="auto"
                >
                  {node.name}
                </text>
                {/* Label: count / rate */}
                <text
                  x={labelX}
                  y={labelYCount}
                  fill="var(--color-text-tertiary)"
                  fontSize={10}
                  dominantBaseline="auto"
                >
                  {countLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* HTML tooltip overlay */}
      {tooltip && tooltipContent && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 shadow-lg"
          style={{
            left: Math.min(tooltip.x + 12, containerWidth - 180),
            top: Math.max(tooltip.y - 10, 0),
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
