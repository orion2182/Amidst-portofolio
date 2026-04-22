import { getPosts } from '@/lib/markdown';
import FilteredList from '@/components/FilteredList';

export default function ProjectsPage() {
  const projects = getPosts('projects');

  return (
    <div className="w-full fade-in">
      <div className="border-b border-border pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="bg-bg2/80 border border-neon/30 p-4 mb-4 font-mono text-sm inline-block w-full md:w-auto">
            <p className="text-neon mb-1">$ ./deploy -all -environments</p>
            <p className="text-muted text-xs mb-2">Executing build sequences...</p>
            <h1 className="text-4xl md:text-6xl font-black font-space text-text tracking-tighter uppercase glitch-text" data-text="ACTIVE_PROJECTS">
              ACTIVE_PROJECTS
            </h1>
          </div>
        <div className="font-mono text-xs text-muted text-right hidden md:block">
          <p>TOTAL_RECORDS: {projects.length}</p>
          <p>STATUS: UNRESTRICTED</p>
        </div>
      </div>
      
      <FilteredList items={projects} type="projects" />
    </div>
  );
}