export interface Thought {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  createdAt: number;
}

export interface Connection {
  id: number;
  fromId: number;
  toId: number;
}

export interface NeuroStore {
  thoughts: Thought[];
  connections: Connection[];
  selectedThoughtId: number | null;
  addThought: (title: string, description?: string, tag?: string) => Thought;
  deleteThought: (id: number) => void;
  addConnection: (fromId: number, toId: number) => Connection | null;
  deleteConnection: (id: number) => void;
  clearAll: () => void;
  selectThought: (id: number | null) => void;
}
