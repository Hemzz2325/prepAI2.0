"use client";
import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import { db } from '@/utils/db';
import { SavedQuestion } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { Bookmark } from 'lucide-react';
import { SavedQuestionsSkeleton } from '@/components/Skeletons';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

function SavedQuestions() {
    const { user } = useUser();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && GetSavedQuestions();
    }, [user]);

    const GetSavedQuestions = async () => {
        setLoading(true);
        try {
            const result = await db
                .select()
                .from(SavedQuestion)
                .where(eq(SavedQuestion.userEmail, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(SavedQuestion.createdAt));
            setQuestions(result);
        } catch (error) {
            console.error("Error fetching saved questions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 md:px-20 lg:px-32 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="flex items-center gap-4 mb-8">
                <BackButton className="" />
                <div>
                    <h2 className="font-bold text-3xl text-gray-900 dark:text-white">Saved Questions</h2>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Review your bookmarked interview questions.</p>
                </div>
            </div>

            {loading ? (
                <SavedQuestionsSkeleton />
            ) : questions.length > 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-6">
                    <Accordion type="single" collapsible className="w-full">
                        {questions.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/40 mb-2">
                                        <strong className="text-blue-700 block mb-1">AI Answer:</strong>
                                        {item.answer || "No answer saved."}
                                    </div>
                                    {item.tags && (
                                        <div className="flex gap-2 mt-2">
                                            {item.tags.split(',').map((tag, i) => (
                                                <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed">
                    <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No saved questions yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Bookmark tricky questions during your interviews to review them here.</p>
                </div>
            )}
        </div>
    );
}

export default SavedQuestions;
