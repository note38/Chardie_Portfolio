"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Connect() {
  const [profile, setProfile] = useState<{ email?: string; github?: string; linkedin?: string; bio?: string }>({});

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const github = profile.github || "felixmacaspac";
  const linkedin = profile.linkedin || "felixmacaspac";

  const githubUrl = github.startsWith("http") ? github : `https://github.com/${github}`;
  const linkedinUrl = linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;

  const socials = [
    {
      name: "GitHub",
      handle: githubUrl.replace(/^https?:\/\//, ""),
      url: githubUrl,
    },
    {
      name: "LinkedIn",
      handle: linkedinUrl.replace(/^https?:\/\//, ""),
      url: linkedinUrl,
    },
  ];

  return (
    <div className="py-20 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="text-3xl font-light">Let&apos;s Connect</h2>
          <p className="text-lg text-muted-foreground">
            {profile.bio || "Always interested in new opportunities and collaborations."}
          </p>
          <Link
            href={`mailto:${profile.email || "test@example.com"}`}
            className="group flex items-center gap-3 text-foreground font-medium"
          >
            {profile.email || "test@example.com"}{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {socials.map((s) => (
            <Link
              key={s.name}
              target="_blank"
              rel="noopener noreferrer"
              href={s.url}
              className="flex-1 p-5 border border-border rounded-xl hover:border-muted-foreground/50 transition-all group"
            >
              <div className="text-foreground font-medium mb-1">{s.name}</div>
              <div className="text-sm text-muted-foreground break-all group-hover:text-foreground transition-colors">
                {s.handle}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
