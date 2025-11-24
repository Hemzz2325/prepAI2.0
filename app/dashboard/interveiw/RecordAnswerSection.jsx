"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState, use } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [feedbackList, setFeedbackList] = useState([])
  const [overallRating, setOverallRating] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (params?.interveiwId) {
      GetFeedback()
    }
  }, [params?.interveiwId])

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interveiwId))
      .orderBy(UserAnswer.id)

    console.log(result)
    setFeedbackList(result)
    
    // Calculate overall rating based on individual ratings
    if (result && result.length > 0) {
      const totalRating = result.reduce((sum, item) => {
        // Parse rating as number, default to 0 if invalid
        const rating = parseFloat(item.rating) || 0
        return sum + rating
      }, 0)
      
      const avgRating = (totalRating / result.length).toFixed(1)
      setOverallRating(avgRating)
    }
  }

  // Helper function to get rating color
  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating)
    if (numRating >= 8) return 'text-green-600'
    if (numRating >= 6) return 'text-blue-600'
    if (numRating >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Helper function to get rating badge color
  const getRatingBadgeColor = (rating) => {
    const numRating = parseFloat(rating)
    if (numRating >= 8) return 'bg-green-100 text-green-800 border-green-300'
    if (numRating >= 6) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (numRating >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  // Helper function to get performance message
  const getPerformanceMessage = (rating) => {
    const numRating = parseFloat(rating)
    if (numRating >= 8) return 'Excellent Performance! 🎉'
    if (numRating >= 6) return 'Good Job! Keep practicing! 👍'
    if (numRating >= 4) return 'Room for Improvement 📚'
    return 'Needs More Practice 💪'
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto w-full">

      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500 text-center sm:text-left">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className={`text-2xl sm:text-3xl font-bold text-center sm:text-left ${getRatingColor(overallRating)}`}>
            {getPerformanceMessage(overallRating)}
          </h2>

          <h2 className="font-bold text-xl sm:text-2xl mt-2 text-center sm:text-left">
            Here is your interview feedback
          </h2>

          {/* Overall Rating Display */}
          <div className="my-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Overall Interview Rating</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-4xl font-bold ${getRatingColor(overallRating)}`}>
                    {overallRating}
                  </span>
                  <span className="text-2xl text-gray-400">/10</span>
                </div>
              </div>
              
              {/* Rating breakdown */}
              <div className="text-right">
                <div className="text-sm text-gray-600">Based on {feedbackList.length} questions</div>
                <div className="mt-2 flex gap-2 justify-end">
                  {feedbackList.map((item, index) => (
                    <span 
                      key={index}
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRatingBadgeColor(item.rating)}`}
                    >
                      {item.rating}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xs sm:text-sm text-gray-500 text-center sm:text-left mb-6">
            Find below interview questions with correct answers, your answers and detailed feedback for improvement
          </h2>

          {/* Individual Question Feedback */}
          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-6">

              <CollapsibleTrigger
                className="p-3 bg-secondary rounded-lg flex justify-between items-center 
                text-left w-full text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <span className="font-semibold">Question {index + 1}:</span> {item.question}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingBadgeColor(item.rating)}`}>
                    {item.rating}/10
                  </span>
                  <ChevronsUpDown className="h-5 w-5" />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-col gap-3 mt-2">

                  <h2 className={`p-3 border rounded-lg font-semibold ${getRatingBadgeColor(item.rating)}`}>
                    <strong>Rating: </strong>{item.rating}/10
                  </h2>

                  <h2 className="p-3 border rounded-lg bg-red-50 text-xs sm:text-sm text-red-900">
                    <strong>Your Answer: </strong>
                    {item.userAns || <span className="text-red-400 italic">No answer recorded</span>}
                  </h2>

                  <h2 className="p-3 border rounded-lg bg-green-50 text-xs sm:text-sm text-green-900">
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </h2>

                  <h2 className="p-3 border rounded-lg bg-blue-50 text-xs sm:text-sm text-primary">
                    <strong>Feedback: </strong>{item.feedback}
                  </h2>

                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Performance Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Performance Summary</h3>
            <p className="text-sm text-gray-600">
              {parseFloat(overallRating) >= 8 && "Outstanding performance! You demonstrated strong knowledge and communication skills."}
              {parseFloat(overallRating) >= 6 && parseFloat(overallRating) < 8 && "Good work! You have a solid foundation. Review the feedback to strengthen weak areas."}
              {parseFloat(overallRating) >= 4 && parseFloat(overallRating) < 6 && "You're on the right track. Focus on the feedback points and practice more to improve your scores."}
              {parseFloat(overallRating) < 4 && "Keep practicing! Review the correct answers and feedback carefully. Consider researching the topics more deeply."}
            </p>
          </div>
        </>
      )}

      <div className="mt-8 flex justify-center sm:justify-start">
        <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
      </div>

    </div>
  )
}

export default Feedback