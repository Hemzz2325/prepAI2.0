"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * usePlan — checks if a user can use a feature and consumes a usage slot.
 *
 * @param {string} feature - Feature key from FEATURE_KEYS (e.g. 'interviews')
 * @returns {{ canUse, plan, used, limit, loading, consume, refresh }}
 *
 * Usage:
 *   const { canUse, consume, loading } = usePlan('interviews');
 *   // Before action: call consume() — it returns true if allowed, false if blocked
 */
export function usePlan(feature) {
  const { user } = useUser();
  const [state, setState] = useState({ plan: "free", used: 0, limit: 3, allowed: true, loading: true });

  const email = user?.primaryEmailAddress?.emailAddress;

  const refresh = useCallback(async () => {
    if (!email || !feature) return;
    try {
      const res = await fetch(`/api/usage?email=${encodeURIComponent(email)}&feature=${feature}`);
      const data = await res.json();
      setState({ ...data, loading: false });
    } catch {
      setState((p) => ({ ...p, loading: false }));
    }
  }, [email, feature]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * consume() — increments usage by 1.
   * Returns true if action is allowed, false if limit exceeded.
   */
  const consume = useCallback(async () => {
    if (!email) return false;
    try {
      const res = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, email }),
      });
      const data = await res.json();
      setState((p) => ({ ...p, used: data.used, allowed: data.allowed }));
      return res.ok && data.allowed;
    } catch {
      return false;
    }
  }, [email, feature]);

  const canUse = state.allowed;
  const limitDisplay = state.limit === -1 ? "∞" : state.limit;

  return { canUse, plan: state.plan, used: state.used, limit: limitDisplay, loading: state.loading, consume, refresh };
}
