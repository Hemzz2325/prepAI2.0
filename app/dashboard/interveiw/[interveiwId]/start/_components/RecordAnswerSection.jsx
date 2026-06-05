'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle, Bookmark, CheckCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer, SavedQuestion } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { eq } from 'drizzle-orm'

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
  const [isSaved, setIsSaved] = useState(false)
  const [answerSaved, setAnswerSaved] = useState(false)
  const [speechStats, setSpeechStats] = useState({ wpm: 0, fillerCount: 0, duration: 0 })
  const startTimeRef = useRef(null)
  const timerRef = useRef(null)

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

  // Speech Analysis & Timer Logic
  useEffect(() => {
    if (isListening) {
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        const durationInSeconds = (Date.now() - startTimeRef.current) / 1000

        // Analyze current answer
        const currentText = userAnswer + interimResult
        const words = currentText.trim().split(/\s+/)
        const wordCount = words.length
        const wpm = Math.round(wordCount / (durationInSeconds / 60)) || 0

        const fillers = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally']
        const fillerCount = words.filter(w => fillers.includes(w.toLowerCase().replace(/[^a-z]/g, ''))).length

        setSpeechStats({
          wpm,
          fillerCount,
          duration: Math.round(durationInSeconds)
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isListening, userAnswer, interimResult])

  // REMOVED: Auto-save useEffect
  // useEffect(() => {
  //   if (!isListening && userAnswer.length > 10) {
  //     UpdateUserAnswer()
  //   }
  // }, [userAnswer, isListening])

  // Check if question is already saved
  useEffect(() => {
    const checkSaved = async () => {
      if (user && mockInterviewQuestion[activeQuestionIndex]) {
        const result = await db.select().from(SavedQuestion)
          .where(eq(SavedQuestion.question, mockInterviewQuestion[activeQuestionIndex].question))
          .where(eq(SavedQuestion.userEmail, user?.primaryEmailAddress?.emailAddress))

        if (result.length > 0) setIsSaved(true)
        else setIsSaved(false)
      }
    }
    checkSaved()
    setAnswerSaved(false) // Reset answer saved state when question changes
    setUserAnswer('') // Reset user answer
  }, [activeQuestionIndex, user])

  const StartStopRecording = async () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSaveQuestion = async () => {
    try {
      if (isSaved) {
        toast.info("Question already saved.")
        return
      }

      await db.insert(SavedQuestion).values({
        userEmail: user?.primaryEmailAddress?.emailAddress,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        answer: mockInterviewQuestion[activeQuestionIndex]?.answer, // AI Answer
        tags: interviewData?.jobPosition, // Use job position as tag
        createdAt: moment().format('DD-MM-YYYY')
      })
      setIsSaved(true)
      toast.success("Question saved to bookmarks!")
    } catch (error) {
      console.error("Error saving question:", error)
      toast.error("Failed to save question.")
    }
  }

  const UpdateUserAnswer = async () => {
    if (!userAnswer || userAnswer.trim().length < 5) {
      toast.error('Please record a longer answer before saving.');
      return;
    }

    setLoading(true);
    const question = mockInterviewQuestion[activeQuestionIndex]?.question;
    const correctAns = mockInterviewQuestion[activeQuestionIndex]?.answer;
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const today = moment().format('DD-MM-YYYY');

    try {
      // ── STEP 1: Save answer to DB immediately (no AI wait) ──────────────────
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question,
        correctAns,
        userAns: userAnswer,
        feedback: 'Generating feedback…',
        rating: '0',
        userEmail,
        createdAt: today,
      });

      toast.success('Answer saved! Generating AI feedback in background…');
      setAnswerSaved(true);
      setSpeechStats({ wpm: 0, fillerCount: 0, duration: 0 });
      setLoading(false);

      // ── STEP 2: Run AI feedback async in background ────────────────────────
      (async () => {
        try {
          const feedbackPrompt =
            `Question: ${question}\nUser Answer: ${userAnswer}\n` +
            `Give a rating (1-10) and 3-5 lines of feedback as a JSON object with "rating" and "feedback" fields. ` +
            `No markdown, just raw JSON.`;

          let retries = 3, delay = 1000, result = null;
          for (let i = 0; i < retries; i++) {
            try {
              result = await chatSession.sendMessage(feedbackPrompt);
              break;
            } catch (err) {
              if ((err.message.includes('429') || err.message.includes('exhausted')) && i < retries - 1) {
                await new Promise(r => setTimeout(r, delay));
                delay *= 2;
              } else throw err;
            }
          }

          let raw = result.response.text()
            .replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) raw = jsonMatch[0];
          const fb = JSON.parse(raw);

          // Update the row we just inserted
          const { eq, and } = await import('drizzle-orm');
          await db.update(UserAnswer)
            .set({ feedback: fb?.feedback, rating: String(fb?.rating) })
            .where(
              and(
                eq(UserAnswer.mockIdRef, interviewData?.mockId),
                eq(UserAnswer.question, question),
                eq(UserAnswer.userEmail, userEmail)
              )
            );
          toast.success('AI feedback ready! Check your results at the end.');
        } catch (bgErr) {
          console.error('Background AI feedback failed:', bgErr);
          // Non-blocking — answer is already saved; feedback just stays as placeholder
        }
      })();

    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Error saving answer: ' + error.message);
      setLoading(false);
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

        {/* Speech Analysis Overlay */}
        {isListening && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl text-white text-xs space-y-1 border border-white/10">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${speechStats.wpm > 150 ? 'bg-red-500' : speechStats.wpm < 100 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                <span>Pace: <strong>{speechStats.wpm} WPM</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${speechStats.fillerCount > 3 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span>Fillers: <strong>{speechStats.fillerCount}</strong></span>
              </div>
              <div className="text-gray-400 dark:text-gray-500">Time: {speechStats.duration}s</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 w-full space-y-4">
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

        {/* Manual Save Button - Only show if answer exists and not listening */}
        {!isListening && userAnswer.length > 5 && !answerSaved && (
          <Button
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-md transition-all"
            onClick={UpdateUserAnswer}
          >
            {loading ? 'Saving...' : <span className='flex gap-2 items-center justify-center'><Save className="h-4 w-4" /> Save Answer</span>}
          </Button>
        )}

        {answerSaved && (
          <div className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-xl font-semibold text-center border border-green-200 flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5" /> Answer Saved
          </div>
        )}

        <div className="flex justify-between items-center px-2">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            {isListening ? "Listening... Speak clearly." : "Click to start recording your answer."}
          </p>

          <Button
            variant="ghost"
            size="sm"
            className={`text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-blue-600 gap-1 ${isSaved ? 'text-blue-600' : ''}`}
            onClick={handleSaveQuestion}
            disabled={isSaved}
          >
            {isSaved ? <CheckCircle className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {isSaved ? "Saved" : "Save Question"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RecordAnswerSection
