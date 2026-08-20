import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { posts } from '../postsData';
import { notFound } from 'next/navigation';

// Next.js dynamic metadata generation for SEO
export async function generateMetadata({ params: paramsPromise }) {
    const params = await paramsPromise;
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return {};

    return {
        title: `${post.title} | Placify AI Blog`,
        description: post.excerpt,
        alternates: {
            canonical: `https://www.placifyonline.co.in/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            url: `https://www.placifyonline.co.in/blog/${post.slug}`,
            siteName: 'Placify AI',
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

// Generate paths for static pre-rendering
export async function generateStaticParams() {
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params: paramsPromise }) {
    const params = await paramsPromise;
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Article JSON-LD for Google rich results
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Person",
            name: post.author,
        },
        publisher: {
            "@type": "Organization",
            name: "Placify AI",
            logo: {
                "@type": "ImageObject",
                url: "https://www.placifyonline.co.in/logo.svg",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.placifyonline.co.in/blog/${post.slug}`,
        },
        url: `https://www.placifyonline.co.in/blog/${post.slug}`,
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back button */}
                <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to all articles
                </Link>

                <article className="space-y-6">
                    {/* Header Details */}
                    <div className="space-y-4">
                        <span className="inline-block bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {post.category}
                        </span>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-2">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                5 min read
                            </span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-border">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            className="object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-none pt-6 text-gray-700 dark:text-gray-300 space-y-6 
                                   prose-headings:font-bold prose-headings:text-gray-950 prose-headings:dark:text-white
                                   prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                   prose-p:leading-relaxed prose-p:mb-6
                                   prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                                   prose-strong:text-gray-950 prose-strong:dark:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Newsletter Box */}
                <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-green-50 to-indigo-50 dark:from-green-950/20 dark:to-indigo-950/20 border border-border text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Love this content?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Subscribe to get real-time interview prep resources, resume templates, and job placement guides.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 px-4 py-2 rounded-xl border border-border bg-white dark:bg-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-500"
                        />
                        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
