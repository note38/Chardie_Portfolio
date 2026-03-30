"use client";

import { useEffect, useRef, useState } from "react";
import AboutMe from "../components/AboutMe";
import Blogs from "../components/Blogs";
import Connect from "../components/Connect";
import Project from "../components/Project";
import Navigation from "../components/Navigation";

export default function Home() {
  const [activeSection, setActiveSection] = useState("intro");
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
          id="blog"
          ref={(el) => { sectionsRef.current[2] = el; }}
          className="opacity-0"
        >
          <Blogs />
        </section>

        <section
          id="connect"
          ref={(el) => { sectionsRef.current[3] = el; }}
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
