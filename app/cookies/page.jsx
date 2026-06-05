'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { Cookie, Settings, Users, BarChart3 } from 'lucide-react';

export default function CookiesPage() {
    const sections = [
        {
            icon: Cookie,
            title: "What Are Cookies",
            content: "As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies."
        },
        {
            icon: Settings,
            title: "How We Use Cookies",
            content: "We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.",
            list: [
                {
                    title: "Account related cookies",
                    desc: "If you create an account with us then we will use cookies for the management of the signup process and general administration."
                },
                {
                    title: "Login related cookies",
                    desc: "We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page."
                },
                {
                    title: "Site preferences cookies",
                    desc: "In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it."
                }
            ]
        },
        {
            icon: Users,
            title: "Third Party Cookies",
            content: "In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.",
            list: [
                {
                    title: "Google Analytics",
                    desc: "This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site."
                },
                {
                    title: "Feature Testing",
                    desc: "From time to time we test new features and make subtle changes to the way that the site is delivered."
                }
            ]
        },
        {
            icon: BarChart3,
            title: "Managing Cookies",
            content: "You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site."
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
                        Cookie <span className="text-orange-600">Policy</span>
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
                            This Cookie Policy explains how Placify AI uses cookies and similar technologies to recognize you
                            when you visit our platform. It explains what these technologies are and why we use them.
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
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                        <section.icon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 ml-16 mb-4">
                                    {section.content}
                                </p>
                                {section.list && (
                                    <div className="space-y-4 ml-16">
                                        {section.list.map((item, idx) => (
                                            <div key={idx} className="border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-100 dark:border-orange-800"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            Questions About Cookies?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you have any questions about our use of cookies, please contact us at:
                        </p>
                        <a
                            href="mailto:privacy@placifyai.com"
                            className="text-orange-600 font-semibold hover:underline"
                        >
                            privacy@placifyai.com
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
