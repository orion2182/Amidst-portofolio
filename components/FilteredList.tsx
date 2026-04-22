"use client";

import { useState, useMemo } from "react";
import PostCard from "./PostCard";
import CTFCard from "./CTFCard";
import Button from "./Button";
import { useLang } from "@/lib/i18n";

interface FilteredListProps {
  items: any[];
  type: "blog" | "ctf" | "projects";
}

export default function FilteredList({ items, type }: FilteredListProps) {
  const [activeTag, setActiveTag] = useState<string>("ALL");
  const { t } = useLang();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      if ((type === "blog" || type === "projects") && item.frontmatter.tags) {
        item.frontmatter.tags.forEach((t: string) => tags.add(t));
      } else if (type === "ctf" && item.frontmatter.category) {
        tags.add(item.frontmatter.category);
      }
    });
    return ["ALL", ...Array.from(tags).sort()];
  }, [items, type]);

  const filteredItems = useMemo(() => {
    if (activeTag === "ALL") return items;
    return items.filter(item => {
      if (type === "blog" || type === "projects") return item.frontmatter.tags?.includes(activeTag);
      if (type === "ctf") return item.frontmatter.category === activeTag;
      return true;
    });
  }, [items, activeTag, type]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors cursor-none ${
              activeTag === tag
                ? "bg-accent text-bg border-accent"
                : "bg-transparent text-muted border-border hover:border-accent hover:text-accent"
            } border rounded-sm`}
          >
            {tag === "ALL" ? t("show_all") : tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => {
          const staggerStyle = {
            opacity: 0,
            animation: `fadeSlideUp 0.5s ease-out forwards`,
            animationDelay: `${index * 80}ms`,
          };

          if (type === "blog") {
            return (
              <div key={item.slug} style={staggerStyle}>
                <PostCard 
                  title={item.frontmatter.title}
                  excerpt={item.frontmatter.excerpt}
                  date={item.frontmatter.date}
                  slug={item.slug}
                  tags={item.frontmatter.tags || []}
                />
              </div>
            );
          } else if (type === "ctf") {
            return (
              <div key={item.slug} style={staggerStyle}>
                <CTFCard 
                  title={item.frontmatter.title}
                  event={item.frontmatter.event}
                  category={item.frontmatter.category}
                  difficulty={item.frontmatter.difficulty}
                  excerpt={item.frontmatter.excerpt}
                  slug={item.slug}
                />
              </div>
            );
          } else if (type === "projects") {
            return (
              <div key={item.slug} style={staggerStyle} className="brutal-card p-8 flex flex-col fade-in group">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 
                      className="text-2xl font-black font-space text-text uppercase tracking-tight group-hover:text-neon transition-colors hover-glitch"
                      data-text={item.frontmatter.title}
                    >
                      {item.frontmatter.title}
                    </h3>
                  </div>
                  <p className="text-text/70 text-sm mb-8 flex-grow font-inter">{item.frontmatter.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.frontmatter.tags && item.frontmatter.tags.map((tag: string) => (
                      <span key={tag} className="text-xs font-mono bg-bg px-2 py-1 border border-neon/30 text-neon">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-auto">
                    {item.frontmatter.live && <Button href={item.frontmatter.live} variant="primary" className="flex-1 py-2 text-[10px] sm:text-xs font-mono !bg-neon !text-bg border-neon hover:!text-neon hover:!bg-neon/10">{t("exec_live")}</Button>}
                    {item.frontmatter.github && <Button href={item.frontmatter.github} variant="outline" className="flex-1 py-2 text-[10px] sm:text-xs font-mono !text-text !border-border hover:!border-neon hover:!text-neon hover:!bg-neon/5">{t("src_code")}</Button>}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12 border border-border w-full">
          <p className="font-mono text-muted uppercase tracking-widest animate-pulse">{t("no_records")}</p>
        </div>
      )}
    </div>
  );
}
