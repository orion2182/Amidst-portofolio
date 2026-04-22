import { getPosts } from '@/lib/markdown';

export default function ExperiencePage() {
  const experiences = getPosts('experience');

  return (
    <div className="w-full fade-in">
      <div className="border-b border-border pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-accent mb-2 text-sm uppercase tracking-widest">
            &gt; view_history
          </p>
          <h1 className="text-5xl md:text-7xl font-black font-space text-text uppercase tracking-tighter">
            Experience<span className="text-accent">_Log</span>
          </h1>
        </div>
        <div className="font-mono text-xs text-muted text-right hidden md:block">
          <p>TOTAL_ENTRIES: {experiences.length}</p>
          <p>STATUS: VERIFIED</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-8 border-l border-border pl-6 md:pl-10 relative mt-16 max-w-4xl">
        {experiences.map((exp, i) => (
          <div key={exp.slug} className="relative fade-in">
            <div className="absolute -left-[25px] md:-left-[41px] top-2 w-3 h-3 bg-bg border-2 border-accent group-hover:bg-accent transition-colors z-10"></div>
            <div className="absolute -left-[25px] md:-left-[41px] top-2 w-3 h-3 bg-accent animate-ping opacity-50 z-0"></div>
            
            <div className="brutal-card p-8 flex flex-col group">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                  <div>
                    <h3 className="text-2xl font-black font-space text-text uppercase tracking-tight group-hover:text-accent transition-colors">{exp.frontmatter.role}</h3>
                    <p className="text-accent2 font-mono text-sm mt-1">{exp.frontmatter.company} &middot; {exp.frontmatter.type}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-xs font-mono text-muted bg-bg border border-border px-2 py-1 inline-block whitespace-nowrap">{exp.frontmatter.date}</span>
                    <p className="text-xs font-mono text-muted mt-2 uppercase">{exp.frontmatter.location}</p>
                  </div>
                </div>
                <div className="text-text/80 text-sm font-inter prose prose-invert prose-p:my-1 prose-li:my-0.5 max-w-none" dangerouslySetInnerHTML={{ __html: exp.content.replace(/\n/g, '<br/>') }}>
                </div>
              </div>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="border border-dashed border-border p-12 text-center">
            <p className="font-mono text-muted uppercase">NO_EXPERIENCE_LOGS_FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}