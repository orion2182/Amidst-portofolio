import Link from 'next/link';

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
}

export default function PostCard({ title, excerpt, date, slug, tags }: PostCardProps) {
  return (
    <div className="brutal-card p-6 flex flex-col group h-full overflow-hidden relative">
      {/* Scanline hover overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(123,95,220,0.1),transparent)] -translate-y-[100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col h-full bg-transparent">
        <div className="flex justify-between items-start mb-6">
          <p className="text-accent2 text-xs font-mono uppercase bg-accent2/10 px-2 py-1">{date}</p>
        </div>
        <Link href={`/blog/${slug}`} className="block flex-grow">
          <h3 
            className="text-2xl font-black font-space text-text mb-4 group-hover:text-accent transition-colors leading-tight uppercase hover-glitch"
            data-text={title}
          >
            {title}
          </h3>
          <p className="text-text/70 text-sm mb-6 line-clamp-3 font-inter">{excerpt}</p>
        </Link>
        <div className="flex flex-wrap gap-2 mt-auto border-t border-border pt-4">
          {tags && tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-muted before:content-['#'] before:text-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
