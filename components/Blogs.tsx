"use client";

import { useEffect, useState, forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  url?: string;
}

const DEFAULT_BLOGS: Blog[] = [
  {
    id: "1",
    title: "The Future of Web Development",
    excerpt: "Exploring AI in web build processes and how it changes the developer's role.",
    date: "Dec 2024",
    readTime: "5 min",
    url: "#"
  },
  {
    id: "2",
    title: "Design Systems at Scale",
    excerpt: "Lessons from multi-product systems and the importance of design tokens.",
    date: "Nov 2024",
    readTime: "8 min",
    url: "#"
  },
];

export default forwardRef<HTMLElement, {}>(function Blogs({}, ref) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(() => {});
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : DEFAULT_BLOGS;

  return (
    <section id="blog" className="min-h-screen py-20 sm:py-32" ref={ref as React.Ref<HTMLElement>}>
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight">Recent Blogs</h2>
            <p className="text-muted-foreground">Musings on design, code, and technology.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {displayBlogs.map((post) => {
            const CardWrap = post.url ? "a" : "div";
            return (
              <CardWrap
                key={post.id}
                href={post.url || undefined}
                target={post.url && post.url !== "#" ? "_blank" : undefined}
                rel={post.url && post.url !== "#" ? "noopener noreferrer" : undefined}
                className="group p-8 border border-border rounded-2xl hover:border-foreground/30 hover:bg-muted/30 transition-all duration-500 cursor-pointer overflow-hidden relative block"
              >
                <div className="space-y-4 relative z-10">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest flex justify-between">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight group-hover:text-foreground transition-colors pr-8">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest group-hover:text-foreground transition-colors pt-4 border-t border-border">
                    {post.url ? "Read article" : "Read more"}
                  </div>
                </div>
                <div className="absolute top-8 right-8 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                  <ArrowUpRight size={20} />
                </div>
              </CardWrap>
            );
          })}
        </div>
      </div>
    </section>
  );
});
