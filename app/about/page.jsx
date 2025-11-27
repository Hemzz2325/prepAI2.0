'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Users, Target, Heart } from 'lucide-react';
import BackButton from '../_components/BackButton';

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <BackButton />
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-gray-950 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.h1
                            variants={fadeIn}
                            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight"
                        >
                            Empowering Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                Career Journey
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                        >
                            We're on a mission to democratize interview preparation using advanced AI, making expert-level coaching accessible to everyone, everywhere.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Users Helped', value: '10k+' },
                            { label: 'Interviews Aced', value: '50k+' },
                            { label: 'Countries', value: '120+' },
                            { label: 'Success Rate', value: '94%' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-blue-500" />,
                                title: "Our Mission",
                                description: "To bridge the gap between talent and opportunity by providing personalized, AI-driven interview coaching that builds confidence and skills."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-green-500" />,
                                title: "Who We Are",
                                description: "A passionate team of engineers, designers, and career coaches dedicated to solving the stress and uncertainty of the job search process."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-pink-500" />,
                                title: "Our Values",
                                description: "We believe in accessibility, continuous improvement, and the power of technology to unlock human potential."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
                            >
                                <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Ready to ace your next interview?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 mb-8"
                    >
                        Join thousands of candidates who are landing their dream jobs with PrepAi.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full">
                                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
