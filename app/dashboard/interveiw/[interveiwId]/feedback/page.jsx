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
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto w-full">

      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500 text-center sm:text-left">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-500 text-center sm:text-left">
            Congratulations!
          </h2>

          <h2 className="font-bold text-xl sm:text-2xl mt-2 text-center sm:text-left">
            Here is your interview feedback
          </h2>

          <h2 className="text-primary text-base sm:text-lg my-3 text-center sm:text-left">
            Your overall interview rating: <strong>7/10</strong>
          </h2>

          <h2 className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Find below interview question with correct answer, Your answer and feedback for improvement
          </h2>

          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-6">

              <CollapsibleTrigger
                className="p-3 bg-secondary rounded-lg flex justify-between items-center 
                text-left w-full text-sm sm:text-base"
              >
                <span className="flex-1 pr-4">{item.question}</span>
                <ChevronsUpDown className="h-5 w-5 flex-shrink-0" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-col gap-3 mt-2">

                  <h2 className="text-red-500 p-2 border rounded-lg text-sm sm:text-base">
                    <strong>Rating: </strong>{item.rating}
                  </h2>

                  <h2 className="p-2 border rounded-lg bg-red-50 text-xs sm:text-sm text-red-900">
                    <strong>Your Answer: </strong>{item.userAns}
                  </h2>

                  <h2 className="p-2 border rounded-lg bg-green-50 text-xs sm:text-sm text-green-900">
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </h2>

                  <h2 className="p-2 border rounded-lg bg-blue-50 text-xs sm:text-sm text-primary">
                    <strong>Feedback: </strong>{item.feedback}
                  </h2>

                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <div className="mt-8 flex justify-center sm:justify-start">
        <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
      </div>

    </div>
  )
}

export default Feedback
