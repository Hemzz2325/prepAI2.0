"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { prepai, userAnswers } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, AlertCircle, TrendingUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Feedback = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const interviewId = resolvedParams.interveiwId;

        const interviewResponse = await db
          .select()
          .from(prepai)
          .where(eq(prepai.mockId, interviewId));

        if (interviewResponse && interviewResponse.length > 0) {
          setInterviewData(interviewResponse[0]);

          const answersResponse = await db
            .select()
            .from(userAnswers)
            .where(eq(userAnswers.mockIdRef, interviewId));

          setFeedbackList(answersResponse);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [params]);

  const calculateOverallRating = () => {
    if (feedbackList.length === 0) return 0;

    const totalRating = feedbackList.reduce((sum, item) => {
      return sum + (parseInt(item.rating) || 0);
    }, 0);

    return (totalRating / feedbackList.length).toFixed(1);
  };

  const getRatingColor = (rating) => {
    const numRating = parseInt(rating);
    if (numRating >= 8) return "text-green-600 bg-green-50 border-green-200";
    if (numRating >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading feedback...</div>
      </div>
    );
  }

  if (!interviewData || feedbackList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <AlertCircle className="h-16 w-16 text-yellow-500" />
        <div className="text-xl text-gray-600">No feedback available yet</div>
        <p className="text-gray-500">Please complete the interview to see feedback</p>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const overallRating = calculateOverallRating();

  return (
    <div className="p-5 md:p-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-green-600">
            Congratulations! 🎉
          </h1>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <p className="text-gray-600 text-lg">
          Here is your interview feedback with AI-powered ratings
        </p>
      </div>

      <div className="mb-8 p-6 border rounded-lg bg-secondary">
        <h2 className="text-xl font-semibold mb-4">Interview Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-semibold">{interviewData.jobPosition}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Description</p>
            <p className="font-semibold">{interviewData.jobDesc}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-semibold">
              {interviewData.jobExperience} years
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-semibold text-green-800">
            Overall Performance
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-6xl font-bold text-green-600">
            {overallRating}/10
          </div>
          <div className="flex-1">
            <p className="text-gray-700 mb-2">
              You answered {feedbackList.length} questions with an average rating of{" "}
              {overallRating}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(overallRating / 10) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-2 mt-3">
              {overallRating >= 8 ? (
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                  Excellent! 🌟
                </span>
              ) : overallRating >= 6 ? (
                <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                  Good Job! 👍
                </span>
              ) : overallRating >= 4 ? (
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                  Keep Practicing! 💪
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                  Needs Improvement 📚
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>

        {feedbackList.map((item, index) => (
          <Collapsible key={index} className="border rounded-lg bg-white shadow-sm">
            <CollapsibleTrigger className="w-full">
              <div className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getRatingColor(
                      item.rating
                    )}`}
                  >
                    {item.rating}/10
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Your Answer:
                  </h4>
                  <p className="text-gray-700">{item.userAnswer}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2">
                    AI Feedback:
                  </h4>
                  <p className="text-gray-700">{item.feedback}</p>
                </div>

                {/* FIXED THIS PART ONLY */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-800">
                      Model Answer:
                    </h4>
                  </div>
                  <p className="text-gray-700">{item.correctAnswer}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-green-600 hover:bg-green-700"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() =>
            router.push(`/dashboard/interveiw/${interviewData.mockId}`)
          }
          variant="outline"
        >
          Retake Interview
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
