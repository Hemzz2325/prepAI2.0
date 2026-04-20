/**
 * Plan limits for PrepAI
 * All counts are per-week (resets every Monday)
 */
export const PLAN_LIMITS = {
  free: {
    interviews: 3,
    resumeAnalyses: 2,
    codingChallenges: 2,
    skillGapAnalyses: 2,
    communicationSessions: 2,
    jobTracker: Infinity, // Fully free
  },
  pro: {
    interviews: Infinity,
    resumeAnalyses: Infinity,
    codingChallenges: Infinity,
    skillGapAnalyses: Infinity,
    communicationSessions: Infinity,
    jobTracker: Infinity,
  },
};

export const PLAN_PRICE_INR = 100;

export const FEATURE_KEYS = {
  INTERVIEW: "interviews",
  RESUME: "resumeAnalyses",
  CODING: "codingChallenges",
  SKILL_GAP: "skillGapAnalyses",
  COMMUNICATION: "communicationSessions",
  JOB_TRACKER: "jobTracker",
};
