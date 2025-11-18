"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";


import { desc, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Addinterveiw from "../_components/Addinterveiw";
import { useRouter } from "next/navigation";
import moment from "moment";

const Dashboard = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.createdAt));

      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="font-bold text-3xl text-green-600 mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-8">
        Create and Start your AI Mockup Interview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Addinterveiw />

        {loading ? (
          <div className="col-span-full text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading interviews...</p>
          </div>
        ) : interviewList.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No interviews yet. Create your first one!</p>
          </div>
        ) : (
          interviewList.map((interview, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-white"
              onClick={() => router.push(`/dashboard/interveiw/${interview.mockId}`)}
            >
              <h3 className="font-bold text-lg text-green-600 mb-2">
                {interview.jobPosition}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {interview.jobExperience} Years of Experience
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Created: {moment(interview.createdAt).fromNow()}
              </p>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <button
                  className="text-sm text-green-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/interveiw/${interview.mockId}/feedback`);
                  }}
                >
                  View Feedback
                </button>
                <button
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/interveiw/${interview.mockId}/start`);
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;