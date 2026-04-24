import { Button } from "@/components/ui/button";
import { Compass, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNeuroStore } from "../store/useNeuroStore";
import { AddThoughtModal } from "./AddThoughtModal";
import { ConfirmDialog } from "./ConfirmDialog";

export function Toolbar() {
  const thoughts = useNeuroStore((s) => s.thoughts);
  const clearAll = useNeuroStore((s) => s.clearAll);
  const selectThought = useNeuroStore((s) => s.selectThought);

  const [addOpen, setAddOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  function handleExplore() {
    if (thoughts.length === 0) return;
    const random = thoughts[Math.floor(Math.random() * thoughts.length)];
    selectThought(random.id);
  }

  function handleClearConfirm() {
    clearAll();
    setClearOpen(false);
  }

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2.5 rounded-2xl toolbar-glass"
        data-ocid="toolbar.panel"
        role="toolbar"
        aria-label="Main actions"
      >
        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          className="bg-primary/90 text-primary-foreground hover:bg-primary node-glow transition-smooth gap-1.5 px-4 font-display"
          data-ocid="toolbar.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Thought
        </Button>

        <div className="w-px h-6 bg-border/40" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={handleExplore}
          disabled={thoughts.length === 0}
          title={
            thoughts.length === 0
              ? "Add thoughts to explore"
              : "Jump to random thought"
          }
          className="text-accent hover:text-accent hover:bg-accent/10 transition-smooth gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed font-display"
          data-ocid="toolbar.explore_button"
        >
          <Compass className="w-4 h-4" />
          Explore
        </Button>

        <div className="w-px h-6 bg-border/40" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setClearOpen(true)}
          disabled={thoughts.length === 0}
          title={
            thoughts.length === 0 ? "Nothing to clear" : "Clear all thoughts"
          }
          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-smooth gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed font-display"
          data-ocid="toolbar.clear_button"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      <AddThoughtModal open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear All Thoughts"
        description="This will permanently delete all thoughts and connections. This action cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={handleClearConfirm}
      />
    </>
  );
}
