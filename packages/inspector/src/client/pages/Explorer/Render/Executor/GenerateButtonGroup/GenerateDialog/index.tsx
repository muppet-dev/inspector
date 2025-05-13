import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Settings, SparklesIcon } from "lucide-react";
import { GenerateForm } from "./Form";
import { useState } from "react";

export function GenerateDialog() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="size-max has-[>svg]:px-2.5 py-2.5"
        >
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            <DialogTitle>Generate</DialogTitle>
          </div>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <GenerateForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
