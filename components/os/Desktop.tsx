"use client";

import { useWindowManager } from "./WindowManager";
import Window from "./Window";
import FileManager from "./views/FileManager";
import TerminalView from "./views/TerminalView";
import ProjectsView from "./views/ProjectsView";

interface ContentData {
  ctf: { slug: string; title: string; date: string; excerpt?: string; tags?: string[]; content?: string }[];
  blog: { slug: string; title: string; date: string; excerpt?: string; tags?: string[]; content?: string }[];
  experience: { slug: string; title: string; date: string; excerpt?: string; tags?: string[]; content?: string }[];
  projects: { slug: string; title: string; description: string; tags?: string[]; live?: string; github?: string }[];
  terminal: {
    aboutText: string;
    stats: { label: string; value: string }[];
    certs: { title: string; issuer: string }[];
    skills: string[];
  };
}

export default function Desktop({ data }: { data: ContentData }) {
  const { windows } = useWindowManager();

  const renderContent = (component: string) => {
    switch (component) {
      case "ctf":
        return <FileManager files={data.ctf} title="CTF Writeups" type="ctf" />;
      case "blog":
        return <FileManager files={data.blog} title="Blog Logs" type="blog" />;
      case "experience":
        return <FileManager files={data.experience} title="Experience" type="experience" />;
      case "projects":
        return <ProjectsView projects={data.projects} />;
      case "terminal":
        return <TerminalView {...data.terminal} />;
      default:
        return <div className="p-4 text-[#555] font-mono text-xs">Unknown component: {component}</div>;
    }
  };

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {renderContent(win.component)}
        </Window>
      ))}
    </>
  );
}
