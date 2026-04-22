import { getPosts } from '@/lib/markdown';
import FilteredList from '@/components/FilteredList';

export default function CTFPage() {
  const posts = getPosts('ctf');

  return (
    <div className="w-full fade-in">
      <div className="border-b border-border pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="bg-bg2/80 border border-pink/30 p-4 mb-4 font-mono text-sm inline-block w-full md:w-auto">
            <p className="text-pink mb-1">$ grep -r &quot;flag&#123;&quot; /opt/ctf/writeups</p>
            <p className="text-muted text-xs line-through opacity-50 mb-2">Permission denied</p>
            <p className="text-neon text-xs mb-2">Privilege Escalation: SUCCESS</p>
            <h1 className="text-4xl md:text-6xl font-black font-space text-text tracking-tighter uppercase glitch-text" data-text="CTF_WRITEUPS">
              CTF_WRITEUPS
            </h1>
          </div>
        <div className="font-mono text-xs text-muted text-right hidden md:block">
          <p>TOTAL_RECORDS: {posts.length}</p>
          <p>STATUS: DECRYPTED</p>
        </div>
      </div>
      
      <FilteredList items={posts} type="ctf" />
    </div>
  );
}
