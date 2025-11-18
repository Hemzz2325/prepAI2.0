"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { prepai, userAnswers } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2, Mic, StopCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [recognition, setRecognition] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const interviewId = resolvedParams.interveiwId;

        const response = await db
          .select()
          .from(prepai)
          .where(eq(prepai.mockId, interviewId));

        if (response && response.length > 0) {
          const data = response[0];
          setInterviewData(data);
          
          try {
            let jsonData = data.jsonMockResp.trim();
            
            // Clean up JSON
            jsonData = jsonData
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim();
            
            // Find JSON array boundaries
            const jsonStart = jsonData.indexOf('[');
            const jsonEnd = jsonData.lastIndexOf(']') + 1;
            
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
              jsonData = jsonData.substring(jsonStart, jsonEnd);
            }
            
            const questions = JSON.parse(jsonData);
            
            if (Array.isArray(questions) && questions.length > 0) {
              setMockInterviewQuestions(questions);
            } else {
              console.error("Invalid questions format");
              setMockInterviewQuestions([]);
            }
          } catch (parseError) {
            console.error("Error parsing questions:", parseError);
            console.error("Raw data:", data.jsonMockResp);
            setMockInterviewQuestions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswer(transcript);
        };

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.rate = 0.9;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const startRecording = () => {
    if (recognition) {
      setUserAnswer("");
      recognition.start();
      setIsRecording(true);
    } else {
      alert("Speech recognition not supported. Please type your answer.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const saveCurrentAnswer = () => {
    if (!userAnswer.trim()) {
      alert("Please provide an answer before saving!");
      return;
    }

    setAnswers({
      ...answers,
      [activeQuestionIndex]: userAnswer,
    });

    alert("Answer saved successfully!");
  };

  const handleNext = () => {
    if (activeQuestionIndex < mockInterviewQuestions.length - 1) {
      if (userAnswer.trim()) {
        setAnswers({
          ...answers,
          [activeQuestionIndex]: userAnswer,
        });
      }
      
      setActiveQuestionIndex(activeQuestionIndex + 1);
      setUserAnswer(answers[activeQuestionIndex + 1] || "");
    }
  };

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
      setUserAnswer(answers[activeQuestionIndex - 1] || "");
    }
  };

  const UpdateUserAnswerInDB = async (mockIdRef, question, correctAnswer, userAnswer) => {
    try {
      // Call the Gemini API route to get feedback
      const response = await fetch("/api/generate-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Question: ${question}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Based on the question and correct answer, evaluate the user's answer and provide:
1. rating: A number from 1-10
2. feedback: Detailed feedback in 3-5 lines explaining what was good and what could be improved.

Respond ONLY with valid JSON in this exact format:
{
  "rating": 8,
  "feedback": "Your detailed feedback here"
}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ok || !data.data) {
        throw new Error("Invalid response from Gemini API");
      }

      const geminiText = data.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean and parse the response
      let cleanedText = geminiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      // Find JSON object boundaries
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd);
      }

      const JsonFeedbackResp = JSON.parse(cleanedText);

      // Save to database
      await db.insert(userAnswers).values({
        mockIdRef: mockIdRef,
        question: question,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        feedback: JsonFeedbackResp.feedback || "No feedback provided",
        rating: (JsonFeedbackResp.rating || 5).toString(),
        userEmail: user?.primaryEmailAddress?.emailAddress || "guest",
        createdAt: Date.now(),
      });

      console.log("Feedback saved successfully");
    } catch (error) {
      console.error("Error saving feedback:", error);
      
      // Save with default values if AI fails
      await db.insert(userAnswers).values({
        mockIdRef: mockIdRef,
        question: question,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        feedback: "Unable to generate AI feedback at this time.",
        rating: "5",
        userEmail: user?.primaryEmailAddress?.emailAddress || "guest",
        createdAt: Date.now(),
      });
    }
  };

  const handleEndInterview = async () => {
    if (userAnswer.trim()) {
      answers[activeQuestionIndex] = userAnswer;
    }

    setIsSaving(true);
    setLoading(true);

    try {
      // Save all answered questions to database with AI feedback
      const promises = mockInterviewQuestions.map(async (question, index) => {
        if (answers[index]) {
          await UpdateUserAnswerInDB(
            interviewData.mockId,
            question.question,
            question.answer,
            answers[index]
          );
        }
      });

      await Promise.all(promises);
      
      router.push(`/dashboard/interveiw/${interviewData.mockId}/feedback`);
    } catch (error) {
      console.error("Error ending interview:", error);
      alert("Failed to save answers. Please try again.");
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading interview...</div>
      </div>
    );
  }

  if (!interviewData || mockInterviewQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">No interview questions found</div>
      </div>
    );
  }

  const currentQuestion = mockInterviewQuestions[activeQuestionIndex];

  return (
    <div className="p-5 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side - Questions */}
        <div className="flex flex-col gap-5">
          {/* Progress */}
          <div className="p-5 border rounded-lg bg-secondary">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">
                Question {activeQuestionIndex + 1} of {mockInterviewQuestions.length}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => textToSpeech(currentQuestion?.question)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((activeQuestionIndex + 1) / mockInterviewQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-5 border rounded-lg bg-blue-50 border-blue-200">
            <h2 className="text-lg font-semibold mb-3 text-blue-900">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* Note */}
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50">
            <div className="flex gap-2 items-start">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800">Note:</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Click on Record Answer when you want to answer the question. At the end of
                  interview we will give you the feedback along with correct answer for each
                  question and your answer to compare it.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3">
            <Button
              onClick={handlePrevious}
              disabled={activeQuestionIndex === 0}
              variant="outline"
            >
              Previous Question
            </Button>
            {activeQuestionIndex === mockInterviewQuestions.length - 1 ? (
              <Button 
                onClick={handleEndInterview} 
                className="bg-red-600 hover:bg-red-700"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "End Interview"}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                Next Question
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - Webcam & Recording */}
        <div className="flex flex-col gap-5">
          {/* Webcam */}
          <div className="flex flex-col items-center justify-center border rounded-lg p-5 bg-secondary">
            <Webcam
              mirrored={true}
              style={{
                height: 300,
                width: "100%",
                maxWidth: 400,
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-6 text-lg ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-6 w-6 mr-2" />
                  Recording... (Click to Stop)
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6 mr-2" />
                  Record Answer
                </>
              )}
            </Button>

            {/* Manual Text Input */}
            <div className="p-4 border rounded-lg">
              <label className="text-sm font-medium mb-2 block">
                Your Answer:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full min-h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Click 'Record Answer' to speak or type here..."
              />
              <Button
                onClick={saveCurrentAnswer}
                className="mt-2 w-full"
                variant="outline"
              >
                Save Answer
              </Button>
            </div>

            {/* Answer Status */}
            {answers[activeQuestionIndex] && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                ✓ Answer saved for this question
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;