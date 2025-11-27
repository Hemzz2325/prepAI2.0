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

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* CREATE INTERVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full">
            <Addinterveiw />
          </div>
        </motion.div>

        {/* CODING INTERVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          onClick={() => router.push('/dashboard/coding')}
          className="cursor-pointer group"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Coding Interview
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Practice DSA problems with AI help.
              </p>
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <div className="p-4 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-green-600 group-hover:underline">Start Coding &rarr;</span>
            </div>
          </div>
        </motion.div>

        {/* RESUME ANALYZER CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => router.push('/dashboard/resume')}
          className="cursor-pointer group"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Resume Analyzer
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Get instant ATS feedback.
              </p>
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <div className="p-4 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-purple-600 group-hover:underline">Analyze Resume &rarr;</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
