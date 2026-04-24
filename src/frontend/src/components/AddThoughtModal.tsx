import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNeuroStore } from "../store/useNeuroStore";

interface AddThoughtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddThoughtModal({ open, onOpenChange }: AddThoughtModalProps) {
  const addThought = useNeuroStore((s) => s.addThought);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [titleError, setTitleError] = useState("");

  function handleClose() {
    setTitle("");
    setDescription("");
    setTag("");
    setTitleError("");
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }
    addThought(
      trimmedTitle,
      description.trim() || undefined,
      tag.trim() || undefined,
    );
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="panel-glass border-border/50 text-foreground sm:max-w-md"
        data-ocid="add_thought.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            New Thought
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="thought-title"
              className="text-sm text-foreground/80 font-body"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="thought-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              onBlur={() => {
                if (!title.trim()) setTitleError("Title is required");
              }}
              placeholder="What's on your mind?"
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/50"
              autoFocus
              data-ocid="add_thought.input"
            />
            {titleError && (
              <p
                className="text-xs text-destructive"
                data-ocid="add_thought.field_error"
              >
                {titleError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="thought-description"
              className="text-sm text-foreground/80 font-body"
            >
              Description
            </Label>
            <Textarea
              id="thought-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expand on this thought..."
              rows={3}
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/50 resize-none"
              data-ocid="add_thought.textarea"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="thought-tag"
              className="text-sm text-foreground/80 font-body"
            >
              Tag
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="thought-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. idea, research, todo..."
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/50"
                data-ocid="add_thought.tag_input"
              />
              {tag.trim() && (
                <Badge
                  variant="outline"
                  className="border-primary/50 text-primary shrink-0"
                >
                  {tag.trim()}
                </Badge>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
              data-ocid="add_thought.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 node-glow transition-smooth"
              data-ocid="add_thought.submit_button"
            >
              Add Thought
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
