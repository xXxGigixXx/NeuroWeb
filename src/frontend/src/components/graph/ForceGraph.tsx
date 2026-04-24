import { useCallback, useEffect, useRef, useState } from "react";
import type { Connection, Thought } from "../../types";
import { GraphEdge } from "./GraphEdge";
import { GraphNode, getNodeRadius } from "./GraphNode";

export interface SimNode {
  id: number;
  thought: Thought;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

interface ForceGraphProps {
  thoughts: Thought[];
  connections: Connection[];
  selectedId: number | null;
  onSelectThought: (id: number | null) => void;
  width: number;
  height: number;
}

// --- Force simulation helpers ---
function applyRepulsion(nodes: SimNode[], strength = 3000) {
  // strength is used in force calculation below
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist2 = dx * dx + dy * dy + 1;
      const dist = Math.sqrt(dist2);
      const force = strength / dist2;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }
}

function applyAttraction(
  connections: Connection[],
  nodeMap: Map<number, SimNode>,
  strength = 0.04,
  idealLen = 160,
) {
  for (const conn of connections) {
    const a = nodeMap.get(conn.fromId);
    const b = nodeMap.get(conn.toId);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
    const delta = (dist - idealLen) * strength;
    const fx = (dx / dist) * delta;
    const fy = (dy / dist) * delta;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }
}

function applyCenter(
  nodes: SimNode[],
  cx: number,
  cy: number,
  strength = 0.02,
) {
  for (const n of nodes) {
    n.vx += (cx - n.x) * strength;
    n.vy += (cy - n.y) * strength;
  }
}

function integrate(
  nodes: SimNode[],
  alpha: number,
  width: number,
  height: number,
) {
  const damping = 0.78;
  const padding = 60;
  for (const n of nodes) {
    if (n.fx !== null) {
      n.x = n.fx;
      n.vy = 0;
      n.vx = 0;
      continue;
    }
    if (n.fy !== null) {
      n.y = n.fy;
      n.vy = 0;
      n.vx = 0;
      continue;
    }
    n.vx *= damping;
    n.vy *= damping;
    n.x += n.vx * alpha;
    n.y += n.vy * alpha;
    n.x = Math.max(padding, Math.min(width - padding, n.x));
    n.y = Math.max(padding, Math.min(height - padding, n.y));
  }
}

export function ForceGraph({
  thoughts,
  connections,
  selectedId,
  onSelectThought,
  width,
  height,
}: ForceGraphProps) {
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const animRef = useRef<number>(0);
  const alphaRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const zoomRef = useRef(1);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Sync nodes when thoughts change
  useEffect(() => {
    const existing = new Map(nodesRef.current.map((n) => [n.id, n]));
    const newNodes: SimNode[] = thoughts.map((t) => {
      const ex = existing.get(t.id);
      if (ex) return { ...ex, thought: t };
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      return {
        id: t.id,
        thought: t,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        fx: null,
        fy: null,
      };
    });
    nodesRef.current = newNodes;
    alphaRef.current = 1;
    setNodes([...newNodes]);
  }, [thoughts, width, height]);

  // Force simulation loop
  useEffect(() => {
    const tick = () => {
      const ns = nodesRef.current;
      if (ns.length === 0 || alphaRef.current < 0.005) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      const nodeMap = new Map(ns.map((n) => [n.id, n]));
      applyRepulsion(ns, 3000);
      applyAttraction(connections, nodeMap, 0.035, 160);
      applyCenter(ns, width / 2, height / 2, 0.018);
      integrate(ns, alphaRef.current, width, height);

      alphaRef.current *= 0.98;
      setNodes([...ns]);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [connections, width, height]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).closest("[data-ocid]")) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const nx = dragRef.current.panX + dx;
    const ny = dragRef.current.panY + dy;
    panRef.current = { x: nx, y: ny };
    setTransform((t) => ({ ...t, x: nx, y: ny }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.91;
    zoomRef.current = Math.min(4, Math.max(0.2, zoomRef.current * scaleFactor));
    setTransform((t) => ({ ...t, scale: zoomRef.current }));
  }, []);

  // Touch support
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (!dragRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragRef.current.startX;
    const dy = e.touches[0].clientY - dragRef.current.startY;
    const nx = dragRef.current.panX + dx;
    const ny = dragRef.current.panY + dy;
    panRef.current = { x: nx, y: ny };
    setTransform((t) => ({ ...t, x: nx, y: ny }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current = null;
    touchRef.current = null;
  }, []);

  // Connection count map
  const connectionCountMap = new Map<number, number>();
  for (const c of connections) {
    connectionCountMap.set(
      c.fromId,
      (connectionCountMap.get(c.fromId) ?? 0) + 1,
    );
    connectionCountMap.set(c.toId, (connectionCountMap.get(c.toId) ?? 0) + 1);
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      width={width}
      height={height}
      aria-label="NeuroWeb thought network graph"
      role="img"
      style={{
        cursor: dragRef.current ? "grabbing" : "grab",
        display: "block",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <defs>
        {/* Subtle radial grid background */}
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="oklch(0.16 0.02 240)" />
          <stop offset="100%" stopColor="oklch(0.10 0 0)" />
        </radialGradient>
        <filter id="node-glow-filter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill="url(#bg-grad)" />

      {/* Grid dots for depth */}
      <pattern
        id="grid"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="20" cy="20" r="0.8" fill="oklch(0.35 0.04 240 / 0.4)" />
      </pattern>
      <rect width={width} height={height} fill="url(#grid)" />

      {/* Main transform group — pan & zoom */}
      <g
        transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
      >
        {/* Edges */}
        <g className="connection-glow">
          {connections.map((conn) => {
            const src = nodeMap.get(conn.fromId);
            const tgt = nodeMap.get(conn.toId);
            if (!src || !tgt) return null;
            const isActive =
              selectedId === conn.fromId ||
              selectedId === conn.toId ||
              hoveredId === conn.fromId ||
              hoveredId === conn.toId;
            return (
              <GraphEdge
                key={conn.id}
                sourceNode={src}
                targetNode={tgt}
                isActive={isActive}
              />
            );
          })}
        </g>

        {/* Nodes */}
        {nodes.map((node) => (
          <GraphNode
            key={node.id}
            node={node}
            isSelected={selectedId === node.id}
            isHovered={hoveredId === node.id}
            connectionCount={connectionCountMap.get(node.id) ?? 0}
            onClick={() => {
              onSelectThought(selectedId === node.id ? null : node.id);
              // Pin node briefly on click
              node.fx = node.x;
              node.fy = node.y;
              setTimeout(() => {
                node.fx = null;
                node.fy = null;
                alphaRef.current = 0.3;
              }, 800);
            }}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </g>
    </svg>
  );
}
