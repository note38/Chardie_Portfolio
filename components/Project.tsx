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
    title: "DWU-P-AEVS",
    description: "Development of Wesleyan University-Philippines Aurora Enchanced Voting System, a secure and user-friendly online voting platform.",
    techStack: "Next.js, Clerk, Tailwind, Prisma",
    githubUrl: "https://github.com/note38/DWU-P-AEVS",
    url: "https://www.awup-evs.site/",
  },
  {
    id: "2",
    title: "js-background-generator",
    description: "A tool that generates dynamic backgrounds using JavaScript, allowing users to create visually appealing designs for websites and applications.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/js-background-generator",
  },
  {
    id: "3",
    title: "Flexbox",
    description: "A CSS layout module that provides an efficient way to arrange and align items within a container, allowing for responsive and flexible designs.",
    techStack: "HTML, CSS",
    githubUrl: "https://github.com/note38/flexbox",
  },
  {
    id: "4",
    title: "ToDos",
    description: "A simple and intuitive task management application that helps users organize their daily tasks and stay productive.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/ToDos",
  },
    {
    id: "5",
    title: "Jewel-kate",
    description: "18th birthday invitation website",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/Jewel-kate",
  },
  {
    id: "6",
    title: "Jewel Kate",
    description: "18th birthday invitation website",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/Jewel-kate",
    url: "https://note38.github.io/Jewel-kate/"
  },
    {
    id: "7",
    title: "Jewel Kate Capture the magic",
    description: "18th birthday Capture the magic website, upload photos, and relive the moments.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/Jewel-kate",
    url: "https://note38.github.io/Jewel-kate/"
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
