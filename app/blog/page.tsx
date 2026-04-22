import { getPosts } from '@/lib/markdown';
import FilteredList from '@/components/FilteredList';

export default function BlogPage() {
  const posts = getPosts('blog');

  return (
    <div className="w-full fade-in">
      <div className="border-b border-border pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="bg-bg2/80 border border-border p-4 mb-4 font-mono text-sm inline-block">
            <p className="text-accent mb-1">$ ls -la /var/log/system</p>
            <p className="text-muted text-xs">drwxr-xr-x 2 amidst system 4096 Apr 18 10:00 .</p>
            <p className="text-muted text-xs mb-2">drwxr-xr-x 1 amidst root   4096 Apr 18 10:00 ..</p>
            <h1 className="text-4xl md:text-6xl font-black font-space text-text tracking-tighter uppercase glitch-text" data-text="SYSTEM_LOGS">
              SYSTEM_LOGS
            </h1>
          </div>
        <div className="font-mono text-xs text-muted text-right hidden md:block">
          <p>TOTAL_ENTRIES: {posts.length}</p>
          <p>STATUS: UNRESTRICTED</p>
        </div>
      </div>
      
      <FilteredList items={posts} type="blog" />
    </div>
  );
}
