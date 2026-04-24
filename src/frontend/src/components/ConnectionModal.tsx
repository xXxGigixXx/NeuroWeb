import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, LinkIcon } from "lucide-react";
import { useState } from "react";
import { useNeuroStore } from "../store/useNeuroStore";

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromThoughtId: number;
}

export function ConnectionModal({
  open,
  onOpenChange,
  fromThoughtId,
}: ConnectionModalProps) {
  const thoughts = useNeuroStore((s) => s.thoughts);
  const connections = useNeuroStore((s) => s.connections);
  const addConnection = useNeuroStore((s) => s.addConnection);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fromThought = thoughts.find((t) => t.id === fromThoughtId);

  const connectedIds = new Set(
    connections
      .filter((c) => c.fromId === fromThoughtId || c.toId === fromThoughtId)
      .map((c) => (c.fromId === fromThoughtId ? c.toId : c.fromId)),
  );

  const availableThoughts = thoughts.filter(
    (t) => t.id !== fromThoughtId && !connectedIds.has(t.id),
  );

  function handleClose() {
    setSelectedId(null);
    onOpenChange(false);
  }

  function handleConfirm() {
    if (selectedId === null) return;
    addConnection(fromThoughtId, selectedId);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="panel-glass border-border/50 text-foreground sm:max-w-md"
        data-ocid="connection.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-accent" />
            Connect Thought
          </DialogTitle>
          {fromThought && (
            <p className="text-sm text-muted-foreground pt-1">
              Linking from:{" "}
              <span className="text-primary font-medium">
                {fromThought.title}
              </span>
            </p>
          )}
        </DialogHeader>

        {availableThoughts.length === 0 ? (
          <div
            className="py-8 text-center text-muted-foreground text-sm"
            data-ocid="connection.empty_state"
          >
            {thoughts.length <= 1
              ? "Add more thoughts before creating connections."
              : "All thoughts are already connected."}
          </div>
        ) : (
          <ScrollArea className="max-h-64 pr-1">
            <div className="space-y-1.5">
              {availableThoughts.map((thought, i) => (
                <button
                  key={thought.id}
                  type="button"
                  onClick={() =>
                    setSelectedId(selectedId === thought.id ? null : thought.id)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(
                        selectedId === thought.id ? null : thought.id,
                      );
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-smooth text-left ${
                    selectedId === thought.id
                      ? "border-primary/60 bg-primary/10 text-foreground node-glow"
                      : "border-border/40 bg-secondary/30 text-foreground/80 hover:border-primary/30 hover:bg-secondary/50 hover:text-foreground"
                  }`}
                  data-ocid={`connection.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        selectedId === thought.id
                          ? "bg-primary node-glow"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <span className="font-body text-sm truncate">
                      {thought.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {thought.tag && (
                      <Badge
                        variant="outline"
                        className="text-xs border-border/40 text-muted-foreground"
                      >
                        {thought.tag}
                      </Badge>
                    )}
                    {selectedId === thought.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
            data-ocid="connection.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedId === null}
            className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth disabled:opacity-40"
            data-ocid="connection.confirm_button"
          >
            Create Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
