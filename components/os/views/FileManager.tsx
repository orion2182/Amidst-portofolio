"use client";

import { useState } from "react";
import { Folder, FileText, ChevronRight, ArrowLeft, Search } from "lucide-react";

interface FileItem {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
}

interface FileManagerProps {
  files: FileItem[];
  title: string;
  type: "ctf" | "blog" | "experience";
}

export default function FileManager({ files, title, type }: FileManagerProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [search, setSearch] = useState("");

  const filtered = files.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedFile) {
    return (
      <div className="flex flex-col h-full bg-white/60">
        {/* Breadcrumb bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 border-b border-black/10">
          <button
            onClick={() => setSelectedFile(null)}
            className="text-black/50 hover:text-black/80 hover:bg-black/5 p-1 rounded transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[12px] text-black/50 font-medium">{title}</span>
          <ChevronRight size={12} className="text-black/30" />
          <span className="text-[12px] text-black/80 font-bold truncate max-w-[200px]">{selectedFile.title}</span>
        </div>

        {/* File content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black/90 mb-2 tracking-tight leading-tight">{selectedFile.title}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-black/50 bg-black/5 px-2 py-0.5 rounded uppercase tracking-wider">{selectedFile.date}</span>
              {selectedFile.tags?.map(tag => (
                <span key={tag} className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">{tag}</span>
              ))}
            </div>
          </div>
          <div className="text-[13px] text-black/70 leading-relaxed font-inter whitespace-pre-wrap">
            {selectedFile.content || selectedFile.excerpt || "No content available."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/60">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/50 border-b border-black/10">
        <Folder size={18} className="text-teal-500 fill-teal-500/20" />
        <span className="text-[13px] font-semibold text-black/80">{title}</span>
        <div className="ml-auto flex items-center gap-2 bg-white/70 border border-black/10 rounded-md px-2 py-1 shadow-sm">
          <Search size={13} className="text-black/40" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[12px] text-black/80 placeholder:text-black/40 outline-none w-32"
          />
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Search size={32} className="text-black/20 mb-2" />
            <span className="text-[13px] text-black/40 font-medium">No results found</span>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filtered.map((file) => (
              <div
                key={file.slug}
                onClick={() => setSelectedFile(file)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-teal-500 hover:text-white cursor-pointer transition-colors group"
              >
                <FileText size={16} className="text-teal-500 group-hover:text-white shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[13px] font-medium text-black/80 group-hover:text-white block truncate">
                    {file.title}
                  </span>
                  {file.excerpt && (
                    <p className="text-[11px] text-black/50 group-hover:text-white/80 truncate mt-0.5 leading-tight">{file.excerpt}</p>
                  )}
                </div>
                <span className="text-[11px] text-black/40 group-hover:text-white/80 shrink-0 font-medium">{file.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer status bar */}
      <div className="h-6 bg-white/40 border-t border-black/10 flex items-center justify-center px-4">
        <span className="text-[10px] font-medium text-black/50">{filtered.length} items</span>
      </div>
    </div>
  );
}
