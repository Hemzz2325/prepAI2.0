'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { FileText, Scale, AlertCircle, Shield } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        {
            icon: FileText,
            title: "1. Agreement to Terms",
            content: "By accessing our website at Placify AI, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        },
        {
            icon: Scale,
            title: "2. Use License",
            content: "Permission is granted to temporarily download one copy of the materials (information or software) on Placify AI's website for personal, non-commercial transitory viewing only.",
            list: [
                "Modify or copy the materials",
                "Use the materials for any commercial purpose",
                "Attempt to decompile or reverse engineer any software",
                "Remove any copyright or proprietary notations",
                "Transfer the materials to another person"
            ]
        },
        {
            icon: AlertCircle,
            title: "3. Disclaimer",
            content: "The materials on Placify AI's website are provided on an 'as is' basis. Placify AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
        },
        {
            icon: Shield,
            title: "4. Limitations",
            content: "In no event shall Placify AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Placify AI's website, even if Placify AI or a Placify AI authorized representative has been notified orally or in writing of the possibility of such damage."
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
                        Terms of <span className="text-green-600">Service</span>
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
                        className="mb-12"
                    >
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            Please read these Terms of Service carefully before using Placify AI. By using our platform,
                            you agree to be bound by these terms and conditions.
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
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <section.icon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 ml-16 mb-4">
                                    {section.content}
                                </p>
                                {section.list && (
                                    <ul className="space-y-2 ml-16">
                                        {section.list.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                                <span className="text-red-500 mt-1">✗</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            Questions About Our Terms?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <a
                            href="mailto:legal@placifyonline.com"
                            className="text-green-600 font-semibold hover:underline"
                        >
                            legal@placifyonline.com
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
