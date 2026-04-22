import { savePost } from "@/lib/actions";
import Button from "@/components/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewExperiencePage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const role = formData.get("role") as string;
    const slug = role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const company = formData.get("company") as string;
    const type = formData.get("type") as string;
    const dateStr = formData.get("date") as string;
    const location = formData.get("location") as string;
    const content = formData.get("content") as string;

    const fileContent = `---
    role: "${role}"
    company: "${company}"
    type: "${type}"
    date: "${dateStr}"
    location: "${location}"
    ---

    ${content}`;

    await savePost("experience", slug, fileContent);
    redirect("/admin");
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 fade-in">
      <Link href="/admin" className="text-muted hover:text-accent2 mb-8 inline-block font-mono text-xs uppercase tracking-widest group">
        <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">&lt;&lt;</span> ABORT_AND_RETURN
      </Link>

      <div className="brutal-card p-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-accent2"></div>
        <div className="mb-8">
          <p className="font-mono text-accent2 mb-2 text-xs uppercase tracking-widest">&gt; initialize_experience</p>
          <h1 className="text-4xl font-black font-space text-text uppercase tracking-tighter">New<span className="text-accent2">_Experience</span></h1>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-6 font-mono text-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Role Title</label>
              <input type="text" name="role" required placeholder="Assistant Lecturer" className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Company / Institution</label>
              <input type="text" name="company" required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Job Type</label>
              <input type="text" name="type" placeholder="Full-time, Part-time..." required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Date Range</label>
              <input type="text" name="date" placeholder="Sep 2022 - Jul 2025" required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-muted uppercase tracking-widest">Location</label>
              <input type="text" name="location" placeholder="Jakarta, Indonesia · Hybrid" required className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-muted uppercase tracking-widest">Job Description (Markdown List)</label>
            <textarea name="content" rows={10} placeholder="1. Did x&#10;2. Did y..." className="bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:border-accent2 focus:bg-bg2 transition-colors font-mono"></textarea>
          </div>

          <Button type="submit" className="mt-8 self-start !bg-accent2 !text-text border-accent2 shadow-[4px_4px_0px_0px_rgba(123,95,220,0.5)] hover:shadow-[0_0_0_0_rgba(123,95,220,0.5)] hover:!text-accent2 hover:!bg-transparent">SAVE_EXPERIENCE</Button>
        </form>
      </div>
    </div>
  );
}
