import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

// Registers the service worker and surfaces update/offline-ready state as toasts.
export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update();
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast("A new version of Nagrik Sewa is available", {
        duration: Infinity,
        action: {
          label: "Update",
          onClick: () => updateServiceWorker(true),
        },
        onDismiss: () => setNeedRefresh(false),
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  useEffect(() => {
    if (offlineReady) {
      toast.success("Nagrik Sewa is ready to work offline");
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  return null;
}
