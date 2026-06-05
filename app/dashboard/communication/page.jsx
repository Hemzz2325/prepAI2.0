"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { chatSession } from "@/utils/GeminiAIModel";
import { toast } from "sonner";
import { LoaderCircle, CheckCircle, Sparkles, Briefcase, Mic, Volume2, StopCircle, GraduationCap, Lock } from "lucide-react";
import BackButton from '@/components/BackButton';
import { useSpeech } from "./_hooks/useSpeech";
import Assessment from "./_components/Assessment";
import { usePlan } from "@/hooks/usePlan";
import Link from "next/link";

function CommunicationTrainer() {
    const [activeTab, setActiveTab] = useState("practice");
    const [mode, setMode] = useState("grammar");
    const [outputText, setOutputText] = useState(null);
    const [loading, setLoading] = useState(false);
    const { canUse, used, limit, consume } = usePlan("communicationSessions");

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeech();

    const modes = [
        {
            id: "grammar",
            title: "Grammar Fixer",
            icon: CheckCircle,
            description: "Speak naturally and I'll fix your grammar",
            color: "green"
        },
        {
            id: "rephrase",
            title: "Technical Rephraser",
            icon: Sparkles,
            description: "Explain code and I'll make it professional",
            color: "blue"
        },
        {
            id: "manager",
            title: "Manager Mode",
            icon: Briefcase,
            description: "Practice explaining to non-tech stakeholders",
            color: "purple"
        }
    ];

    const currentMode = modes.find(m => m.id === mode);

    const processSpeech = async () => {
        if (!transcript.trim()) { toast.error("Please speak something first"); return; }
        if (!canUse) { toast.error(`Weekly limit reached (${used}/${limit}). Upgrade to Pro!`); return; }
        setLoading(true);
        setOutputText(null);
        // consume one slot
        await consume();
        try {
            const baseInstruction = `
            Analyze the following spoken text. 
            Return a JSON object with this exact structure:
            {
                "corrected": "The improved version of the text",
                "feedback": ["Specific point 1", "Specific point 2"],
                "improvements": "Brief explanation of why changes were made",
                "fillerWords": ["word1", "word2"]
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
            `;

            let prompt = "";
            if (mode === "grammar") {
                prompt = `${baseInstruction}
                Task: Fix grammar, fluency, and sentence structure errors. Keep the tone natural but professional.
                Input Text: "${transcript}"`;
            } else if (mode === "rephrase") {
                prompt = `${baseInstruction}
                Task: Rephrase this technical explanation to be clearer, more professional, and remove unnecessary jargon while keeping essential technical terms.
                Input Text: "${transcript}"`;
            } else if (mode === "manager") {
                prompt = `${baseInstruction}
                Task: Rewrite this to explain the technical concept to a non-technical manager. Focus on business value, impact, and ROI. Avoid deep technical details.
                Input Text: "${transcript}"`;
            }

            const result = await chatSession.sendMessage(prompt);
            const responseText = result.response.text().replace(/```json|```/g, "").trim();
            const jsonResponse = JSON.parse(responseText);

            setOutputText(jsonResponse);
            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Error processing text:", error);
            toast.error("Failed to process. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center relative"
                >
                    <div className="absolute left-0 top-0">
                        <BackButton variant="inline" className="mb-0" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Communication <span className="text-pink-600">Trainer</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Master your communication skills with AI-powered speech analysis and corporate-style assessments.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex">
                        <button
                            onClick={() => setActiveTab("practice")}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "practice"
                                ? "bg-pink-600 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950"
                                }`}
                        >
                            <Mic className="w-4 h-4 inline-block mr-2" />
                            Speech Practice
                        </button>
                        <button
                            onClick={() => setActiveTab("assessment")}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "assessment"
                                ? "bg-pink-600 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950"
                                }`}
                        >
                            <GraduationCap className="w-4 h-4 inline-block mr-2" />
                            Mock Assessment
                        </button>
                    </div>
                </div>

                {/* PRACTICE MODE */}
                {activeTab === "practice" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Mode Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {modes.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${mode === m.id
                                        ? `border-${m.color}-500 bg-${m.color}-50`
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:border-gray-600"
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg inline-block mb-2 bg-${m.color}-100`}>
                                        <m.icon className={`w-5 h-5 text-${m.color}-600`} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{m.title}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{m.description}</p>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recording Area */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[500px]">
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all ${isListening ? "bg-red-50 dark:bg-red-900/20 animate-pulse" : "bg-gray-50 dark:bg-gray-950"
                                    }`}>
                                    <Mic className={`w-12 h-12 ${isListening ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
                                </div>

                                <div className="text-center mb-8 w-full">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {isListening ? "Listening..." : "Tap to Speak"}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-md mx-auto italic min-h-[3rem]">
                                        "{transcript || "Your speech will appear here..."}"
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    {!isListening ? (
                                        <Button
                                            onClick={startListening}
                                            className={`bg-${currentMode.color}-600 hover:bg-${currentMode.color}-700 px-8 py-6 text-lg rounded-full`}
                                        >
                                            <Mic className="w-5 h-5 mr-2" /> Start Recording
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={stopListening}
                                            variant="destructive"
                                            className="px-8 py-6 text-lg rounded-full"
                                        >
                                            <StopCircle className="w-5 h-5 mr-2" /> Stop Recording
                                        </Button>
                                    )}
                                </div>

                                {transcript && !isListening && (
                                    !canUse ? (
                                        <div className="mt-6 flex flex-col items-center gap-2 text-center">
                                            <Lock className="w-5 h-5 text-orange-500" />
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Weekly limit reached ({used}/{limit}). <Link href="/upgrade" className="text-orange-500 underline font-semibold">Upgrade to Pro</Link></p>
                                        </div>
                                    ) : (
                                    <Button onClick={processSpeech} className="mt-6 w-full max-w-xs" disabled={loading}>
                                        {loading ? (<LoaderCircle className="animate-spin mr-2" />) : (<Sparkles className="mr-2" />)}
                                        Analyze Speech ({used}/{limit} used)
                                    </Button>
                                    )
                                )}
                            </div>

                            {/* Output Area */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[500px] flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                                    AI Feedback & Correction
                                </h3>
                                <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-xl p-6 overflow-y-auto border border-gray-100 dark:border-gray-800">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                            <LoaderCircle className="w-8 h-8 animate-spin mb-2" />
                                            <p>Analyzing your speech patterns...</p>
                                        </div>
                                    ) : outputText ? (
                                        <div className="space-y-6">
                                            {/* Corrected Text */}
                                            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-100 shadow-sm">
                                                <h4 className="text-sm font-bold text-green-700 mb-2 uppercase tracking-wide">Better Version</h4>
                                                <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed font-medium">
                                                    "{outputText.corrected}"
                                                </p>
                                            </div>

                                            {/* Feedback Points */}
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Key Improvements</h4>
                                                <ul className="space-y-2">
                                                    {outputText.feedback?.map((point, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Filler Words */}
                                            {outputText.fillerWords?.length > 0 && (
                                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/40">
                                                    <h4 className="text-sm font-bold text-red-700 mb-2 uppercase tracking-wide">Words to Minimize</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {outputText.fillerWords.map((word, i) => (
                                                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-900 text-red-600 text-xs font-bold rounded border border-red-200">
                                                                {word}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Why */}
                                            <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 italic border-t pt-4 mt-4">
                                                💡 {outputText.improvements}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                            <Volume2 className="w-12 h-12 mb-2 opacity-20" />
                                            <p>Record and analyze to see results</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ASSESSMENT MODE */}
                {activeTab === "assessment" && (
                    <Assessment />
                )}
            </div>
        </div>
    );
}

export default CommunicationTrainer;
