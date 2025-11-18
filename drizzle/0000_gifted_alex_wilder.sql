CREATE TABLE "prepai" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar(255) NOT NULL,
	"jobDesc" varchar(255) NOT NULL,
	"jobExperience" varchar(255) NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"created_at" bigint NOT NULL,
	"mockId" varchar(255) NOT NULL
);
