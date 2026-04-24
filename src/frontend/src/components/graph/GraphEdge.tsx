import type { SimNode } from "./ForceGraph";

interface GraphEdgeProps {
  sourceNode: SimNode;
  targetNode: SimNode;
  isActive: boolean;
}

export function GraphEdge({
  sourceNode,
  targetNode,
  isActive,
}: GraphEdgeProps) {
  const dx = targetNode.x - sourceNode.x;
  const dy = targetNode.y - sourceNode.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return null;

  return (
    <line
      x1={sourceNode.x}
      y1={sourceNode.y}
      x2={targetNode.x}
      y2={targetNode.y}
      stroke={
        isActive ? "oklch(0.65 0.22 190 / 0.9)" : "oklch(0.55 0.18 280 / 0.55)"
      }
      strokeWidth={isActive ? 2 : 1.5}
      className={isActive ? "connection-glow" : ""}
      style={{
        filter: isActive
          ? "drop-shadow(0 0 6px oklch(0.65 0.22 190 / 0.8)) drop-shadow(0 0 12px oklch(0.65 0.22 190 / 0.4))"
          : "drop-shadow(0 0 3px oklch(0.55 0.18 280 / 0.6)) drop-shadow(0 0 8px oklch(0.55 0.18 280 / 0.25))",
      }}
    />
  );
}
