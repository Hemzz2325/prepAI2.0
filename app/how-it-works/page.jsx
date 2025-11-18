'use client'
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
            <Image src="/logo.svg" alt="PrepAi Logo" width={60} height={80} />
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
        className="bg-linear-to-r from-green-600 to-blue-600 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            How PrepAi Works
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
            { icon: Brain, title: "1. Create Interview", text: "Select a job position, describe the tech stack..." , color: "green"},
            { icon: Mic, title: "2. Record Your Answers", text: "Enable your webcam and microphone...", color: "blue"},
            { icon: Zap, title: "3. AI Evaluation", text: "Our AI analyzes your answer...", color: "purple"},
            { icon: BarChart3, title: "4. Get Feedback Report", text: "Review detailed feedback...", color: "yellow"},
            { icon: CheckCircle, title: "5. Retake & Improve", text: "Practice again and track improvements...", color: "red"},
            { icon: Award, title: "6. Ace Your Interview", text: "Boost your confidence and skills...", color: "green"},
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className={`flex items-center justify-center w-12 h-12 bg-${item.color}-100 rounded-full mb-4`}>
                <item.icon className={`text-${item.color}-600 w-6 h-6`} />
              </div>

              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
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
              "AI-Generated Questions",
              "Real-Time Feedback",
              "Performance Tracking",
              "Privacy First",
              "Unlimited Retakes",
              "Multiple Jobs"
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature}</h3>
                  <p className="text-gray-600">Lorem ipsum placeholder explanation text.</p>
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
