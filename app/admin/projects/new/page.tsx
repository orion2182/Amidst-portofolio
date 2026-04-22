import { savePost } from "@/lib/actions";
import Button from "@/components/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewProjectPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim());
    const live = formData.get("live") as string;
    const github = formData.get("github") as string;
    const featured = formData.get("featured") === "on";
    const date = new Date().toISOString().split('T')[0];
    const content = formData.get("content") as string;

    const fileContent = `---
    title: "${title}"
    description: "${description}"
    tags: ${JSON.stringify(tags)}
    live: "${live}"
    github: "${github}"
    featured: ${featured}
    date: "${date}"
    ---

    ${content}`;

    await savePost("projects", slug, fileContent);
    redirect("/admin");
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 fade-in">
      <Link href="/admin" className="text-muted hover:text-neon mb-8 inline-block font-mono text-xs uppercase tracking-widest group">
        <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">&lt;&lt;</span> ABORT_AND_RETURN
      </Link>

      <div className="brutal-card p-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-neon"></div>
        <div className="mb-8">
          <p className="font-mono text-neon mb-2 text-xs uppercase tracking-widest">&gt; initialize_project</p>
          <h1 className="text-4xl font-black font-space text-text uppercase tracking-tighter">New<span className="text-neon">_Project</span></h1>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-6 font-mono text-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Project Title</label>
              <input type="text" name="title" required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Tags (comma separated)</label>
              <input type="text" name="tags" placeholder="React, Node, etc..." className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted uppercase tracking-widest">Short Description</label>
            <input type="text" name="description" required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Live URL (optional)</label>
              <input type="text" name="live" className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">GitHub URL (optional)</label>
              <input type="text" name="github" className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-bg border border-border px-4 py-3">
            <input type="checkbox" name="featured" id="featured" className="w-4 h-4 accent-neon bg-bg border-border" />
            <label htmlFor="featured" className="text-neon uppercase tracking-widest cursor-pointer select-none">Feature on Homepage</label>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-muted uppercase tracking-widest">Body Content (Markdown)</label>
            <textarea name="content" rows={12} className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-neon focus:bg-bg2 transition-colors font-mono"></textarea>
          </div>

          <Button type="submit" className="mt-8 self-start !bg-neon !text-bg border-neon shadow-[4px_4px_0px_0px_rgba(168,230,61,0.5)] hover:shadow-[0_0_0_0_rgba(168,230,61,0.5)] hover:!text-neon hover:!bg-transparent">SAVE_PROJECT</Button>
        </form>
      </div>
    </div>
  );
}
