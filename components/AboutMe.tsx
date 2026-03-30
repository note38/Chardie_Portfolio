"use client";

import { useEffect, useState, forwardRef } from "react";

interface Skill {
  id: string;
  name: string;
}

interface Profile {
  name?: string;
  surname?: string;
  tagline?: string;
  currentRole?: string;
  roleFocus?: string;
}

const DEFAULT_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Next.js",
  "Prisma",
];

const DEFAULT_PROFILE: Profile = {
  name: "Gotis",
  surname: "Chardie",
  tagline:
    "Computer Science Senior & Frontend Developer | Building user-centric web applications, and digital solutions that bridge the gap between Design, and Technical logic.",
  currentRole: "Frontend Developer",
  roleFocus: "Focused on Next.js & React",
};

export default forwardRef<HTMLDivElement, {}>(function AboutMe({}, ref) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      })
      .catch(() => {});

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          name: data.name || DEFAULT_PROFILE.name,
          surname: data.surname || DEFAULT_PROFILE.surname,
          tagline: data.tagline || DEFAULT_PROFILE.tagline,
          currentRole: data.currentRole || DEFAULT_PROFILE.currentRole,
          roleFocus: data.roleFocus || DEFAULT_PROFILE.roleFocus,
        });
      })
      .catch(() => {});
  }, []);

  const displaySkills = skills.length > 0 ? skills.map((s) => s.name) : DEFAULT_SKILLS;

  // Split tagline on highlighted keywords
  const renderTagline = (tagline: string) => {
    const highlights = ["web applications", "Design", "Technical logic"];
    const parts: { text: string; highlighted: boolean }[] = [];
    let remaining = tagline;

    while (remaining.length > 0) {
      let earliestIndex = remaining.length;
      let earliestHighlight = "";

      for (const h of highlights) {
        const idx = remaining.indexOf(h);
        if (idx !== -1 && idx < earliestIndex) {
          earliestIndex = idx;
          earliestHighlight = h;
        }
      }

      if (earliestHighlight) {
        if (earliestIndex > 0) {
          parts.push({ text: remaining.slice(0, earliestIndex), highlighted: false });
        }
        parts.push({ text: earliestHighlight, highlighted: true });
        remaining = remaining.slice(earliestIndex + earliestHighlight.length);
      } else {
        parts.push({ text: remaining, highlighted: false });
        remaining = "";
      }
    }

    return parts.map((part, i) =>
      part.highlighted ? (
        <span key={i} className="text-foreground">
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      )
    );
  };

  return (
    <header
      id="intro"
      className="min-h-screen flex items-center "
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-2">
            <div className="text-sm text-muted-foreground font-mono tracking-wider">
              PORTFOLIO / 2026
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight transition-all duration-700 hover:tracking-normal cursor-default">
              {profile.name}
              <br />
              <span className="text-muted-foreground">{profile.surname}</span>
            </h1>
          </div>

          <div className="space-y-6 max-w-md">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {renderTagline(profile.tagline || "")}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Available for work
              </div>
              <div>Philippines</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
              Currently
            </div>
            <div className="space-y-2">
              <div className="text-foreground font-medium">{profile.currentRole}</div>
              <div className="text-xs text-muted-foreground">{profile.roleFocus}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
              Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-xs border border-border rounded-full hover:border-foreground/40 hover:bg-muted/50 transition-all duration-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
