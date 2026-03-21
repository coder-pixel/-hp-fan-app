import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DumbledoreModalProps {
  open: boolean;
  onClose: () => void;
  hint: string;
}

export default function DumbledoreModal({ open, onClose, hint }: DumbledoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border-border/50 bg-card text-card-foreground max-w-md gap-0 overflow-hidden p-0 sm:rounded-lg"
        style={{ boxShadow: "0 0 32px hsla(43, 72%, 52%, 0.2)" }}
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader className="p-5 pb-3 text-center sm:text-left">
          <DialogTitle className="font-display text-lg font-semibold tracking-wide">
            Dumbledore Says
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5">
          <div className="rounded-lg border border-accent/20 bg-background/40 p-4 text-center">
            <p className="text-[10px] uppercase tracking-widest text-accent/70 font-body mb-2">
              Cryptic hint
            </p>
            <p className="text-sm font-body italic text-foreground/90 leading-relaxed">"{hint}"</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="mt-4 w-full border-border/50 font-body text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

