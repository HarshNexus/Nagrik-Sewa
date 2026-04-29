const isDebugEnabled =
  import.meta.env.DEV && String(import.meta.env.VITE_DEBUG_LOGS || "").toLowerCase() === "true";

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDebugEnabled) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDebugEnabled) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDebugEnabled) {
      console.error(...args);
    }
  },
};

export const shouldDebugLog = isDebugEnabled;