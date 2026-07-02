"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StaggeredGrid, BentoItem } from "@/components/ui/staggered-grid";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Connect() {
  const [profile, setProfile] = useState<{
    email?: string;
    github?: string;
    linkedin?: string;
    bio?: string;
  }>({});

  useEffect(() => {
    // API endpoint removed to prevent 404s
  }, []);

  const github = profile.github || "note38";
  const linkedin = profile.linkedin || "chardie-gotis";
  const email = profile.email || "chardiegotis2003@gmail.com";

  const githubUrl = github.startsWith("http") ? github : `https://github.com/${github}`;
  const linkedinUrl = linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;


  const socials = [
    {
      id: 1,
      title: "GitHub",
      subtitle: github,
      description: "Check out my projects and open source work.",
      icon: <FaGithub className="w-5 h-5" />,
      image: "https://opengraph.githubassets.com/1/note38",
      url: githubUrl,
    },
    {
      id: 2,
      title: "LinkedIn",
      subtitle: linkedin,
      description: "Let's connect professionally.",
      icon: <FaLinkedin className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80",
      url: linkedinUrl,
    },
  ];

  const bentoItems: BentoItem[] = [
    {
      id: 1,
      title: "GitHub",
      subtitle: github,
      description: "Check out my projects and open source work.",
      icon: <FaGithub className="w-5 h-5" />,
      image: "https://opengraph.githubassets.com/1/note38",
      url: githubUrl,
    },
    {
      id: 2,
      title: "LinkedIn",
      subtitle: linkedin,
      description: "Let's connect professionally.",
      icon: <FaLinkedin className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80",
      url: linkedinUrl,
    },
    {
      id: 3,
      title: "Email",
      subtitle: email,
      description: "Drop me a message anytime.",
      icon: <MdEmail className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&q=80",
      url: `mailto:${email}`,
    },
  ];

  const images = Array.from(
    { length: 20 },
    (_, i) => `https://picsum.photos/seed/${i + 1}/400/400`
  );

  return (
    <div className="py-20 sm:py-32">
       <StaggeredGrid
        images={images}
        bentoItems={bentoItems}
        centerText="Connect"
        showFooter={false}
        className="rounded-2xl hidden md:block"
      />
      
      <div className="grid lg:grid-cols-2 gap-16 block md:hidden">
        <div className="space-y-8">
          <h2 className="text-3xl font-light">Let&apos;s Connect</h2>
          <p className="text-lg text-muted-foreground">
            {profile.bio || "Always interested in new opportunities and collaborations."}
          </p>
          <Link
            href={`mailto:${profile.email || "chardiegotis2003@gmail.com"}`}
            className="group flex items-center gap-3 text-foreground font-medium"
          >
            {profile.email || "chardiegotis2003@gmail.com"}{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {socials.map((s) => (
            <Link
              key={s.title}
              target="_blank"
              rel="noopener noreferrer"
              href={s.url ?? "#"}
              className="flex-1 p-5 border border-border rounded-xl hover:border-muted-foreground/50 transition-all group"
            >
              <div className="text-foreground font-medium mb-1">{s.title}</div>
              <div className="text-sm text-muted-foreground break-all group-hover:text-foreground transition-colors">
                {s.subtitle}
              </div>
            </Link>
          ))}
        </div>
      </div>

     
    </div>
  );
}