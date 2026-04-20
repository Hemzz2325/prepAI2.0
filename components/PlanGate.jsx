"use client";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PlanGate — wraps any feature.
 * If the user is on free plan and has exceeded their limit,
 * shows an upgrade prompt instead of the children.
 *
 * Props:
 *   canUse  {boolean}  — from usePlan().canUse
 *   loading {boolean}  — from usePlan().loading
 *   used    {number}   — from usePlan().used
 *   limit   {string}   — from usePlan().limit (e.g. "3" or "∞")
 *   feature {string}   — human-readable feature name (e.g. "Interviews")
 *   children           — content to show when allowed
 */
export default function PlanGate({ canUse, loading, used, limit, feature, children }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 animate-pulse text-sm">
        Checking your plan...
      </div>
    );
  }

  if (!canUse) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-orange-300 rounded-2xl bg-orange-50 text-center">
        <div className="p-3 rounded-full bg-orange-100">
          <Lock className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Weekly Limit Reached</h3>
          <p className="text-gray-500 text-sm mt-1">
            You&apos;ve used <span className="font-semibold">{used}/{limit}</span> free {feature} this week.
          </p>
          <p className="text-gray-400 text-xs mt-1">Resets every Monday.</p>
        </div>
        <Link href="/upgrade">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6">
            Upgrade to Pro — ₹100 only
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {limit !== "∞" && (
        <p className="text-xs text-gray-400 mb-2 text-right">
          {used}/{limit} free {feature} used this week
        </p>
      )}
      {children}
    </>
  );
}
