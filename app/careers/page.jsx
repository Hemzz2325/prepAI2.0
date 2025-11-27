'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, Zap } from 'lucide-react';
import BackButton from '../_components/BackButton';

export default function CareersPage() {
    const positions = [
        {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            description: "We're looking for an experienced engineer to help build the next generation of our AI interview platform."
        },
        {
            title: "AI Research Scientist",
            department: "AI / ML",
            location: "San Francisco, CA",
            type: "Full-time",
            description: "Join our core AI team to improve our interview simulation models and feedback algorithms."
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time",
            description: "Shape the user experience of PrepAi and create intuitive, beautiful interfaces for our users."
        },
        {
            title: "Growth Marketing Manager",
            department: "Marketing",
            location: "New York, NY",
            type: "Full-time",
            description: "Lead our user acquisition strategies and help us reach more job seekers worldwide."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <BackButton />
            {/* Hero */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
                    >
                        Join the <span className="text-green-600">Revolution</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Help us shape the future of career development. We're building the tools that help people land their dream jobs.
                    </motion.p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            { title: "Remote-First", desc: "Work from anywhere in the world. We believe in output, not hours." },
                            { title: "Competitive Pay", desc: "Top-tier salary and equity packages. We value your contribution." },
                            { title: "Unlimited PTO", desc: "Take the time you need to recharge. Mental health matters." }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Open Positions</h2>
                    <div className="grid gap-6">
                        {positions.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.department}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                        </div>
                                        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
                                            {job.description}
                                        </p>
                                    </div>
                                    <Button variant="outline" className="shrink-0 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                                        Apply Now
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
