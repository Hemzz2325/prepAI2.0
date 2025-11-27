"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState, use } from 'react'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import AptitudeSection from './_components/AptitudeSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function StartInterview({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [interviewData, setInterviewData] = useState()
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Debug logs
  useEffect(() => {
    console.log("========== START PAGE DEBUG ==========")
    console.log("Window location href:", typeof window !== 'undefined' ? window.location.href : 'N/A')
    console.log("Raw params from URL:", params)
    console.log("params.interveiwId:", params?.interveiwId)
    console.log("All params keys:", Object.keys(params || {}))
    console.log("=========================================")
  }, [params])

  useEffect(() => {
    const GetInterviewDetails = async () => {
      try {
        setLoading(true)
        const interviewId = params?.interveiwId
        console.log("Starting GetInterviewDetails with ID:", interviewId)

        if (!interviewId) {
          console.error("Interview ID is missing or undefined")
          setError("Interview ID not provided in URL")
          setLoading(false)
          return
        }

        console.log("Querying database for mockId:", interviewId)
        let result = await db.select().from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId))

        console.log("Database query result by mockId:", result)

        // If not found by mockId, try querying all and find by mockId
        if (!result || result.length === 0) {
          console.log("Not found by mockId, trying alternate query...")
          const allResults = await db.select().from(MockInterview)
          console.log("All interviews in DB:", allResults)

          // Find the one with matching mockId
          result = allResults.filter(item => item.mockId === interviewId)
          console.log("Filtered result:", result)
        }

        if (!result || result.length === 0) {
          console.error("No interview found with ID:", interviewId)
          setError("Interview not found. Please create a new one.")
          setLoading(false)
          return
        }

        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        console.log("Parsed questions:", jsonMockResp)
        setMockInterviewQuestion(jsonMockResp)
        setInterviewData(result[0])
      } catch (err) {
        console.error("Error fetching interview details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    GetInterviewDetails()
  }, [params?.interveiwId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading interview...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>
  }

  if (!mockInterviewQuestion) {
    return <div className="flex items-center justify-center h-screen">No questions found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col">
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow'>
        {/* Left: Questions */}
        <div className="order-2 lg:order-1">
          <QuestionsSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
          />
        </div>

        {/* Right: Camera/Answer */}
        <div className="order-1 lg:order-2">
          {interviewData?.interviewRound === "Aptitude & Scenario-Based Round" ? (
            <AptitudeSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          ) : (
            <RecordAnswerSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          )}
        </div>
      </div>

      {/* Navigation Buttons - Sticky Bottom */}
      <div className='sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mt-4 shadow-lg rounded-t-2xl'>
        <div className='flex justify-between items-center max-w-7xl mx-auto'>
          <div className="text-sm text-gray-500">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion?.length}
          </div>

          <div className="flex gap-4">
            {activeQuestionIndex > 0 &&
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              >
                ← Previous
              </Button>}

            {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              >
                Next →
              </Button>}

            {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
              <Link href={'/dashboard/interveiw/' + interviewData?.mockId + "/feedback"}>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8">End Interview</Button>
              </Link>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartInterview
