import { z } from "zod";

// Schema for the Gemini AI generation endpoint
export const promptSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required." })
    .min(10, "Prompt must be at least 10 characters.")
    .max(10000, "Prompt is too long (max 10,000 characters)."),
});

// Schema for the skill-gap analysis endpoint
export const skillGapSchema = z.object({
  resumeText: z
    .string({ required_error: "Resume text is required." })
    .min(50, "Resume text seems too short (min 50 characters)."),
  targetRole: z
    .string({ required_error: "Target role is required." })
    .min(2, "Target role must be at least 2 characters."),
  targetCompany: z.string().optional(),
});

// Schema for the create-interview endpoint
export const createInterviewSchema = z.object({
  jobPosition: z
    .string({ required_error: "Job position is required." })
    .min(2)
    .max(100),
  jobDesc: z
    .string({ required_error: "Job description is required." })
    .min(10)
    .max(5000),
  jobExperience: z
    .string({ required_error: "Experience level is required." })
    .min(1),
  interviewRound: z.string().optional().default("Technical Round"),
});

// Schema for the Stripe checkout endpoint
export const checkoutSchema = z.object({
  plan: z.enum(["pro"], {
    required_error: "Plan is required.",
    invalid_type_error: "Only 'pro' plan is supported.",
  }),
  userEmail: z
    .string({ required_error: "User email is required." })
    .email("Must be a valid email address."),
});

/**
 * Parse and validate a request body against a given Zod schema.
 * Returns { data } on success or throws a NextResponse 422 on failure.
 */
export function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      error: true,
      issues: result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }
  return { error: false, data: result.data };
}
