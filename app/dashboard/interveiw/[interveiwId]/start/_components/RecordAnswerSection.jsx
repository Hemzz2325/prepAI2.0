'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

// Import speech recognition from browser API instead
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [interimResult, setInterimResult] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    const recognition = recognitionRef.current

    // Allow continuous listening
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setFinalTranscript(prev => prev + transcript + ' ')
        } else {
          interim += transcript
        }
      }
      setInterimResult(interim)
    }

    recognition.onerror = (event) => {
      setError(event.error)
    }

    return () => recognition.abort()
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setFinalTranscript('')
      setInterimResult('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    interimResult,
    finalTranscript,
    error,
    startListening,
    stopListening,
  }
}

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const {
    isListening,
    interimResult,
    finalTranscript,
    error,
    startListening,
    stopListening,
  } = useSpeechRecognition()

  useEffect(() => {
    if (finalTranscript) {
      setUserAnswer(prevAns => prevAns + finalTranscript)
    }
  }, [finalTranscript])

  useEffect(() => {
    if (!isListening && userAnswer.length > 10) {
      UpdateUserAnswer()
    }
  }, [userAnswer, isListening])

  const StartStopRecording = async () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const UpdateUserAnswer = async () => {
    console.log(userAnswer)
    setLoading(true)
    try {
      const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer:" + userAnswer + ",Depends on question and user answer for give interview question " +
        " please give us rating for answer and feedback as area of improvement if any " +
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

      // Retry logic with exponential backoff
      let retries = 3
      let delay = 1000 // Start with 1 second
      let result = null

      for (let i = 0; i < retries; i++) {
        try {
          result = await chatSession.sendMessage(feedbackPrompt)
          break // Success, exit retry loop
        } catch (error) {
          if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
            if (i < retries - 1) {
              console.log(`Rate limit hit, retrying in ${delay}ms...`)
              await new Promise(resolve => setTimeout(resolve, delay))
              delay *= 2 // Exponential backoff
            } else {
              throw new Error('API rate limit exceeded. Please wait a moment before recording another answer.')
            }
          } else {
            throw error // Re-throw non-rate-limit errors
          }
        }
      }

      let mockJsonResp = result.response.text()
      // Remove markdown code blocks
      mockJsonResp = mockJsonResp
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/^\n+|\n+$/g, '')
        .trim()

      // Extract JSON object if needed
      const jsonMatch = mockJsonResp.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        mockJsonResp = jsonMatch[0]
      }

      console.log('Cleaned JSON:', mockJsonResp)
      const JsonFeedbackResp = JSON.parse(mockJsonResp)

      const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy')
        })

      if (resp) {
        toast('User Answer recorded successfully')
        setUserAnswer('')
      }
    } catch (error) {
      console.error('Error updating answer:', error)
      if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
        toast.error('API rate limit reached. Please wait 10-15 seconds before recording another answer.')
      } else {
        toast.error('Error saving answer: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center flex-col h-full max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col justify-center items-center bg-black rounded-2xl p-1 w-full relative overflow-hidden shadow-lg border-4 border-gray-900'>
        <Image src={'/webcam.png'} width={150} height={150} alt="Webcam icon" className='absolute opacity-50' />
        <Webcam
          mirrored={true}
          style={{
            height: '100%',
            width: '100%',
            zIndex: 10,
            borderRadius: '12px',
            aspectRatio: '16/9',
            maxHeight: '400px'
          }}
        />
      </div>

      <div className="mt-6 w-full">
        <Button
          disabled={loading}
          className={`w-full py-6 text-base font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-xl
            ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          onClick={StartStopRecording}
        >
          {isListening ? (
            <span className='flex gap-2 items-center justify-center'>
              <StopCircle className="h-6 w-6" /> Stop Recording
            </span>
          ) : (
            <span className='flex gap-2 items-center justify-center'>
              <Mic className="h-6 w-6" /> Record Answer
            </span>
          )}
        </Button>
        <p className="text-center text-gray-400 mt-3 text-xs">
          {isListening ? "Listening... Speak clearly." : "Click to start recording your answer."}
        </p>
      </div>
    </div>
  )
}

export default RecordAnswerSection
