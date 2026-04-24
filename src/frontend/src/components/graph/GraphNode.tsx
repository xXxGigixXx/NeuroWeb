import type { SimNode } from "./ForceGraph";

interface GraphNodeProps {
  node: SimNode;
  isSelected: boolean;
  isHovered: boolean;
  connectionCount: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const BASE_RADIUS = 14;
const RADIUS_SCALE = 2.5;
const MAX_EXTRA = 12;

export function getNodeRadius(connectionCount: number): number {
  return BASE_RADIUS + Math.min(connectionCount * RADIUS_SCALE, MAX_EXTRA);
}

export function GraphNode({
  node,
  isSelected,
  isHovered,
  connectionCount,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: GraphNodeProps) {
  const r = getNodeRadius(connectionCount);
  const isActive = isSelected || isHovered;

  const coreColor = isSelected
    ? "oklch(0.85 0.18 190)"
    : isHovered
      ? "oklch(0.78 0.22 190)"
      : "oklch(0.65 0.22 190)";

  const ringColor = isSelected
    ? "oklch(0.72 0.22 190 / 0.6)"
    : isHovered
      ? "oklch(0.65 0.22 190 / 0.45)"
      : "oklch(0.55 0.22 190 / 0.2)";

  const glowFilter = isSelected
    ? `drop-shadow(0 0 ${r * 0.9}px oklch(0.65 0.22 190 / 0.85)) drop-shadow(0 0 ${r * 2}px oklch(0.55 0.22 190 / 0.45)) drop-shadow(0 0 ${r * 3.5}px oklch(0.5 0.22 190 / 0.2))`
    : isHovered
      ? `drop-shadow(0 0 ${r * 0.7}px oklch(0.65 0.22 190 / 0.7)) drop-shadow(0 0 ${r * 1.5}px oklch(0.55 0.22 190 / 0.35))`
      : `drop-shadow(0 0 ${r * 0.5}px oklch(0.55 0.22 190 / 0.5)) drop-shadow(0 0 ${r}px oklch(0.5 0.22 190 / 0.2))`;

  const title = node.thought.title;
  const shortTitle = title.length > 16 ? `${title.slice(0, 15)}…` : title;

  return (
    <g
      data-ocid={`node.item.${node.id}`}
      transform={`translate(${node.x},${node.y})`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      tabIndex={0}
      aria-label={`Thought: ${node.thought.title}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: "pointer", filter: glowFilter }}
    >
      {/* Outer glow ring */}
      <circle
        r={r + (isActive ? 6 : 3)}
        fill={ringColor}
        style={{ transition: "r 0.2s ease, fill 0.2s ease" }}
      />
      {/* Core node */}
      <circle
        r={r}
        fill={coreColor}
        style={{ transition: "r 0.2s ease, fill 0.2s ease" }}
      />
      {/* Inner highlight */}
      <circle
        r={r * 0.45}
        cx={-r * 0.18}
        cy={-r * 0.22}
        fill="oklch(1 0 0 / 0.25)"
      />
      {/* Tag badge */}
      {node.thought.tag && (
        <text
          y={-r - 6}
          textAnchor="middle"
          fontSize={8}
          fontFamily="var(--font-body), sans-serif"
          fill="oklch(0.75 0.15 280)"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {node.thought.tag}
        </text>
      )}
      {/* Label */}
      <text
        y={r + 16}
        textAnchor="middle"
        fontSize={10}
        fontFamily="var(--font-display), serif"
        fontWeight={isActive ? "600" : "400"}
        fill={isActive ? "oklch(0.92 0 0)" : "oklch(0.72 0 0)"}
        style={{
          userSelect: "none",
          pointerEvents: "none",
          transition: "fill 0.2s ease",
        }}
      >
        {shortTitle}
      </text>
    </g>
  );
}
