import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import {
  MockInterview,
  CodingSubmission,
  ResumeAnalysis,
  SkillGapAnalysis,
  UserAnswer,
  UserSubscription,
  JobApplication,
} from "@/utils/schema";
import { sql, desc } from "drizzle-orm";

const ADMIN_EMAIL = "nitinambiger11@gmail.com";

export async function GET(req) {
  // Auth guard
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // ── Aggregate counts ──────────────────────────────────────────────
    const [
      interviewCount,
      codingCount,
      resumeCount,
      skillGapCount,
      answerCount,
      jobAppCount,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(MockInterview),
      db.select({ count: sql`count(*)` }).from(CodingSubmission),
      db.select({ count: sql`count(*)` }).from(ResumeAnalysis),
      db.select({ count: sql`count(*)` }).from(SkillGapAnalysis),
      db.select({ count: sql`count(*)` }).from(UserAnswer),
      db.select({ count: sql`count(*)` }).from(JobApplication),
    ]);

    // ── Unique users (across all tables) ─────────────────────────────
    // Collect all distinct emails from all user-activity tables
    const uniqueEmailsResult = await db.execute(sql`
      SELECT DISTINCT email FROM (
        SELECT "createdBy" AS email FROM "mockInterview"
        UNION
        SELECT "userEmail" AS email FROM "codingSubmission"
        UNION
        SELECT "userEmail" AS email FROM "resumeAnalysis"
        UNION
        SELECT "userEmail" AS email FROM "skillGapAnalysis"
        UNION
        SELECT "userEmail" AS email FROM "jobApplication"
      ) AS combined
      WHERE email IS NOT NULL AND email != ''
    `);
    const totalUsers = uniqueEmailsResult.rows?.length ?? 0;

    // ── Pro vs Free users ──────────────────────────────────────────
    const proUsersResult = await db
      .select({ count: sql`count(*)` })
      .from(UserSubscription)
      .where(sql`plan = 'pro'`);

    const proUsers = Number(proUsersResult[0]?.count ?? 0);
    const freeUsers = Math.max(0, totalUsers - proUsers);

    // ── Per-user breakdown table ───────────────────────────────────
    const userStatsResult = await db.execute(sql`
      SELECT
        u.email,
        COALESCE(mi.cnt, 0)  AS interviews,
        COALESCE(cs.cnt, 0)  AS coding,
        COALESCE(ra.cnt, 0)  AS resumes,
        COALESCE(sg.cnt, 0)  AS skillgap,
        COALESCE(ja.cnt, 0)  AS jobs,
        COALESCE(sub.plan, 'free') AS plan,
        u.first_seen
      FROM (
        SELECT email, MIN(created_at) AS first_seen FROM (
          SELECT "createdBy" AS email, "createdAt" AS created_at FROM "mockInterview"
          UNION ALL
          SELECT "userEmail", "createdAt" FROM "codingSubmission"
          UNION ALL
          SELECT "userEmail", "createdAt" FROM "resumeAnalysis"
          UNION ALL
          SELECT "userEmail", "createdAt" FROM "skillGapAnalysis"
          UNION ALL
          SELECT "userEmail", "createdAt" FROM "jobApplication"
        ) all_activity
        WHERE email IS NOT NULL AND email != ''
        GROUP BY email
      ) u
      LEFT JOIN (SELECT "createdBy" AS email, COUNT(*) AS cnt FROM "mockInterview" GROUP BY "createdBy") mi ON mi.email = u.email
      LEFT JOIN (SELECT "userEmail" AS email, COUNT(*) AS cnt FROM "codingSubmission" GROUP BY "userEmail") cs ON cs.email = u.email
      LEFT JOIN (SELECT "userEmail" AS email, COUNT(*) AS cnt FROM "resumeAnalysis" GROUP BY "userEmail") ra ON ra.email = u.email
      LEFT JOIN (SELECT "userEmail" AS email, COUNT(*) AS cnt FROM "skillGapAnalysis" GROUP BY "userEmail") sg ON sg.email = u.email
      LEFT JOIN (SELECT "userEmail" AS email, COUNT(*) AS cnt FROM "jobApplication" GROUP BY "userEmail") ja ON ja.email = u.email
      LEFT JOIN "userSubscription" sub ON sub."userEmail" = u.email
      ORDER BY u.first_seen DESC NULLS LAST
    `);

    // ── Recent interviews ──────────────────────────────────────────
    const recentInterviews = await db
      .select({
        id: MockInterview.id,
        jobPosition: MockInterview.jobPosition,
        jobExperience: MockInterview.jobExperience,
        createdBy: MockInterview.createdBy,
        createdAt: MockInterview.createdAt,
        interviewRound: MockInterview.interviewRound,
      })
      .from(MockInterview)
      .orderBy(desc(MockInterview.id))
      .limit(10);

    // ── Recent coding submissions ──────────────────────────────────
    const recentCoding = await db
      .select({
        id: CodingSubmission.id,
        userEmail: CodingSubmission.userEmail,
        challengeTitle: CodingSubmission.challengeTitle,
        difficulty: CodingSubmission.difficulty,
        language: CodingSubmission.language,
        solved: CodingSubmission.solved,
        createdAt: CodingSubmission.createdAt,
      })
      .from(CodingSubmission)
      .orderBy(desc(CodingSubmission.id))
      .limit(10);

    return NextResponse.json({
      totalUsers,
      proUsers,
      freeUsers,
      totalInterviews: Number(interviewCount[0]?.count ?? 0),
      totalCoding: Number(codingCount[0]?.count ?? 0),
      totalResumes: Number(resumeCount[0]?.count ?? 0),
      totalSkillGap: Number(skillGapCount[0]?.count ?? 0),
      totalAnswers: Number(answerCount[0]?.count ?? 0),
      totalJobApps: Number(jobAppCount[0]?.count ?? 0),
      userList: userStatsResult.rows ?? [],
      recentInterviews,
      recentCoding,
    });
  } catch (err) {
    console.error("[Admin Stats Error]", err);
    return NextResponse.json(
      { error: "Failed to fetch stats", detail: err.message },
      { status: 500 }
    );
  }
}
