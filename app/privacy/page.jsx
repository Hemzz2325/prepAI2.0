'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: Shield,
            title: "Information We Collect",
            content: [
                "Personal information (name, email) when you create an account",
                "Interview practice data and coding submissions",
                "Usage data and analytics to improve our services",
                "Device information and browser type"
            ]
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: [
                "To provide and improve our AI-powered interview preparation services",
                "To personalize your learning experience and track progress",
                "To send important updates about your account and new features",
                "To analyze usage patterns and enhance platform performance"
            ]
        },
        {
            icon: Eye,
            title: "Data Security",
            content: [
                "We use industry-standard encryption to protect your data",
                "Your interview responses are stored securely and privately",
                "We never sell your personal information to third parties",
                "Regular security audits and updates to protect your privacy"
            ]
        },
        {
            icon: FileText,
            title: "Your Rights",
            content: [
                "Access and download your personal data at any time",
                "Request deletion of your account and associated data",
                "Opt-out of non-essential communications",
                "Update or correct your personal information"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <BackButton />

            {/* Header */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Privacy <span className="text-blue-600">Policy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-300"
                    >
                        Last updated: December 2, 2024
                    </motion.p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-lg dark:prose-invert max-w-none mb-12"
                    >
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            At Placify AI, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                            and protect your personal information when you use our AI-powered interview preparation platform.
                        </p>
                    </motion.div>

                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <section.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-3 ml-16">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            Questions About Privacy?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you have any questions or concerns about our privacy practices, please contact us at:
                        </p>
                        <a
                            href="mailto:privacy@placifyai.com"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            privacy@placifyai.com
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
