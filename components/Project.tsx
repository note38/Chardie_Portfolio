"use client";

import { useEffect, useState, forwardRef } from "react";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  url?: string;
  githubUrl?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Eco-Track App",
    description: "Sustainability tracking app with real-time carbon footprint calculation.",
    techStack: "Next.js, Tailwind, Prisma",
    githubUrl: "#",
    url: "#",
  },
  {
    id: "2",
    title: "Flux Design System",
    description: "Multi-product design system with accessible React components.",
    techStack: "React, TypeScript, Radix",
    githubUrl: "#",
  },
];

export default forwardRef<HTMLElement, {}>(function Project({}, ref) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="project" className="min-h-screen py-20 sm:py-32" ref={ref as React.Ref<HTMLElement>}>
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">Selected Projects</h2>
          <p className="text-muted-foreground max-w-lg">
            A collection of work that blends functionality with aesthetic minimalism.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="group relative p-8 border border-border rounded-2xl hover:border-foreground/30 hover:bg-muted/30 transition-all duration-500"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium tracking-tight group-hover:text-foreground">
                    {project.title}
                  </h3>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="text-muted-foreground hover:text-foreground">
                        <Github size={20} />
                      </a>
                    )}
                    {project.url && (
                      <a href={project.url} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed h-12 line-clamp-2">
                  {project.description}
                </p>
                <div className="pt-4 border-t border-border mt-auto">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    {project.techStack}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
