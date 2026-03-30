"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navigation({ activeSection }: { activeSection?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { name: "About", href: "#intro" },
    { name: "Projects", href: "#project" },
    { name: "Blog", href: "#blog" },
    { name: "Connect", href: "#connect" },
  ];

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/sign-in")) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-tighter">
          GOTIS<span className="text-muted-foreground">CHARDIE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-tight transition-all duration-300 ${
                  activeSection === link.href.replace("#", "")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          <div className="flex items-center gap-4 border-l border-border pl-8">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:underline"
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-muted"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-light transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn && (
              <div className="pt-4 border-t border-border flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
