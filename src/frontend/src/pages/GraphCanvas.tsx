import { Brain, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThoughtInspectorPanel } from "../components/ThoughtInspectorPanel";
import { Toolbar } from "../components/Toolbar";
import { ForceGraph } from "../components/graph/ForceGraph";
import { useNeuroStore } from "../store/useNeuroStore";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handler = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

export default function GraphCanvas() {
  const thoughts = useNeuroStore((s) => s.thoughts);
  const connections = useNeuroStore((s) => s.connections);
  const selectedId = useNeuroStore((s) => s.selectedThoughtId);
  const selectThought = useNeuroStore((s) => s.selectThought);
  const { width, height } = useWindowSize();

  return (
    <div
      data-ocid="graph.canvas"
      className="relative overflow-hidden"
      style={{ width, height, background: "oklch(0.10 0 0)" }}
    >
      {/* Graph */}
      {thoughts.length === 0 ? (
        <EmptyState />
      ) : (
        <ForceGraph
          thoughts={thoughts}
          connections={connections}
          selectedId={selectedId}
          onSelectThought={selectThought}
          width={width}
          height={height}
        />
      )}

      {/* Zoom hint overlay */}
      <ZoomHint />

      {/* Toolbar — fixed bottom center */}
      <Toolbar />

      {/* Thought inspector panel — fixed right side when a thought is selected */}
      <ThoughtInspectorPanel />
    </div>
  );
}

function EmptyState() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      data-ocid="graph.empty_state"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
    >
      {/* Decorative glowing orb */}
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 190 / 0.25) 0%, oklch(0.55 0.22 190 / 0.05) 60%, transparent 100%)",
          boxShadow:
            "0 0 40px oklch(0.65 0.22 190 / 0.3), 0 0 80px oklch(0.55 0.22 190 / 0.12)",
        }}
      >
        <Brain
          size={48}
          style={{
            color: "oklch(0.72 0.22 190)",
            filter: "drop-shadow(0 0 12px oklch(0.65 0.22 190 / 0.8))",
          }}
        />
      </div>

      <div className="text-center space-y-2 px-8">
        <h2
          className="text-2xl font-display font-semibold"
          style={{ color: "oklch(0.88 0.04 190)" }}
        >
          Your neural network awaits
        </h2>
        <p className="text-sm font-body" style={{ color: "oklch(0.52 0 0)" }}>
          Add your first thought to begin mapping your mind.
          <br />
          Every great network starts with a single node.
        </p>
      </div>

      {/* Animated rings — disabled for prefers-reduced-motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[160, 240, 330].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                borderColor: `oklch(0.55 0.22 190 / ${0.12 - (size - 160) * 0.00025})`,
                animation: `ping ${2 + size * 0.005}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${(size - 160) * 0.003}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoomHint() {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), 3500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl px-3 py-2 pointer-events-none"
      style={{
        background: "oklch(0.14 0 0 / 0.7)",
        border: "1px solid oklch(0.3 0 0 / 0.4)",
        color: "oklch(0.45 0 0)",
        fontSize: 11,
        fontFamily: "var(--font-body), sans-serif",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <ZoomIn size={12} />
      <span>Scroll to zoom</span>
      <span style={{ color: "oklch(0.3 0 0)" }}>·</span>
      <Maximize2 size={12} />
      <span>Drag to pan</span>
      <ZoomOut size={12} style={{ display: "none" }} />
    </div>
  );
}
