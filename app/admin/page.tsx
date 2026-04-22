import { getPosts } from "@/lib/markdown";
import Button from "@/components/Button";
import { deletePost } from "@/lib/actions";

export default function AdminDashboard() {
  const blogPosts = getPosts("blog");
  const ctfPosts = getPosts("ctf");
  const projectPosts = getPosts("projects");
  const expPosts = getPosts("experience");

  return (
    <div className="space-y-16 fade-in">
      
      {/* BLOG SECTION */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div>
            <p className="font-mono text-accent mb-2 text-xs uppercase tracking-widest">&gt; manage_records</p>
            <h2 className="text-3xl font-black font-space text-text uppercase tracking-tighter">System<span className="text-accent">_Logs</span></h2>
          </div>
          <Button href="/admin/blog/new" variant="primary" className="py-2 px-4 text-xs">INIT_NEW_LOG</Button>
        </div>
        <div className="bg-bg border border-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map(post => (
                <tr key={post.slug} className="border-border border-b last:border-0 hover:bg-bg2/50 transition-colors group">
                  <td className="py-4 px-6 text-text group-hover:text-accent transition-colors">{post.frontmatter.title}</td>
                  <td className="py-4 px-6 text-muted">{post.frontmatter.date}</td>
                  <td className="py-4 px-6 flex gap-4 justify-end">
                    <form action={async () => {
                      "use server";
                      await deletePost("blog", post.slug);
                    }}>
                      <button type="submit" className="text-xs uppercase tracking-widest text-pink hover:text-bg hover:bg-pink border border-pink px-3 py-1 transition-colors">
                        [DELETE]
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {blogPosts.length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-muted uppercase tracking-widest">No_Logs_Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTF SECTION */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div>
            <p className="font-mono text-pink mb-2 text-xs uppercase tracking-widest">&gt; manage_records</p>
            <h2 className="text-3xl font-black font-space text-text uppercase tracking-tighter">CTF<span className="text-pink">_Writeups</span></h2>
          </div>
          <Button href="/admin/ctf/new" variant="primary" className="py-2 px-4 text-xs">INIT_NEW_WRITEUP</Button>
        </div>
        <div className="bg-bg border border-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-pink"></div>
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Event</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ctfPosts.map(post => (
                <tr key={post.slug} className="border-border border-b last:border-0 hover:bg-bg2/50 transition-colors group">
                  <td className="py-4 px-6 text-text group-hover:text-pink transition-colors">{post.frontmatter.title}</td>
                  <td className="py-4 px-6 text-muted">{post.frontmatter.event}</td>
                  <td className="py-4 px-6 flex gap-4 justify-end">
                    <form action={async () => {
                      "use server";
                      await deletePost("ctf", post.slug);
                    }}>
                      <button type="submit" className="text-xs uppercase tracking-widest text-pink hover:text-bg hover:bg-pink border border-pink px-3 py-1 transition-colors">
                        [DELETE]
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {ctfPosts.length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-muted uppercase tracking-widest">No_Writeups_Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div>
            <p className="font-mono text-neon mb-2 text-xs uppercase tracking-widest">&gt; manage_projects</p>
            <h2 className="text-3xl font-black font-space text-text uppercase tracking-tighter">Active<span className="text-neon">_Projects</span></h2>
          </div>
          <Button href="/admin/projects/new" variant="primary" className="py-2 px-4 text-xs !bg-neon !text-bg border-neon shadow-[4px_4px_0px_0px_rgba(168,230,61,0.5)] hover:shadow-[0_0_0_0_rgba(168,230,61,0.5)] hover:!text-neon hover:!bg-transparent">INIT_NEW_PROJECT</Button>
        </div>
        <div className="bg-bg border border-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-neon"></div>
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Featured</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectPosts.map(post => (
                <tr key={post.slug} className="border-border border-b last:border-0 hover:bg-bg2/50 transition-colors group">
                  <td className="py-4 px-6 text-text group-hover:text-neon transition-colors">{post.frontmatter.title}</td>
                  <td className="py-4 px-6 text-muted">{post.frontmatter.featured ? "TRUE" : "FALSE"}</td>
                  <td className="py-4 px-6 flex gap-4 justify-end">
                    <form action={async () => {
                      "use server";
                      await deletePost("projects", post.slug);
                    }}>
                      <button type="submit" className="text-xs uppercase tracking-widest text-pink hover:text-bg hover:bg-pink border border-pink px-3 py-1 transition-colors">
                        [DELETE]
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {projectPosts.length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-muted uppercase tracking-widest">No_Projects_Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div>
            <p className="font-mono text-accent2 mb-2 text-xs uppercase tracking-widest">&gt; manage_experience</p>
            <h2 className="text-3xl font-black font-space text-text uppercase tracking-tighter">Experience<span className="text-accent2">_Log</span></h2>
          </div>
          <Button href="/admin/experience/new" variant="primary" className="py-2 px-4 text-xs !bg-accent2 !text-text border-accent2 shadow-[4px_4px_0px_0px_rgba(123,95,220,0.5)] hover:shadow-[0_0_0_0_rgba(123,95,220,0.5)] hover:!text-accent2 hover:!bg-transparent">INIT_NEW_EXP</Button>
        </div>
        <div className="bg-bg border border-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent2"></div>
          <table className="w-full text-left border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-border bg-bg2">
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Role</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest">Company</th>
                <th className="py-4 px-6 text-muted font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expPosts.map(post => (
                <tr key={post.slug} className="border-border border-b last:border-0 hover:bg-bg2/50 transition-colors group">
                  <td className="py-4 px-6 text-text group-hover:text-accent2 transition-colors">{post.frontmatter.role}</td>
                  <td className="py-4 px-6 text-muted">{post.frontmatter.company}</td>
                  <td className="py-4 px-6 flex gap-4 justify-end">
                    <form action={async () => {
                      "use server";
                      await deletePost("experience", post.slug);
                    }}>
                      <button type="submit" className="text-xs uppercase tracking-widest text-pink hover:text-bg hover:bg-pink border border-pink px-3 py-1 transition-colors">
                        [DELETE]
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {expPosts.length === 0 && (
                <tr><td colSpan={3} className="py-12 text-center text-muted uppercase tracking-widest">No_Experience_Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
