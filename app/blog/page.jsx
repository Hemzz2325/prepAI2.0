'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import BackButton from '../_components/BackButton';

export default function BlogPage() {
    const posts = [
        {
            title: "How to Ace Your System Design Interview",
            excerpt: "Master the art of scalable system architecture with these 5 key principles used by top tech companies.",
            author: "Sarah Chen",
            date: "Nov 15, 2024",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "The Future of AI in Recruitment",
            excerpt: "Explore how artificial intelligence is transforming the hiring landscape and what it means for candidates.",
            author: "Alex Rivera",
            date: "Nov 10, 2024",
            category: "Industry Trends",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Top 10 Behavioral Interview Questions",
            excerpt: "Prepare for the most common behavioral questions with our STAR method guide and example answers.",
            author: "Jessica Wu",
            date: "Nov 05, 2024",
            category: "Interview Tips",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Negotiating Your Salary Like a Pro",
            excerpt: "Don't leave money on the table. Learn the strategies to negotiate the compensation package you deserve.",
            author: "Michael Ross",
            date: "Oct 28, 2024",
            category: "Career Advice",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Resume Mistakes to Avoid in 2024",
            excerpt: "Is your resume getting rejected by ATS? Fix these common errors to increase your interview callback rate.",
            author: "David Kim",
            date: "Oct 20, 2024",
            category: "Resume",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Mastering the Coding Interview",
            excerpt: "A comprehensive guide to data structures and algorithms that appear most frequently in technical interviews.",
            author: "Emily Zhang",
            date: "Oct 15, 2024",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <BackButton />
            {/* Header */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        PrepAi <span className="text-blue-600">Blog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Insights, tips, and guides to help you navigate your career journey.
                    </motion.p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow flex flex-col h-full"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <Link href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:gap-2 transition-all">
                                        Read Article <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
