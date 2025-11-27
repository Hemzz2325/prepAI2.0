"use client";
import React, { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const path = usePathname();

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  const isActive = (href) => {
    return path === href || path.startsWith(href + '/');
  };

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Link href="/dashboard">
        <Image src="/logo.svg" alt="Logo" width={60} height={80} />
      </Link>

      <ul className=" hidden md:flex gap-6">
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-green-500 hover:font-bold transition-all ${isActive('/dashboard') && !path.includes('interveiw') && !path.includes('performance') ? 'text-green-500 font-bold' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/performance"
            className={`hover:text-green-500 hover:font-bold transition-all ${isActive('/dashboard/performance') ? 'text-green-500 font-bold' : ''}`}
          >
            Performance
          </Link>
        </li>
        <li>
          <Link
            href="/how-it-works"
            className={`hover:text-green-500 hover:font-bold transition-all ${isActive('/how-it-works') ? 'text-green-500 font-bold' : ''}`}
          >
            How It Works
          </Link>
        </li>
        <li>
          <Link
            href="/upgrade"
            className={`hover:text-green-500 hover:font-bold transition-all ${isActive('/upgrade') ? 'text-green-500 font-bold' : ''}`}
          >
            Upgrade
          </Link>
        </li>
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
      </div>
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
