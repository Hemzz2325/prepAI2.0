"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LoaderCircle, Mic, Volume2, Play, CheckCircle, Timer } from "lucide-react";
import { useSpeech } from '../_hooks/useSpeech';
import { chatSession } from "@/utils/GeminiAIModel";
import { toast } from "sonner";

const SECTIONS = {
    READING: 'reading',
    EXTEMPORE: 'extempore',
    LISTENING: 'listening',
    RESULT: 'result'
};

const READING_TEXT = "Artificial intelligence is transforming the way we live and work. From self-driving cars to personalized recommendations, AI is everywhere. However, with great power comes great responsibility. We must ensure that these technologies are developed ethically and used for the benefit of all humanity.";

const EXTEMPORE_TOPICS = [
    "The impact of remote work on productivity",
    "Social media: A boon or a bane?",
    "The future of electric vehicles",
    "My biggest career challenge and how I overcame it",
    "Is work-life balance a myth?"
];

const LISTENING_SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Effective communication is the key to success in any organization.",
    "Please submit your project report by the end of the day."
];

export default function Assessment() {
    const [section, setSection] = useState(SECTIONS.READING);
    const [scores, setScores] = useState({ reading: 0, extempore: 0, listening: 0 });
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    // Extempore State
    const [topic, setTopic] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Listening State
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        speak
    } = useSpeech();

    // --- Reading Section ---
    const startReadingTest = () => {
        resetTranscript();
        startListening();
    };

    const finishReadingTest = async () => {
        stopListening();
        setLoading(true);
        // Simple comparison for now, or use Gemini for better scoring
        try {
            const prompt = `Compare the original text: "${READING_TEXT}" with the user's spoken text: "${transcript}". Rate the reading accuracy out of 10. Return ONLY the number.`;
            const result = await chatSession.sendMessage(prompt);
            const score = parseInt(result.response.text()) || 0;
            setScores(prev => ({ ...prev, reading: score }));
            setSection(SECTIONS.EXTEMPORE);
            setTopic(EXTEMPORE_TOPICS[Math.floor(Math.random() * EXTEMPORE_TOPICS.length)]);
        } catch (error) {
            console.error(error);
            toast.error("Error scoring reading test");
        } finally {
            setLoading(false);
            resetTranscript();
        }
    };

    // --- Extempore Section ---
    useEffect(() => {
        let timer;
        if (isTimerRunning && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            finishExtempore();
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const startExtempore = () => {
        setIsTimerRunning(true);
        startListening();
    };

    const finishExtempore = async () => {
        setIsTimerRunning(false);
        stopListening();
        setLoading(true);
        try {
            const prompt = `Analyze this extempore speech on the topic "${topic}": "${transcript}". Rate the fluency, relevance, and grammar out of 10. Return ONLY the number.`;
            const result = await chatSession.sendMessage(prompt);
            const score = parseInt(result.response.text()) || 0;
            setScores(prev => ({ ...prev, extempore: score }));
            setSection(SECTIONS.LISTENING);
        } catch (error) {
            console.error(error);
            toast.error("Error scoring extempore");
        } finally {
            setLoading(false);
            resetTranscript();
        }
    };

    // --- Listening Section ---
    const playSentence = () => {
        speak(LISTENING_SENTENCES[currentSentenceIndex]);
    };

    const startListeningTest = () => {
        resetTranscript();
        startListening();
    };

    const finishListeningTest = async () => {
        stopListening();
        setLoading(true);
        try {
            const target = LISTENING_SENTENCES[currentSentenceIndex];
            const prompt = `Compare the target sentence: "${target}" with the user's repetition: "${transcript}". Rate the accuracy out of 10. Return ONLY the number.`;
            const result = await chatSession.sendMessage(prompt);
            const score = parseInt(result.response.text()) || 0;

            // If more sentences, go to next, else finish
            if (currentSentenceIndex < LISTENING_SENTENCES.length - 1) {
                setScores(prev => ({ ...prev, listening: (prev.listening + score) / 2 })); // Average it roughly
                setCurrentSentenceIndex(prev => prev + 1);
                resetTranscript();
            } else {
                setScores(prev => ({ ...prev, listening: (prev.listening + score) / 2 }));
                await generateFinalReport();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error scoring listening test");
        } finally {
            setLoading(false);
        }
    };

    const generateFinalReport = async () => {
        setSection(SECTIONS.RESULT);
        setLoading(true);
        try {
            const prompt = `Generate a brief feedback report for a communication assessment. 
            Scores (out of 10): Reading: ${scores.reading}, Extempore: ${scores.extempore}, Listening: ${scores.listening}.
            Provide 3 bullet points on strengths and 3 on areas for improvement.`;
            const result = await chatSession.sendMessage(prompt);
            setFeedback(result.response.text());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Render Helpers ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <LoaderCircle className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Analyzing your performance...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            {/* PROGRESS HEADER */}
            <div className="flex justify-between mb-8 text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <span className={section === SECTIONS.READING ? "text-blue-600" : ""}>1. Reading</span>
                <span className={section === SECTIONS.EXTEMPORE ? "text-blue-600" : ""}>2. Extempore</span>
                <span className={section === SECTIONS.LISTENING ? "text-blue-600" : ""}>3. Listening</span>
                <span className={section === SECTIONS.RESULT ? "text-blue-600" : ""}>4. Result</span>
            </div>

            {/* READING SECTION */}
            {section === SECTIONS.READING && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reading Assessment</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Read the following paragraph aloud clearly and at a natural pace.</p>

                    <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
                        <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-medium">{READING_TEXT}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {!isListening ? (
                            <Button onClick={startReadingTest} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                                <Mic className="w-4 h-4 mr-2" /> Start Recording
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                <div className="animate-pulse text-red-500 font-bold mb-4 flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    Recording...
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4 text-center max-w-md italic">"{transcript}"</p>
                                <Button onClick={finishReadingTest} variant="destructive" className="w-full md:w-auto">
                                    Stop & Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* EXTEMPORE SECTION */}
            {section === SECTIONS.EXTEMPORE && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Extempore Speech</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Speak on the topic below for 1 minute.</p>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-xl border border-purple-100 mb-6 text-center">
                        <h3 className="text-xl font-bold text-purple-900 mb-2">Topic:</h3>
                        <p className="text-2xl text-purple-700 font-bold">{topic}</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl font-mono font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                            <Timer className="w-8 h-8 mr-2 text-gray-400 dark:text-gray-500" />
                            {timeLeft}s
                        </div>

                        {!isTimerRunning ? (
                            <Button onClick={startExtempore} className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
                                <Mic className="w-4 h-4 mr-2" /> Start Speaking
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                <div className="animate-pulse text-red-500 font-bold mb-4">Recording...</div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4 text-center max-w-md italic">"{transcript}"</p>
                                <Button onClick={finishExtempore} variant="destructive" className="w-full md:w-auto">
                                    Finish Early
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* LISTENING SECTION */}
            {section === SECTIONS.LISTENING && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Listening Assessment</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Listen to the sentence and repeat it exactly.</p>

                    <div className="flex justify-center mb-8">
                        <Button onClick={playSentence} variant="outline" className="h-24 w-24 rounded-full border-4 border-blue-100 dark:border-blue-800/40 hover:bg-blue-50 dark:bg-blue-900/20">
                            <Volume2 className="w-10 h-10 text-blue-600" />
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {!isListening ? (
                            <Button onClick={startListeningTest} className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                                <Mic className="w-4 h-4 mr-2" /> Record Answer
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                <div className="animate-pulse text-red-500 font-bold mb-4">Recording...</div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4 text-center max-w-md italic">"{transcript}"</p>
                                <Button onClick={finishListeningTest} variant="destructive" className="w-full md:w-auto">
                                    Submit Answer
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* RESULT SECTION */}
            {section === SECTIONS.RESULT && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="mb-8 inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Assessment Complete!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">Here is your performance breakdown.</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="text-sm text-blue-600 font-semibold mb-1">Reading</div>
                            <div className="text-3xl font-bold text-blue-900">{scores.reading}/10</div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Extempore</div>
                            <div className="text-3xl font-bold text-purple-900">{scores.extempore}/10</div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="text-sm text-green-600 font-semibold mb-1">Listening</div>
                            <div className="text-3xl font-bold text-green-900">{Math.round(scores.listening)}/10</div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">AI Feedback</h3>
                        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                            <pre className="whitespace-pre-wrap font-sans">{feedback}</pre>
                        </div>
                    </div>

                    <Button onClick={() => window.location.reload()} className="mt-8" variant="outline">
                        Take Test Again
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
