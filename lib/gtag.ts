export const GA_ID = "G-VNCCCP3DLY";

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  (window as any).gtag?.("event", name, params);
}
