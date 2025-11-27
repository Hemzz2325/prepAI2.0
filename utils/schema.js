import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull(),
    interviewRound: varchar('interviewRound').notNull().default('Technical Round')
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockIdRef').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt')
});

export const CodingSubmission = pgTable('codingSubmission', {
    id: serial('id').primaryKey(),
    userEmail: varchar('userEmail').notNull(),
    challengeTitle: varchar('challengeTitle').notNull(),
    difficulty: varchar('difficulty').notNull(),
    topic: varchar('topic').notNull(),
    language: varchar('language').notNull(),
    code: text('code').notNull(),
    solved: varchar('solved').notNull().default('false'),
    timeComplexity: varchar('timeComplexity'),
    spaceComplexity: varchar('spaceComplexity'),
    createdAt: varchar('createdAt')
});
