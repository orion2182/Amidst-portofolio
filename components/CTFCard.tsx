import Link from 'next/link';

interface CTFCardProps {
  title: string;
  event: string;
  category: string;
  difficulty: string;
  excerpt: string;
  slug: string;
}

const catColors: Record<string, string> = {
  web: "text-accent border-accent",
  crypto: "text-accent2 border-accent2",
  pwn: "text-pink border-pink",
  forensics: "text-neon border-neon",
  misc: "text-muted border-muted",
};

export default function CTFCard({ title, event, category, difficulty, excerpt, slug }: CTFCardProps) {
  const catColor = catColors[category.toLowerCase()] || catColors.misc;

  return (
    <div className="brutal-card p-6 flex flex-col group h-full overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-6 border-b border-border pb-4">
          <span className={`px-2 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border-l-4 ${catColor} bg-bg whitespace-nowrap`}>
            {category}
          </span>
          <span className="text-[10px] sm:text-xs text-muted font-mono px-2 py-1 uppercase tracking-widest border border-border whitespace-nowrap">
            {difficulty}
          </span>
        </div>
        <Link href={`/ctf/${slug}`} className="block flex-grow">
          <h3 
            className="text-xl sm:text-2xl font-black font-space text-text mb-2 group-hover:text-accent2 transition-colors uppercase leading-tight break-words hover-glitch"
            data-text={title}
          >
            {title}
          </h3>
        </Link>
        <div className="mt-auto pt-6">
          {event && <p className="text-xs font-mono text-accent2 mb-2 uppercase before:content-['@'] before:mr-1">{event}</p>}
          <p className="text-text/70 text-sm mb-4 line-clamp-2 font-inter">{excerpt}</p>
          <Link href={`/ctf/${slug}`} className="inline-flex items-center text-xs font-mono text-text hover:text-accent transition-colors uppercase tracking-widest group/link">
            ACCESS_RECORD <span className="ml-2 group-hover/link:translate-x-1 transition-transform">&gt;&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
