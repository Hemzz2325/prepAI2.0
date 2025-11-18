"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function Addinterveiw() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [jobExperience, setJobExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("🔵 [1] Form submitted with:", { jobPosition, jobDesc, jobExperience })

      const InputPrompt = `Generate exactly 5 interview questions and answers for the following position.

Job Position: ${jobPosition}
Job Description/Tech Stack: ${jobDesc}
Years of Experience: ${jobExperience}

IMPORTANT: You MUST respond with ONLY a valid JSON array. No other text before or after.

Response format - must be exactly this structure:
[
  {"question": "What is...?", "answer": "The answer is..."},
  {"question": "How do...?", "answer": "You should..."}
]

Generate 5 questions and answers now. ONLY return the JSON array, nothing else.`

      console.log("🔵 [2] Sending to Gemini AI...")
      const result = await chatSession.sendMessage(InputPrompt)
      let rawResponse = result.response.text()
      console.log("🔵 [3] Got raw response, length:", rawResponse.length)

      // Clean response
      let cleaned = rawResponse
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .replace(/^\n+|\n+$/g, "")
        .trim()

      console.log("🔵 [4] After cleaning, length:", cleaned.length)

      // Extract JSON array
      const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (match) {
        cleaned = match[0]
        console.log("🔵 [5] Extracted JSON array, new length:", cleaned.length)
      }

      // Validate JSON
      let parsed
      try {
        parsed = JSON.parse(cleaned)
        console.log("🔵 [6] JSON is valid! Got", parsed.length, "questions")
      } catch (err) {
        console.error("❌ [ERROR] Invalid JSON:", err.message)
        alert("AI response was invalid. Please try again.")
        setLoading(false)
        return
      }

      // At this point we have valid JSON
      if (!cleaned || cleaned.length === 0) {
        console.error("❌ [ERROR] Cleaned JSON is empty after validation!")
        alert("Generated questions are empty. Please try again.")
        setLoading(false)
        return
      }

      console.log("🔵 [7] Starting database insert...")
      const mockId = uuidv4()
      const userEmail = user?.primaryEmailAddress?.emailAddress || 'anonymous'
      console.log("🔵 [8] Generated mockId:", mockId)
      console.log("🔵 [8b] Saving with user email:", userEmail)

      const dbResp = await db.insert(MockInterview).values({
        mockId: mockId,
        jsonMockResp: cleaned,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning()

      console.log("🔵 [9] Database insert response:", dbResp)
      console.log("🔵 [10] mockId to navigate with:", mockId)

      // Now navigate
      setOpenDialog(false)
      await new Promise(resolve => setTimeout(resolve, 300))

      const navigateUrl = `/dashboard/interveiw/${mockId}`
      console.log("🔵 [11] Navigating to:", navigateUrl)
      router.push(navigateUrl)
      console.log("🔵 [12] Navigation called")

    } catch (error) {
      console.error("❌ [ERROR] Caught error:", error.message)
      console.error("Stack:", error.stack)
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all border-dashed'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              Add Details about your job position/role, Job description and years of experience
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <div className='mt-7 my-3'>
                <label className="block mb-2">Job Role/Job Position</label>
                <Input
                  placeholder="Ex. Full Stack Developer"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className='my-3'>
                <label className="block mb-2">Job Description/ Tech Stack (In Short)</label>
                <Textarea
                  placeholder="Ex. React, Angular, NodeJs, MySql etc"
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className='my-3'>
                <label className="block mb-2">Years of experience</label>
                <Input
                  placeholder="Ex. 5"
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>

            <div className='flex gap-5 justify-end mt-5'>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className='animate-spin mr-2' />
                    Generating from AI
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Addinterveiw
