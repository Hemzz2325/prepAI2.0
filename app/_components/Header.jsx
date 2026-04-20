"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Crown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { user } = useUser();
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null); // null = loading, 'free' | 'pro'

  useEffect(() => {
    console.log("Current path:", path);
    setIsMenuOpen(false);
  }, [path]);

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    fetch(`/api/usage?email=${encodeURIComponent(email)}&feature=interviews`)
      .then((r) => r.json())
      .then((data) => setUserPlan(data.plan || "free"))
      .catch(() => setUserPlan("free"));
  }, [user]);

  const isActive = (href) => {
    return path === href || path.startsWith(href + '/');
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/performance", label: "Performance" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/upgrade", label: "Upgrade" },
  ];

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm relative z-50">
      <Link href="/dashboard">
        <div className="flex flex-col items-center gap-0.5">
          <Image src="/logo.svg" alt="Logo" width={60} height={80} />
          {userPlan === "pro" ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-300 rounded-full px-2 py-0.5">
              <Crown className="w-2.5 h-2.5" /> PRO
            </span>
          ) : userPlan === "free" ? (
            <span className="text-[10px] text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">Basic</span>
          ) : null}
        </div>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`hover:text-green-500 hover:font-bold transition-all ${isActive(link.href) && !path.includes('interveiw') && !path.includes('performance') ? 'text-green-500 font-bold' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
        {user?.primaryEmailAddress?.emailAddress === 'nitinambiger11@gmail.com' && (
          <li>
            <Link
              href="/admin"
              className={`hover:text-red-500 hover:font-bold transition-all ${isActive('/admin') ? 'text-red-500 font-bold' : ''}`}
            >
              Admin Panel
            </Link>
          </li>
        )}
      </ul>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800 md:hidden p-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-lg transition-all ${isActive(link.href)
                    ? 'bg-green-50 text-green-600 font-bold dark:bg-green-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user?.primaryEmailAddress?.emailAddress === 'nitinambiger11@gmail.com' && (
              <Link
                href="/admin"
                className={`p-3 rounded-lg transition-all ${isActive('/admin')
                    ? 'bg-red-50 text-red-600 font-bold dark:bg-red-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default Header;
