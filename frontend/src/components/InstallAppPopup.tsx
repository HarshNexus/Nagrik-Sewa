import { useEffect, useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { toast } from "sonner";

const SHOWN_KEY = "installPopupShown";

// Offers to install the app on every login, as long as it is not installed on this device.
export function InstallAppPopup() {
  const { isAuthenticated, isLoading } = useAuth();
  const { canInstall, needsManualIOSInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const installable = !isInstalled && (canInstall || needsManualIOSInstall);

  // Once per login. If the browser has not fired its install event yet, this waits for it.
  // The flag is cleared on logout so the next login shows the popup again.
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      sessionStorage.removeItem(SHOWN_KEY);
      return;
    }
    if (!installable || sessionStorage.getItem(SHOWN_KEY)) return;
    sessionStorage.setItem(SHOWN_KEY, "1");
    setOpen(true);
  }, [isAuthenticated, isLoading, installable]);

  const install = async () => {
    const outcome = await promptInstall();
    setOpen(false);
    if (outcome === "accepted") {
      toast.success("Nagrik Sewa is being added to your home screen!");
    }
  };

  return (
    <Dialog open={open && installable} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Get the Nagrik Sewa app</DialogTitle>
          <DialogDescription>
            Install Nagrik Sewa on this device for quick, app-like access to your bookings.
          </DialogDescription>
        </DialogHeader>

        {needsManualIOSInstall && (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li>
              1. Tap the Share icon <Share className="inline h-4 w-4 mx-1" /> in Safari's toolbar
            </li>
            <li>
              2. Scroll down and select "Add to Home Screen" <SquarePlus className="inline h-4 w-4 mx-1" />
            </li>
            <li>3. Tap "Add"</li>
          </ol>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Not now
          </Button>
          {!needsManualIOSInstall && (
            <Button onClick={install}>
              <Download className="h-4 w-4 mr-2" />
              Install app
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
