import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Connection, NeuroStore, Thought } from "../types";

let thoughtIdCounter = 1;
let connectionIdCounter = 1;

const SAMPLE_THOUGHTS: Omit<Thought, "createdAt">[] = [
  {
    id: 1,
    title: "Consciousness",
    description:
      "The hard problem of why there is subjective experience at all — qualia, awareness, the 'what it is like' of being.",
    tag: "Philosophy",
  },
  {
    id: 2,
    title: "Neuroplasticity",
    description:
      "The brain's ability to rewire itself through learning, practice, and experience throughout life.",
    tag: "Neuroscience",
  },
  {
    id: 3,
    title: "Flow State",
    description:
      "Optimal experience where challenge and skill perfectly align — time dissolves, performance peaks.",
    tag: "Psychology",
  },
  {
    id: 4,
    title: "Emergence",
    description:
      "Complex patterns and behaviours arising from simple rules. The whole becomes greater than the sum of its parts.",
    tag: "Systems",
  },
  {
    id: 5,
    title: "Memory Consolidation",
    description:
      "How short-term memories are converted to long-term storage during sleep and repetition.",
    tag: "Neuroscience",
  },
];

const SAMPLE_CONNECTIONS: Connection[] = [
  { id: 1, fromId: 1, toId: 2 },
  { id: 2, fromId: 1, toId: 3 },
  { id: 3, fromId: 2, toId: 5 },
  { id: 4, fromId: 3, toId: 4 },
  { id: 5, fromId: 4, toId: 2 },
];

const now = Date.now();

const SEED_THOUGHTS: Thought[] = SAMPLE_THOUGHTS.map((t) => ({
  ...t,
  createdAt: now,
}));

export const useNeuroStore = create<NeuroStore>()(
  persist(
    (set, get) => ({
      thoughts: SEED_THOUGHTS,
      connections: SAMPLE_CONNECTIONS,
      selectedThoughtId: null,

      addThought: (title, description, tag) => {
        const state = get();
        const maxId = state.thoughts.reduce((max, t) => Math.max(max, t.id), 0);
        thoughtIdCounter = Math.max(thoughtIdCounter, maxId + 1);

        const thought: Thought = {
          id: thoughtIdCounter++,
          title,
          description,
          tag,
          createdAt: Date.now(),
        };
        set((s) => ({ thoughts: [...s.thoughts, thought] }));
        return thought;
      },

      deleteThought: (id) => {
        set((s) => ({
          thoughts: s.thoughts.filter((t) => t.id !== id),
          connections: s.connections.filter(
            (c) => c.fromId !== id && c.toId !== id,
          ),
          selectedThoughtId:
            s.selectedThoughtId === id ? null : s.selectedThoughtId,
        }));
      },

      addConnection: (fromId, toId) => {
        const state = get();
        if (fromId === toId) return null;
        const exists = state.connections.some(
          (c) =>
            (c.fromId === fromId && c.toId === toId) ||
            (c.fromId === toId && c.toId === fromId),
        );
        if (exists) return null;

        const maxId = state.connections.reduce(
          (max, c) => Math.max(max, c.id),
          0,
        );
        connectionIdCounter = Math.max(connectionIdCounter, maxId + 1);

        const connection: Connection = {
          id: connectionIdCounter++,
          fromId,
          toId,
        };
        set((s) => ({ connections: [...s.connections, connection] }));
        return connection;
      },

      deleteConnection: (id) => {
        set((s) => ({
          connections: s.connections.filter((c) => c.id !== id),
        }));
      },

      clearAll: () => {
        thoughtIdCounter = 1;
        connectionIdCounter = 1;
        set({ thoughts: [], connections: [], selectedThoughtId: null });
      },

      selectThought: (id) => {
        set({ selectedThoughtId: id });
      },
    }),
    {
      name: "neuroweb-store",
      partialize: (state) => ({
        thoughts: state.thoughts,
        connections: state.connections,
      }),
    },
  ),
);
