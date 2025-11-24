'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
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
          PrepAi
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Watermark Words Background */}
      <div className="absolute inset-0 opacity-[0.05] select-none pointer-events-none z-0">
        <Watermark />
      </div>

      {/* Soft floating shapes */}
      <motion.div
        className="absolute top-12 left-12 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-60"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"
        animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full bg-white rounded-3xl shadow-[0_6px_30px_rgba(0,0,0,0.08)] p-10 border border-gray-100 backdrop-blur-lg"
      >
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-green-600 tracking-tight">
            PrepAi
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your AI-powered mock interview accelerator.
          </p>
        </motion.div>

        {/* Welcome Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800">Welcome!</h2>
          <p className="text-sm text-gray-600 mt-1">
            Get personalized questions and real-time analysis.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <SignInButton mode="modal">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 shadow-md transition-all rounded-xl">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-md transition-all rounded-xl">
              Sign Up
            </Button>
          </SignUpButton>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm"
        >
          Start preparing for your next interview today.
        </motion.div>

      </motion.div>
    </div>
  );
}


/* Watermark Component */
const Watermark = () => {
  const words = [
    "PrepAi",
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
