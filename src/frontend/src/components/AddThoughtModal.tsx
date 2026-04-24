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

  const fieldClassName =
    "rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:ring-zinc-500/50";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="border-zinc-800 bg-zinc-950 text-zinc-100 p-7 sm:p-8"
        data-ocid="add_thought.dialog"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="font-display text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            New Thought
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2.5">
            <Label htmlFor="thought-title" className="text-sm text-zinc-200 font-body">
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
              placeholder="Initialize thought"
              className={fieldClassName}
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

          <div className="space-y-2.5">
            <Label
              htmlFor="thought-description"
              className="text-sm text-zinc-200 font-body"
            >
              Description
            </Label>
            <Textarea
              id="thought-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain this thought"
              rows={4}
              className={`${fieldClassName} resize-none`}
              data-ocid="add_thought.textarea"
            />
            <p className="text-[10px] tracking-[0.14em] text-zinc-500">NOT COMPULSORY</p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="thought-tag" className="text-sm text-zinc-200 font-body">
              Tag
            </Label>
            <Input
              id="thought-tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="In short"
              className={fieldClassName}
              data-ocid="add_thought.tag_input"
            />
            <p className="text-[10px] tracking-[0.14em] text-zinc-500">NOT COMPULSORY</p>
          </div>

          <DialogFooter className="justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-smooth"
              data-ocid="add_thought.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg bg-zinc-700 px-5 font-semibold text-zinc-50 hover:bg-zinc-600 disabled:opacity-50"
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
