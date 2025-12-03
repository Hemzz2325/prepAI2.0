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

      {/* ACTION GRID - FIRST ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* CREATE INTERVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
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

        {/* JOB TRACKER CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => router.push('/dashboard/jobs')}
          className="cursor-pointer group"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Job Tracker
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage your applications.
              </p>
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <div className="p-4 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-orange-600 group-hover:underline">Track Jobs &rarr;</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECOND ROW - Resume Analyzer & Skill Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* RESUME ANALYZER CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
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

        {/* SKILL GAP ANALYZER CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          onClick={() => router.push('/dashboard/skill-gap')}
          className="cursor-pointer group"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Skill Gap Analyzer
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Get your learning roadmap.
              </p>
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <div className="p-4 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-indigo-600 group-hover:underline">Analyze Skills &rarr;</span>
            </div>
          </div>
        </motion.div>

        {/* COMMUNICATION TRAINER CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={() => router.push('/dashboard/communication')}
          className="cursor-pointer group"
        >
          <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                Communication Trainer
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Fix grammar & rephrase like a pro.
              </p>
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <div className="p-4 rounded-full bg-pink-50 group-hover:bg-pink-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-pink-600 group-hover:underline">Improve Communication &rarr;</span>
            </div>
          </div>
        </motion.div>
      </div>



    </div>
  );
};

export default Dashboard;
