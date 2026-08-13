'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { posts } from './postsData';

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background">
            <BackButton />
            {/* Header */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Placify AI <span className="text-green-600">Blog</span>
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
                                key={post.slug}
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
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`}>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-green-600 font-semibold text-sm hover:gap-2 transition-all">
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
