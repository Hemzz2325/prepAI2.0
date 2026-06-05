/**
 * Skeleton — base shimmer component used by all skeleton variants.
 * Pure CSS animation, no dependencies.
 */

// Base pulsing block
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent ${className}`}
    />
  );
}

// ── Dashboard main page ────────────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="p-5 sm:p-8 md:p-10 max-w-6xl mx-auto animate-pulse bg-background min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Action cards row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>

      {/* Action cards row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ── Interview card (used in dashboard recent list) ────────────────────────────
export function InterviewCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function InterviewListSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <InterviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Performance page ──────────────────────────────────────────────────────────
export function PerformanceSkeleton() {
  return (
    <div className="p-10 bg-background min-h-screen">
      <Skeleton className="h-9 w-64 mb-8" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl shadow-sm border border-border space-y-3 bg-card">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-24" />
          </div>
        ))}
      </div>

      {/* Radar + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>

      {/* Chart + Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <div className="p-6 rounded-2xl shadow-sm border border-border space-y-4 bg-card">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="p-6 rounded-2xl shadow-sm border border-border space-y-4 bg-card">
          <Skeleton className="h-5 w-44" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Interview grid */}
      <div className="p-6 rounded-2xl shadow-sm border border-border space-y-4 bg-card">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Job Tracker ───────────────────────────────────────────────────────────────
export function JobTrackerSkeleton() {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, col) => (
          <div key={col} className="rounded-2xl border border-border p-4 bg-card space-y-3">
            <Skeleton className="h-5 w-28" />
            {[...Array(col === 0 ? 3 : col === 1 ? 2 : 1)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Saved Questions ───────────────────────────────────────────────────────────
export function SavedQuestionsSkeleton({ count = 5 }) {
  return (
    <div className="p-6 sm:p-10 min-h-screen bg-background">
      <Skeleton className="h-9 w-56 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="rounded-2xl border p-5 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Skill Gap / Resume / Communication (generic form+results page) ─────────────
export function FeaturePageSkeleton() {
  return (
    <div className="min-h-screen p-6 sm:p-10 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back button placeholder */}
        <Skeleton className="h-9 w-36 rounded-full" />

        {/* Page title */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border p-6 bg-card space-y-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Feedback page ─────────────────────────────────────────────────────────────
export function FeedbackSkeleton({ count = 5 }) {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-72 mb-2" />
      <Skeleton className="h-5 w-56 mb-6" />

      {/* Overall rating card */}
      <div className="my-6 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-10" />
        </div>
      </div>

      <Skeleton className="h-4 w-full mb-6" />

      {/* Question items */}
      {[...Array(count)].map((_, i) => (
        <div key={i} className="mt-6 rounded-lg border overflow-hidden">
          <div className="p-3 bg-muted flex justify-between items-center">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>
        </div>
      ))}

      <Skeleton className="h-10 w-32 mt-8 rounded-xl" />
    </div>
  );
}

// ── Coding page ───────────────────────────────────────────────────────────────
export function CodingPageSkeleton() {
  return (
    <div className="min-h-screen p-6 sm:p-10 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ── Interview start page ──────────────────────────────────────────────────────
export function InterviewStartSkeleton() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Questions side */}
      <div className="p-6 border-r space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
      {/* Camera side */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
