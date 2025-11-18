"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import Addinterveiw from "../_components/Addinterveiw";
import { useRouter } from "next/navigation";
import moment from "moment";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) GetInterviewList();
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) GetInterviewList();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;

      const res = await db
        .select()
        .from(MockInterview)
        .orderBy(desc(MockInterview.createdAt));

      const filtered = res.filter((i) => i.createdBy === email);
      setInterviewList(filtered);
    } catch (e) {
      console.error("fetch err:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-white min-h-screen max-w-6xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your mock interviews and track your progress.
        </p>
      </motion.div>

      {/* ADD INTERVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full mb-10 sm:mb-12"
      >
        <div className="p-6 sm:p-8 rounded-2xl border shadow-md bg-white hover:shadow-lg transition-all">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Create Your Next Mock Interview
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
            Tailored AI interview creation based on your role, experience, and difficulty.
          </p>

          <div className="mt-6">
            <Addinterveiw />
          </div>
        </div>
      </motion.div>

      {/* TITLE + REFRESH */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Your Interviews
        </h2>

        <button
          onClick={GetInterviewList}
          className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition w-full sm:w-auto"
        >
          Refresh
        </button>
      </motion.div>

      {/* INTERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {loading ? (
          <div className="col-span-full text-center py-10">
            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-3">Loading...</p>
          </div>
        ) : interviewList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-10 text-gray-500"
          >
            No interviews yet. Create your first above.
          </motion.div>
        ) : (
          interviewList.map((interview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="p-5 sm:p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/interveiw/${interview.mockId}`)
              }
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {interview.jobPosition}
                </h3>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Ready
                </span>
              </div>

              <p className="text-gray-600 text-sm">
                {interview.jobExperience} years experience
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {moment(interview.createdAt).fromNow()}
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 pt-4 border-t">
                
                <button
                  className="text-sm text-green-700 hover:underline w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/dashboard/interveiw/${interview.mockId}/feedback`
                    );
                  }}
                >
                  Feedback
                </button>

                <button
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/dashboard/interveiw/${interview.mockId}/start`
                    );
                  }}
                >
                  Start / Retake
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
