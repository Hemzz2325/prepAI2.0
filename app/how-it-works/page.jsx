'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Zap, Brain, BarChart3, Mic, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="Placify AI Logo" width={60} height={80} />
          </Link>

          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/upgrade">
              <Button className="bg-blue-600 hover:bg-blue-700">Upgrade</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Header */}
      <motion.div 
        className="bg-linear-to-r from-green-600 to-blue-600 text-white py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-4xl mx-auto px-0 ">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            How Placify AI Works
          </motion.h1>

          <motion.p
            className="text-lg opacity-90"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Master your interviews with AI-powered practice sessions
          </motion.p>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {[
            {
              icon: Brain,
              title: "1. Create Interview",
              text: "Select your target job position, enter the required tech stack, and specify your years of experience. Our AI will automatically generate a custom set of relevant technical and behavioral questions.",
              bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
              textClass: "text-emerald-600 dark:text-emerald-400",
            },
            {
              icon: Mic,
              title: "2. Record Your Answers",
              text: "Provide webcam and microphone access to simulate a real-world video call environment. Answer each question dynamically and submit your response whenever you are ready.",
              bgClass: "bg-blue-50 dark:bg-blue-950/30",
              textClass: "text-blue-600 dark:text-blue-400",
            },
            {
              icon: Zap,
              title: "3. AI Evaluation",
              text: "Our advanced AI processing pipeline analyzes your speech, clarity, tone, and technical accuracy. It evaluates your inputs against industry-standard rubrics and sample responses.",
              bgClass: "bg-purple-50 dark:bg-purple-950/30",
              textClass: "text-purple-600 dark:text-purple-400",
            },
            {
              icon: BarChart3,
              title: "4. Get Feedback Report",
              text: "Access a comprehensive dashboard highlighting your strong areas and spelling out key areas of improvement. You'll receive a detailed percentage score and actionable advice.",
              bgClass: "bg-amber-50 dark:bg-amber-950/30",
              textClass: "text-amber-600 dark:text-amber-400",
            },
            {
              icon: CheckCircle,
              title: "5. Retake & Improve",
              text: "Go back and re-answer the questions where your score was low to lock in the correct concepts. Watch your performance statistics improve attempt over attempt.",
              bgClass: "bg-rose-50 dark:bg-rose-950/30",
              textClass: "text-rose-600 dark:text-rose-400",
            },
            {
              icon: Award,
              title: "6. Ace Your Interview",
              text: "Build the comfort, muscle memory, and confidence needed to sit through challenging corporate loops. Walk into your real-world interviews fully prepared.",
              bgClass: "bg-teal-50 dark:bg-teal-950/30",
              textClass: "text-teal-600 dark:text-teal-400",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div>
                <div className={`flex items-center justify-center w-12 h-12 ${item.bgClass} rounded-xl mb-6`}>
                  <item.icon className={`${item.textClass} w-6 h-6`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
<motion.div 
  className="bg-white py-16"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.7 }}
>
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {[
        {
          title: "AI-Generated Questions",
          desc: "Questions tailored to your job role, tech stack and experience."
        },
        {
          title: "Real-Time Feedback",
          desc: "Instant voice, clarity, structure and correctness analysis."
        },
        {
          title: "Performance Tracking",
          desc: "See your growth across multiple attempts with clear metrics."
        },
        {
          title: "Privacy First",
          desc: "Your videos, audio and results stay private and encrypted."
        },
        {
          title: "Unlimited Retakes",
          desc: "Practice as many times as you want and improve faster."
        },
        {
          title: "Multiple Job Roles",
          desc: "Supports developer, HR, data analyst, marketing and more."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          className="flex gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        </motion.div>
      ))}

    </div>
  </div>
</motion.div>


      {/* CTA */}
      <motion.div 
        className="bg-green-600 text-white py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Join thousands of job seekers preparing for their dream interviews
          </motion.p>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Link href="/dashboard">
              <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Practicing Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
