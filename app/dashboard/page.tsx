"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  url?: string;
}

interface Skill {
  id: string;
  name: string;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  url?: string;
  githubUrl?: string;
}

interface Profile {
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  name: string;
  surname: string;
  tagline: string;
  currentRole: string;
  roleFocus: string;
}

const EMPTY_PROFILE = { email: "", github: "", linkedin: "", bio: "", name: "", surname: "", tagline: "", currentRole: "", roleFocus: "" };
const EMPTY_BLOG = { title: "", excerpt: "", date: "", readTime: "", url: "" };
const EMPTY_PROJECT = { title: "", description: "", techStack: "", url: "", githubUrl: "" };

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogForm, setBlogForm] = useState(EMPTY_BLOG);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "profile" | "about">("blogs");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    setBlogs(await res.json());
  };
  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    setSkills(await res.json());
  };
  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  };
  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data);
    setProfileForm({
      email: data.email, github: data.github, linkedin: data.linkedin, bio: data.bio,
      name: data.name || "", surname: data.surname || "", tagline: data.tagline || "",
      currentRole: data.currentRole || "", roleFocus: data.roleFocus || "",
    });
  };

  useEffect(() => {
    fetchBlogs();
    fetchSkills();
    fetchProjects();
    fetchProfile();
  }, []);

  // ── Blogs ────────────────────────────────────────────────────────────────
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
      const res = await fetch(url, {
        method: editingBlogId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogForm),
      });
      if (!res.ok) throw new Error();
      setBlogForm(EMPTY_BLOG);
      setEditingBlogId(null);
      await fetchBlogs();
      showMessage(editingBlogId ? "Blog updated!" : "Blog added!", "success");
    } catch {
      showMessage("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) { await fetchBlogs(); showMessage("Blog deleted.", "success"); }
  };

  const handleEditBlog = (b: Blog) => {
    setEditingBlogId(b.id);
    setBlogForm({ title: b.title, excerpt: b.excerpt, date: b.date, readTime: b.readTime, url: b.url ?? "" });
    setActiveTab("blogs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Projects ─────────────────────────────────────────────────────────────────
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
      const res = await fetch(url, {
        method: editingProjectId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      if (!res.ok) throw new Error();
      setProjectForm(EMPTY_PROJECT);
      setEditingProjectId(null);
      await fetchProjects();
      showMessage(editingProjectId ? "Project updated!" : "Project added!", "success");
    } catch {
      showMessage("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { await fetchProjects(); showMessage("Project deleted.", "success"); }
  };

  const handleEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({ title: p.title, description: p.description, techStack: p.techStack, url: p.url ?? "", githubUrl: p.githubUrl ?? "" });
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Skills ───────────────────────────────────────────────────────────────────
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.trim(), order: skills.length }),
      });
      if (!res.ok) throw new Error();
      setNewSkill("");
      await fetchSkills();
      showMessage("Skill added!", "success");
    } catch {
      showMessage("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) { await fetchSkills(); showMessage("Skill removed.", "success"); }
  };

  // ── Profile ──────────────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error();
      await fetchProfile();
      showMessage("Profile updated!", "success");
    } catch {
      showMessage("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "about", label: "About", count: profile ? 1 : 0 },
    { key: "blogs", label: "Blogs", count: blogs.length },
    { key: "projects", label: "Projects", count: projects.length },
    { key: "profile", label: "Connect", count: profile ? 1 : 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Portfolio
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-sm font-medium font-mono">Dashboard</span>
        </div>
        <UserButton />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Toast */}
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-light mb-1">Content Manager</h1>
          <p className="text-sm text-muted-foreground">Manage your portfolio content.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
              <span className="ml-2 text-xs text-muted-foreground font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* ── ABOUT TAB ── */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <div className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Edit About Section</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Last Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Gotis" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">First Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Chardie" value={profileForm.surname} onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Tagline</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Computer Science Senior & Frontend Developer…" rows={3} value={profileForm.tagline} onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Current Role</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Frontend Developer" value={profileForm.currentRole} onChange={(e) => setProfileForm({ ...profileForm, currentRole: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Role Focus</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Focused on Next.js & React" value={profileForm.roleFocus} onChange={(e) => setProfileForm({ ...profileForm, roleFocus: e.target.value })} required />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50">
                    {loading ? "Saving…" : "Save About"}
                  </button>
                </div>
              </form>
            </div>

            {/* ── SKILLS SECTION (Moved from old tab) ── */}
            <div className="border border-border rounded-xl p-6 space-y-4 mt-8">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Manage Skills</h2>
              <form onSubmit={handleAddSkill} className="flex gap-3">
                <input className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Next.js, Prisma, Figma…" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                <button type="submit" disabled={loading || !newSkill.trim()} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50">
                  {loading ? "Adding…" : "Add"}
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.length === 0 ? (
                  <div className="w-full text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">No skills yet. Add your first one above!</div>
                ) : skills.map((s) => (
                  <div key={s.id} className="group flex items-center gap-2 px-3 py-1.5 border border-border rounded-full text-sm hover:border-muted-foreground/40 transition-colors">
                    <span>{s.name}</span>
                    <button onClick={() => handleDeleteSkill(s.id)} className="text-muted-foreground/50 hover:text-red-500 transition-colors" aria-label={`Remove ${s.name}`}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BLOGS TAB ── */}
        {activeTab === "blogs" && (
          <div className="space-y-8">
            <div className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                {editingBlogId ? "Edit Blog" : "Add Blog"}
              </h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Title</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. The Future of AI" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Date</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Mar 2026" value={blogForm.date} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Excerpt</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="A short summary…" rows={3} value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Read Time</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 5 min" value={blogForm.readTime} onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">External URL <span className="text-muted-foreground">(optional)</span></label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://medium.com/..." value={blogForm.url} onChange={(e) => setBlogForm({ ...blogForm, url: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50">
                    {loading ? "Saving…" : editingBlogId ? "Update" : "Add Blog"}
                  </button>
                  {editingBlogId && (
                    <button type="button" onClick={() => { setEditingBlogId(null); setBlogForm(EMPTY_BLOG); }} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-muted-foreground/50 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {blogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">No blogs yet. Add your first one above!</div>
              ) : blogs.map((b) => (
                <div key={b.id} className="group p-5 border border-border rounded-xl hover:border-muted-foreground/40 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-medium truncate">{b.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-3 text-xs text-muted-foreground font-mono"><span>{b.date}</span><span>·</span><span>{b.readTime}</span></div>
                        {b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline">Read ↗</a>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditBlog(b)} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-muted-foreground/50 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteBlog(b.id)} className="px-3 py-1.5 text-xs border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                {editingProjectId ? "Edit Project" : "Add Project"}
              </h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Portfolio Website" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="What does this project do?" rows={3} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Tech Stack</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Next.js, Prisma, Tailwind" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Live URL <span className="text-muted-foreground">(optional)</span></label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://…" value={projectForm.url} onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">GitHub URL <span className="text-muted-foreground">(optional)</span></label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://github.com/…" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50">
                    {loading ? "Saving…" : editingProjectId ? "Update" : "Add Project"}
                  </button>
                  {editingProjectId && (
                    <button type="button" onClick={() => { setEditingProjectId(null); setProjectForm(EMPTY_PROJECT); }} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-muted-foreground/50 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">No projects yet. Add your first one above!</div>
              ) : projects.map((p) => (
                <div key={p.id} className="group p-5 border border-border rounded-xl hover:border-muted-foreground/40 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-medium truncate">{p.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.techStack}</p>
                      <div className="flex gap-3">
                        {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-muted-foreground hover:text-foreground">Live ↗</a>}
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline text-muted-foreground hover:text-foreground">GitHub ↗</a>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditProject(p)} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:border-muted-foreground/50 transition-colors">Edit</button>
                      <button onClick={() => handleDeleteProject(p.id)} className="px-3 py-1.5 text-xs border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Edit Connect Setup</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="test@example.com" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">GitHub Handle</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="username" value={profileForm.github} onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">LinkedIn Handle</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="username" value={profileForm.linkedin} onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Bio / Availability</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Always interested in new opportunities..." rows={3} value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50">
                    {loading ? "Saving…" : "Save Connect Info"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
