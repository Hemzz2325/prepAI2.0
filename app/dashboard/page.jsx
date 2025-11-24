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
    <div className="p-5 sm:p-8 md:p-10 bg-white min-h-screen max-w-6xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and improve your mock interview performance.
        </p>
      </motion.div>

      {/* CREATE INTERVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-14"
      >
        <div className="p-5 sm:p-6 rounded-xl border bg-white shadow-sm hover:shadow-lg transition-all">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Create a New Interview
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Quick setup. Just enter job details and you're good to go.
              </p>
            </div>

          
          </div>

          <div className="mt-3">
            <Addinterveiw />
          </div>
        </div>
      </motion.div>

      {/* LIST HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Your Interviews
        </h2>

        <button
          onClick={GetInterviewList}
          className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </motion.div>

      {/* INTERVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {loading ? (
          <div className="col-span-full text-center py-10">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-3">Loading...</p>
          </div>
        ) : interviewList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12 text-gray-500"
          >
            No interviews yet. Create one above.
          </motion.div>
        ) : (
          interviewList.map((interview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/interveiw/${interview.mockId}`)
              }
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-900 leading-snug">
                  {interview.jobPosition}
                </h3>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Ready
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-1">
                {interview.jobExperience} years experience
              </p>

              <p className="text-xs text-gray-500 mb-4">
                {moment(interview.createdAt).fromNow()}
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  className="text-sm text-green-700 hover:underline"
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
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
