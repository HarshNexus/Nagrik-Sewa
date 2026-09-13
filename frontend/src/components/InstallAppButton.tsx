import { useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { toast } from "sonner";

interface InstallAppButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function InstallAppButton({
  variant = "outline",
  size = "sm",
  className,
}: InstallAppButtonProps) {
  const { canInstall, needsManualIOSInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  if (isInstalled || (!canInstall && !needsManualIOSInstall)) {
    return null;
  }

  const handleClick = async () => {
    if (needsManualIOSInstall) {
      setShowIOSHelp(true);
      return;
    }
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      toast.success("Nagrik Sewa is being added to your home screen!");
    }
  };

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={handleClick}>
        <Download className="h-4 w-4 mr-2" />
        Get the App
      </Button>

      <Dialog open={showIOSHelp} onOpenChange={setShowIOSHelp}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Install Nagrik Sewa</DialogTitle>
            <DialogDescription>
              Add Nagrik Sewa to your Home Screen for quick, app-like access.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                1
              </span>
              Tap the Share icon <Share className="inline h-4 w-4 mx-1" /> in Safari's toolbar
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                2
              </span>
              Scroll down and select "Add to Home Screen"{" "}
              <SquarePlus className="inline h-4 w-4 mx-1" />
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                3
              </span>
              Tap "Add" — Nagrik Sewa now opens like an app, right from your Home Screen
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
