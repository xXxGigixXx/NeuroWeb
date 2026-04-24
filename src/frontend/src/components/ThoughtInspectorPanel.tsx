import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Link2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNeuroStore } from "../store/useNeuroStore";
import { ConfirmDialog } from "./ConfirmDialog";
import { ConnectionModal } from "./ConnectionModal";

export function ThoughtInspectorPanel() {
  const thoughts = useNeuroStore((s) => s.thoughts);
  const connections = useNeuroStore((s) => s.connections);
  const selectedThoughtId = useNeuroStore((s) => s.selectedThoughtId);
  const selectThought = useNeuroStore((s) => s.selectThought);
  const deleteThought = useNeuroStore((s) => s.deleteThought);

  const [connectOpen, setConnectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const maybeThought = thoughts.find((t) => t.id === selectedThoughtId);

  if (!maybeThought) return null;

  // Assign to a new const so TypeScript keeps the narrowed type in closures
  const thought = maybeThought;

  const connectedThoughtIds = connections
    .filter((c) => c.fromId === thought.id || c.toId === thought.id)
    .map((c) => (c.fromId === thought.id ? c.toId : c.fromId));

  const connectedThoughts = thoughts.filter((t) =>
    connectedThoughtIds.includes(t.id),
  );

  const createdDate = new Date(thought.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function handleDelete() {
    deleteThought(thought.id);
    setDeleteOpen(false);
  }

  return (
    <>
      <div
        className="fixed right-0 top-0 h-full w-80 z-40 panel-glass flex flex-col"
        data-ocid="inspector.panel"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 p-4 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-primary node-glow shrink-0" />
              {thought.tag && (
                <Badge
                  variant="outline"
                  className="border-primary/40 text-primary text-xs"
                >
                  {thought.tag}
                </Badge>
              )}
            </div>
            <h2
              className="font-display text-base text-foreground leading-snug break-words"
              data-ocid="inspector.title"
            >
              {thought.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">{createdDate}</p>
          </div>
          <button
            type="button"
            aria-label="Close inspector"
            onClick={() => selectThought(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") selectThought(null);
            }}
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
            data-ocid="inspector.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Separator className="bg-border/30" />

        <ScrollArea className="flex-1 px-4">
          {/* Description */}
          {thought.description && (
            <div className="py-4">
              <p className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">
                Description
              </p>
              <p
                className="text-sm text-foreground/80 leading-relaxed break-words"
                data-ocid="inspector.description"
              >
                {thought.description}
              </p>
            </div>
          )}

          {/* Connected thoughts */}
          <div className="py-4">
            <p className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-2">
              Connections ({connectedThoughts.length})
            </p>

            {connectedThoughts.length === 0 ? (
              <p
                className="text-sm text-muted-foreground italic"
                data-ocid="inspector.connections_empty_state"
              >
                No connections yet. Link this thought to others.
              </p>
            ) : (
              <div
                className="space-y-1.5"
                data-ocid="inspector.connections_list"
              >
                {connectedThoughts.map((ct, i) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => selectThought(ct.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        selectThought(ct.id);
                    }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border/30 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40 hover:text-primary transition-smooth text-left group"
                    data-ocid={`inspector.connection_item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/70 shrink-0" />
                      <span className="text-sm text-foreground/80 truncate group-hover:text-primary transition-smooth">
                        {ct.title}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0 group-hover:text-primary transition-smooth" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="bg-border/30" />

        {/* Actions */}
        <div className="p-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConnectOpen(true)}
            className="flex-1 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/60 transition-smooth gap-1.5"
            data-ocid="inspector.connect_button"
          >
            <Link2 className="w-3.5 h-3.5" />
            Connect
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-smooth gap-1.5"
            data-ocid="inspector.delete_button"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {connectOpen && (
        <ConnectionModal
          open={connectOpen}
          onOpenChange={setConnectOpen}
          fromThoughtId={thought.id}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Thought"
        description={`Delete "${thought.title}"? All connections to this thought will also be removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
