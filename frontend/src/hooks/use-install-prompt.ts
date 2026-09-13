import { useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

// Captured at module scope so we never miss the event: Chrome can fire
// beforeinstallprompt as soon as this script runs, which is earlier than
// any React useEffect gets a chance to attach a listener.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = isStandalone();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  notify();
});

window.addEventListener("appinstalled", () => {
  isInstalled = true;
  deferredPrompt = null;
  notify();
});

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useInstallPrompt() {
  const canInstall = useSyncExternalStore(
    subscribe,
    () => !isInstalled && !!deferredPrompt,
  );
  const installed = useSyncExternalStore(subscribe, () => isInstalled);
  const isIOS = isIOSDevice();

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable" as const;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
    return outcome;
  }, []);

  return {
    // Android/desktop Chrome & Edge fire beforeinstallprompt; iOS Safari never does.
    canInstall,
    // iOS has no install prompt API, so we offer manual "Add to Home Screen" instructions instead.
    needsManualIOSInstall: !installed && isIOS && !canInstall,
    isInstalled: installed,
    promptInstall,
  };
}
