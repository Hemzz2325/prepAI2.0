"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function AptitudeSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

    const handleOptionSelect = (option) => {
        if (!isSubmitted) {
            setSelectedOption(option);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            toast.error("Please select an option");
            return;
        }

        setLoading(true);
        setIsSubmitted(true);

        const isCorrect = selectedOption === currentQuestion.correctOption;
        const feedback = isCorrect
            ? "Correct Answer!"
            : `Incorrect. The correct answer is ${currentQuestion.correctOption}. ${currentQuestion.answer}`;

        try {
            await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: currentQuestion.question,
                correctAns: currentQuestion.correctOption,
                userAns: selectedOption,
                feedback: feedback,
                rating: isCorrect ? "10" : "0",
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format("DD-MM-YYYY"),
            });
            toast.success("Answer recorded!");
        } catch (error) {
            console.error("Error saving answer:", error);
            toast.error("Error saving answer");
        } finally {
            setLoading(false);
        }
    };

    // Reset state when question changes
    React.useEffect(() => {
        setSelectedOption(null);
        setIsSubmitted(false);
    }, [activeQuestionIndex]);

    return (
        <div className="flex flex-col mt-10 p-5 border rounded-lg bg-white dark:bg-gray-900 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Select the correct answer:</h2>

            <div className="grid grid-cols-1 gap-4">
                {currentQuestion?.options?.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all
              ${selectedOption === option ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:bg-gray-950'}
              ${isSubmitted && option === currentQuestion.correctOption ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
              ${isSubmitted && selectedOption === option && selectedOption !== currentQuestion.correctOption ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            `}
                    >
                        {option}
                    </div>
                ))}
            </div>

            {!isSubmitted && (
                <Button
                    className="mt-6 w-full md:w-auto self-end"
                    onClick={handleSubmit}
                    disabled={loading || !selectedOption}
                >
                    Submit Answer
                </Button>
            )}

            {isSubmitted && (
                <div className={`mt-6 p-4 rounded-lg ${selectedOption === currentQuestion.correctOption ? 'bg-green-100 dark:bg-green-900/30 text-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-800'}`}>
                    <strong>{selectedOption === currentQuestion.correctOption ? "Correct!" : "Incorrect!"}</strong>
                    <p className="mt-2 text-sm">{currentQuestion.answer}</p>
                </div>
            )}
        </div>
    );
}

export default AptitudeSection;
