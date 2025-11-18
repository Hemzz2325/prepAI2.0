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

  // Refetch interviews when page becomes visible (return from feedback)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        GetInterviewList();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      console.log("👤 User email:", userEmail);
      
      // Temporarily show ALL interviews for debugging
      const result = await db
        .select()
        .from(MockInterview)
        .orderBy(desc(MockInterview.createdAt));

      console.log("📋 Database query result:", result);
      console.log("📋 Number of interviews found:", result.length);
      
      // Filter by user email on client side
      const userInterviews = result.filter(interview => 
        interview.createdBy === userEmail || !userEmail
      );
      console.log("📋 Filtered for user:", userEmail, "Count:", userInterviews.length);
      console.log("📋 User interviews:", userInterviews);
      
      setInterviewList(userInterviews);
    } catch (error) {
      console.error("❌ Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const GetAllInterviews = async () => {
    try {
      const allResult = await db.select().from(MockInterview);
      console.log("📋 ALL interviews in database:", allResult);
      alert(`Total interviews in DB: ${allResult.length}\n\nCheck console for details`);
    } catch (error) {
      console.error("Error fetching all interviews:", error);
    }
  };

  return (
    <div className="p-5 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-bold text-3xl text-green-600 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Create and Start your AI Mockup Interview
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => GetInterviewList()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => GetAllInterviews()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            🔍 Debug: Show All
          </button>
        </div>
      </div>

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
              className="border rounded-lg p-5 hover:shadow-lg hover:scale-105 transition-all cursor-pointer bg-white relative"
              onClick={() => router.push(`/dashboard/interveiw/${interview.mockId}`)}
            >
              <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✓ Created
              </div>
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
                  Start/Retake
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