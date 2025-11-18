"use client";
import React, { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const Header = () => {
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
            className={`hover:text-green-500 hover:font-bold transition-all ${isActive('/dashboard') && !path.includes('interveiw') ? 'text-green-500 font-bold' : ''}`}
          >
            Dashboard
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
      </ul>

      <UserButton />
    </div>
  );
};

export default Header;
