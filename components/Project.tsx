"use client";

import { useEffect, useState, forwardRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
}

// Gradient palettes for cards without a custom image
const CARD_GRADIENTS = [
  "from-violet-500/20 via-purple-500/10 to-blue-500/20",
  "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
  "from-rose-500/20 via-pink-500/10 to-fuchsia-500/20",
  "from-amber-500/20 via-orange-500/10 to-red-500/20",
  "from-emerald-500/20 via-green-500/10 to-teal-500/20",
  "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
  "from-fuchsia-500/20 via-violet-500/10 to-purple-500/20",
];

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
    url: "https://note38.github.io/Jewel-kate/",
  },
  {
    id: "7",
    title: "Jewel Kate Capture the magic",
    description: "18th birthday Capture the magic website, upload photos, and relive the moments.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/note38/Jewel-kate",
    url: "https://note38.github.io/Jewel-kate/",
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

        <div className="grid gap-6 md:grid-cols-2">
          {displayProjects.map((project, index) => {
            const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
            const initials = project.title
              .split(/[\s\-_]+/)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 3);

            return (
              <div
                key={project.id}
                className="group relative border border-border rounded-2xl hover:border-foreground/30 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <div className={`relative w-full h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl font-bold tracking-tight text-foreground/20 select-none">
                        {initials}
                      </span>
                      <div className="flex gap-1.5">
                        {project.techStack.split(",").slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-background/40 text-foreground/60 font-mono backdrop-blur-sm border border-border/50"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Links overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col hover:bg-muted/20 transition-colors duration-500">
                  <h3 className="text-lg font-semibold tracking-tight group-hover:text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {project.description}
                  </p>
                  <div className="pt-3 border-t border-border mt-auto">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      {project.techStack}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
