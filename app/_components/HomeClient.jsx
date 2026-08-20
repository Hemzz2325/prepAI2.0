"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomeClient() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  // Redirect when logged in
  useEffect(() => {
    if (!showSplash && isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [showSplash, isLoaded, isSignedIn, router]);

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold text-white"
        >
          Placify AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white text-lg mt-3"
        >
          AI Interview Assistant
        </motion.p>
      </div>
    );
  }

  // Loading Clerk
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect UI after signing in
  if (isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Clean white landing page
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Watermark Words Background */}
      <div className="absolute inset-0 opacity-[0.05] select-none pointer-events-none z-0">
        <Watermark />
      </div>

      {/* Soft floating shapes */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-[100px] opacity-40"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-40"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl w-full text-center"
      >
        {/* Logo/Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium shadow-sm"
        >
          ✨ Your Personal AI Interview Coach
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight"
        >
          Master Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            Next Interview
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Practice with AI-generated questions, get real-time feedback, and analyze your resume to land your dream job.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <SignInButton mode="modal">
            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Get Started Free
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-6 px-8 text-lg rounded-full hover:bg-gray-50 transition-all">
              Create Account
            </Button>
          </SignUpButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Watermark Component */
const Watermark = () => {
  const words = [
    "Placify AI",
    "Fear of exams?",
    "Fear of aptitude?",
    "Want to get a job?",
    "Mock Interviews",
    "Boost Confidence",
  ];

  return (
    <div className="w-full h-full grid grid-cols-3 gap-14 p-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 1, delay: i * 0.05 }}
          className="text-2xl font-bold text-gray-700"
        >
          {words[i % words.length]}
        </motion.p>
      ))}
    </div>
  );
};
