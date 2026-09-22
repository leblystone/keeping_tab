"use client";

import { useEffect } from "react";

/** Aggressively hide Next.js DevTools portal / Issues badge in the browser. */
export function KillNextOverlays() {
  useEffect(() => {
    // Ask Next DevTools to hide its indicator for this project/session.
    try {
      fetch("/__nextjs_devtools_config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disableDevIndicator: true }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }

    const hide = () => {
      document.querySelectorAll("nextjs-portal").forEach((el) => {
        const node = el as HTMLElement;
        node.style.setProperty("display", "none", "important");
        node.style.setProperty("visibility", "hidden", "important");
        node.style.setProperty("pointer-events", "none", "important");
        node.style.setProperty("opacity", "0", "important");
        node.setAttribute("hidden", "");
        node.setAttribute("aria-hidden", "true");
        try {
          node.remove();
        } catch {
          // ignore
        }
      });
    };

    hide();
    const obs = new MutationObserver(hide);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    const t = window.setInterval(hide, 500);
    return () => {
      obs.disconnect();
      window.clearInterval(t);
    };
  }, []);

  return null;
}
