"use client";

import { useEffect, useRef, useState } from "react";
import AboutMe from "../components/AboutMe";
import Connect from "../components/Connect";
import Project from "../components/Project";
import Navigation from "../components/Navigation";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("intro");
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // 1. Control the splash screen duration
  useEffect(() => {
    // Adjust 2500ms to match the length of your kinetic animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 2. Initialize the intersection observer ONLY after loading finishes
  useEffect(() => {
    if (isLoading) return; 

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isLoading]); 

  // 3. Render the loader while waiting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <KineticTextLoader />
      </div>
    );
  }

  // 4. Render the main portfolio layout
  return (
    <div className="min-h-screen bg-background text-foreground relative animate-in fade-in duration-700">
      <Navigation activeSection={activeSection} />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 pt-20">
        <section id="intro" ref={(el) => { sectionsRef.current[0] = el; }}>
          <AboutMe />
        </section>

        <section
          id="project"
          ref={(el) => { sectionsRef.current[1] = el; }}
          className="opacity-0"
        >
          <Project />
        </section>

        <section
          id="connect"
          ref={(el) => { sectionsRef.current[2] = el; }} // Fixed sparse array index from [3] to [2]
          className="opacity-0"
        >
          <Connect />
        </section>

        <footer className="py-12 border-t border-border flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2026 Chardie Gotis
          </div>
        </footer>
      </main>
    </div>
  );
}