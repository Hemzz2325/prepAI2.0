import {
  pgTable,
  serial,
  text,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";

export const prepai = pgTable("prepai", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition", { length: 255 }).notNull(),
  jobDesc: varchar("jobDesc", { length: 255 }).notNull(),
  jobExperience: varchar("jobExperience", { length: 255 }).notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  mockId: varchar("mockId", { length: 255 }).notNull(),
});

// Table for storing user answers with AI feedback
export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockIdRef", { length: 255 }).notNull(),
  question: text("question").notNull(),
  correctAnswer: text("correctAnswer"),
  userAnswer: text("userAnswer"),
  feedback: text("feedback"),
  rating: varchar("rating", { length: 10 }),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});