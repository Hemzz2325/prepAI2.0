"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getPostHogClient } from "@/lib/posthog";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// PostHog analytics provider — tracks page views automatically on route changes
export function AnalyticsProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const posthog = getPostHogClient();
    if (posthog) {
      posthog.capture("$pageview", { path: pathname });
    }
  }, [pathname]);

  return <>{children}</>;
}
