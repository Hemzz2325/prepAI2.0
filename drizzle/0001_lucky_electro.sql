CREATE TABLE "user_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockIdRef" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"correctAnswer" text,
	"userAnswer" text,
	"feedback" text,
	"rating" varchar(10),
	"userEmail" varchar(255) NOT NULL,
	"created_at" bigint NOT NULL
);
