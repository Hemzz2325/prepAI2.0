"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState, use } from 'react'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function StartInterview({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [interviewData, setInterviewData] = useState()
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const GetInterviewDetails = async () => {
      try {
        setLoading(true)
        console.log("Fetching interview with ID:", params?.interveiwId)
        
        if (!params?.interveiwId) {
          setError("Interview ID not provided")
          setLoading(false)
          return
        }

        const result = await db.select().from(MockInterview)
          .where(eq(MockInterview.mockId, params.interveiwId))

        console.log("Query result:", result)

        if (!result || result.length === 0) {
          console.error("No interview found with ID:", params.interveiwId)
          setError("Interview not found")
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
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex > 0 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
          <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
            <Button>End Interview</Button>
          </Link>
        }
      </div>
    </div>
  )
}

export default StartInterview
