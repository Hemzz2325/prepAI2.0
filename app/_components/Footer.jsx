'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Linkedin, Mail, ArrowRight, Heart } from 'lucide-react'



function Footer() {
    const pathname = usePathname();

    if (pathname !== '/dashboard') return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const socialLinks = [
        { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:text-blue-400" },
        { icon: <Linkedin className="w-5 h-5" />, href: "#", color: "hover:text-blue-700" },
        { icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:text-pink-600" }
    ];

    const footerLinks = {
        product: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Coding Interview", href: "/dashboard/coding" },
            { label: "Resume Analyzer", href: "/dashboard/resume" },
            { label: "Pricing", href: "/upgrade" }
        ],
        company: [
            { label: "About Us", href: "/about" },
            { label: "Contact Sales", href: "/contact" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" }
        ],
        legal: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" }
        ]
    };

    return (
        <footer className="bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12"
                >
                    {/* Brand */}
                    <motion.div variants={itemVariants} className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.7 }}
                            >
                                <Image src="/logo.svg" alt="PrepAi Logo" width={32} height={32} />
                            </motion.div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">PrepAi</span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
                            AI-driven interview preparation to help you land your dream job. Master your skills with personalized feedback and real-time coaching.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <motion.div variants={itemVariants} key={title}>
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">
                                {title}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center group"
                                        >
                                            <span className="relative">
                                                {link.label}
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>


            </div>
        </footer>
    )
}

export default Footer
