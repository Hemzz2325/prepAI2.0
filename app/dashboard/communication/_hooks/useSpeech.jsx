"use client";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
            setSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                let finalTranscript = '';
                let interim = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
                setInterimTranscript(interim);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    toast.error("Microphone access denied. Please allow access.");
                    setIsListening(false);
                }
            };

            recognitionInstance.onend = () => {
                // If we're still supposed to be listening, restart (unless stopped manually)
                // But usually onend means it stopped. We'll rely on manual stop for state sync.
                if (isListening) {
                    // recognitionInstance.start(); // Optional: auto-restart
                }
            };

            setRecognition(recognitionInstance);
        } else {
            console.warn("Speech Recognition not supported in this browser.");
            setSupported(false);
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            try {
                recognition.start();
                setIsListening(true);
                setTranscript(''); // Clear previous on new start? Or keep? Let's clear for now.
                setInterimTranscript('');
                toast.success("Listening... Speak now!");
            } catch (error) {
                console.error("Error starting recognition:", error);
            }
        } else if (!supported) {
            toast.error("Speech recognition is not supported in this browser. Try Chrome.");
        }
    }, [recognition, isListening, supported]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);

    const resetTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } else {
            toast.error("Text-to-speech not supported.");
        }
    };

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        speak,
        supported
    };
};
