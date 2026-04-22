"use client";

import { ExternalLink, Github } from "lucide-react";

interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  live?: string;
  github?: string;
}

interface ProjectsViewProps {
  projects: ProjectItem[];
}

export default function ProjectsView({ projects }: ProjectsViewProps) {
  return (
    <div className="h-full overflow-auto bg-white/80 p-6">
      <div className="mb-6 px-1">
        <h2 className="text-xl font-bold text-black/80 tracking-tight">Deployments</h2>
        <p className="text-xs text-black/50 font-medium mt-1">Featured projects and red team infrastructure</p>
      </div>

      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <span className="text-[13px] font-medium text-black/40">No projects deployed.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj, i) => (
            <div
              key={proj.slug}
              className="bg-white/60 border border-black/10 rounded-xl p-5 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-white">0{i + 1}</span>
                </div>
                <div className="flex gap-2">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener" className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/10 transition-colors">
                      <Github size={13} />
                    </a>
                  )}
                  {proj.live && (
                    <a href={proj.live} target="_blank" rel="noopener" className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-black/60 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-black/80 mb-2 truncate group-hover:text-teal-600 transition-colors">
                {proj.title}
              </h3>
              <p className="text-[12px] text-black/60 leading-relaxed mb-4 flex-1">{proj.description}</p>
              {proj.tags && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-medium text-black/50 bg-black/5 px-2 py-0.5 rounded-md border border-black/5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
