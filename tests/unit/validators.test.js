/**
 * Unit tests for lib/validators.js
 *
 * Tests every schema boundary (min, max, required, optional) and the
 * parseBody helper that wraps Zod's safeParse.
 */
import { describe, it, expect } from "vitest";
import {
  promptSchema,
  skillGapSchema,
  createInterviewSchema,
  parseBody,
} from "../../lib/validators.js";

// ─── promptSchema ────────────────────────────────────────────────────────────
describe("promptSchema", () => {
  it("accepts a valid prompt", () => {
    const result = promptSchema.safeParse({ prompt: "Tell me about yourself in detail." });
    expect(result.success).toBe(true);
  });

  it("rejects an empty prompt", () => {
    const result = promptSchema.safeParse({ prompt: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a prompt shorter than 10 characters", () => {
    const result = promptSchema.safeParse({ prompt: "Short" });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/10 characters/);
  });

  it("rejects a prompt longer than 10,000 characters", () => {
    const result = promptSchema.safeParse({ prompt: "a".repeat(10001) });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/10,000/);
  });

  it("rejects when prompt field is missing", () => {
    const result = promptSchema.safeParse({});
    expect(result.success).toBe(false);
    // Zod v4 message for a missing string field
    expect(result.error.issues[0].message).toMatch(/expected string|required/i);
  });

  it("accepts a prompt of exactly 10 characters (boundary)", () => {
    const result = promptSchema.safeParse({ prompt: "1234567890" });
    expect(result.success).toBe(true);
  });

  it("accepts a prompt of exactly 10,000 characters (boundary)", () => {
    const result = promptSchema.safeParse({ prompt: "a".repeat(10000) });
    expect(result.success).toBe(true);
  });
});

// ─── skillGapSchema ──────────────────────────────────────────────────────────
describe("skillGapSchema", () => {
  const valid = {
    resumeText: "a".repeat(50),
    targetRole: "Frontend Engineer",
  };

  it("accepts valid data without targetCompany", () => {
    const result = skillGapSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts valid data with optional targetCompany", () => {
    const result = skillGapSchema.safeParse({ ...valid, targetCompany: "Google" });
    expect(result.success).toBe(true);
  });

  it("rejects resumeText shorter than 50 characters", () => {
    const result = skillGapSchema.safeParse({ ...valid, resumeText: "short" });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/50/);
  });

  it("rejects missing resumeText", () => {
    const { resumeText: _, ...rest } = valid;
    const result = skillGapSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects targetRole shorter than 2 characters", () => {
    const result = skillGapSchema.safeParse({ ...valid, targetRole: "A" });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/2/);
  });

  it("rejects missing targetRole", () => {
    const { targetRole: _, ...rest } = valid;
    const result = skillGapSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ─── createInterviewSchema ───────────────────────────────────────────────────
describe("createInterviewSchema", () => {
  const valid = {
    jobPosition: "Software Engineer",
    jobDesc: "Build scalable web applications.",
    jobExperience: "2",
  };

  it("accepts valid data with default interviewRound", () => {
    const result = createInterviewSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data.interviewRound).toBe("Technical Round");
  });

  it("accepts valid data with explicit interviewRound", () => {
    const result = createInterviewSchema.safeParse({ ...valid, interviewRound: "Managerial Round" });
    expect(result.success).toBe(true);
    expect(result.data.interviewRound).toBe("Managerial Round");
  });

  it("rejects jobPosition shorter than 2 characters", () => {
    const result = createInterviewSchema.safeParse({ ...valid, jobPosition: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects jobPosition longer than 100 characters", () => {
    const result = createInterviewSchema.safeParse({ ...valid, jobPosition: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects jobDesc shorter than 10 characters", () => {
    const result = createInterviewSchema.safeParse({ ...valid, jobDesc: "Short." });
    expect(result.success).toBe(false);
  });

  it("rejects jobDesc longer than 5,000 characters", () => {
    const result = createInterviewSchema.safeParse({ ...valid, jobDesc: "a".repeat(5001) });
    expect(result.success).toBe(false);
  });

  it("rejects missing jobExperience", () => {
    const { jobExperience: _, ...rest } = valid;
    const result = createInterviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing jobPosition", () => {
    const { jobPosition: _, ...rest } = valid;
    const result = createInterviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ─── parseBody ────────────────────────────────────────────────────────────────
describe("parseBody", () => {
  it("returns { error: false, data } on valid input", () => {
    const body = { prompt: "Tell me about your experience in detail." };
    const result = parseBody(promptSchema, body);
    expect(result.error).toBe(false);
    expect(result.data).toMatchObject(body);
  });

  it("returns { error: true, issues } on invalid input", () => {
    const body = { prompt: "short" }; // < 10 chars
    const result = parseBody(promptSchema, body);
    expect(result.error).toBe(true);
    expect(Array.isArray(result.issues)).toBe(true);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("issue objects have path and message fields", () => {
    const body = {}; // missing prompt
    const result = parseBody(promptSchema, body);
    expect(result.error).toBe(true);
    const issue = result.issues[0];
    expect(issue).toHaveProperty("path");
    expect(issue).toHaveProperty("message");
  });

  it("returns data for valid createInterviewSchema", () => {
    const body = {
      jobPosition: "Backend Engineer",
      jobDesc: "Design and build REST APIs.",
      jobExperience: "3",
    };
    const result = parseBody(createInterviewSchema, body);
    expect(result.error).toBe(false);
    expect(result.data.jobPosition).toBe("Backend Engineer");
  });
});
