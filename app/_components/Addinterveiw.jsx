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
    
    console.log("Form Data:", { jobPosition, jobDesc, jobExperience })

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

    try {
      console.log("Sending request to Gemini AI...")
      const result = await chatSession.sendMessage(InputPrompt)
      let MockJsonResp = result.response.text()

      console.log("Raw AI Response:", MockJsonResp)

      // Clean code blocks and extra characters
      MockJsonResp = MockJsonResp
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/g, "")
        .replace(/^\n+|\n+$/g, "") // Remove leading/trailing newlines
        .trim()

      // Extract JSON array if it's embedded in text
      const jsonMatch = MockJsonResp.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        MockJsonResp = jsonMatch[0]
      }

      console.log("Cleaned AI Response:", MockJsonResp)

      // Validate JSON before parsing
      let parsedResponse
      try {
        parsedResponse = JSON.parse(MockJsonResp)
        console.log("Parsed Response:", parsedResponse)
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError)
        console.error("Invalid JSON string:", MockJsonResp)
        alert(`AI returned invalid JSON: ${parseError.message}. Please try again.`)
        setLoading(false)
        return
      }

      if (MockJsonResp) {
        console.log("Inserting into database...")

        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress || 'anonymous',
            createdAt: moment().format('DD-MM-yyyy')
          })
          .returning()


        console.log("Database Insert Response:", resp)
        console.log("Response length:", resp?.length)
        console.log("First item:", resp?.[0])
        console.log("MockId value:", resp?.[0]?.mockId)

        if (resp && resp[0] && resp[0].mockId) {
          console.log("Insert successful, navigating to:", resp[0].mockId)
          setOpenDialog(false)
          // Add a small delay to ensure data is committed
          await new Promise(resolve => setTimeout(resolve, 500))
          router.push('/dashboard/interveiw/' + resp[0].mockId)
        } else {
          console.error("Failed to get mockId from response")
          alert("Failed to create interview. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error:", error)
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
