'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Zap, Brain, BarChart3, Mic, Award } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="PrepAi Logo" width={60} height={80} />
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/upgrade">
              <Button className="bg-blue-600 hover:bg-blue-700">Upgrade</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">How PrepAi Works</h1>
          <p className="text-lg opacity-90">Master your interviews with AI-powered practice sessions</p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Brain className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Create Interview</h3>
            <p className="text-gray-600">
              Select a job position, describe the tech stack, and enter your experience level. Our AI generates 5 relevant interview questions instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Mic className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Record Your Answers</h3>
            <p className="text-gray-600">
              Enable your webcam and microphone. Answer each question naturally. Your speech is converted to text in real-time using advanced speech recognition.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Zap className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. AI Evaluation</h3>
            <p className="text-gray-600">
              Our AI analyzes your answer against the expected response. You get instant feedback on areas for improvement and a rating out of 10.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <BarChart3 className="text-yellow-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Get Feedback Report</h3>
            <p className="text-gray-600">
              Review detailed feedback for each question. See your overall rating, expected answers, and personalized improvement suggestions.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <CheckCircle className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">5. Retake & Improve</h3>
            <p className="text-gray-600">
              Practice the same interview again to improve your answers. Track your progress and monitor skill improvement over time.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Award className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">6. Ace Your Interview</h3>
            <p className="text-gray-600">
              With consistent practice and AI feedback, boost your confidence and interview skills. Ready to impress your future employer!
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">AI-Generated Questions</h3>
                <p className="text-gray-600">Questions are generated based on real job descriptions and industry standards</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Real-Time Feedback</h3>
                <p className="text-gray-600">Get instant AI feedback after each answer with actionable improvements</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Performance Tracking</h3>
                <p className="text-gray-600">Track your progress across multiple interviews and measure improvement</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Privacy First</h3>
                <p className="text-gray-600">Your videos are never recorded. Practice with complete privacy and confidence</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Unlimited Retakes</h3>
                <p className="text-gray-600">Practice the same interview multiple times to perfect your answers</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="text-green-600 w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Multiple Jobs</h3>
                <p className="text-gray-600">Create and practice interviews for different job positions and companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of job seekers preparing for their dream interviews</p>
          <Link href="/dashboard">
            <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Practicing Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
