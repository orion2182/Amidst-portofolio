"use client";
import { useState } from "react";
import Button from "@/components/Button";
import { savePost } from "@/lib/actions";
import { useRouter } from "next/navigation";
import MarkdownPreview from "@/components/MarkdownPreview";

export default function NewBlogPost() {
  const router = useRouter();
  const [content, setContent] = useState("---\ntitle: \"\"\ndate: \"\"\ntags: []\nexcerpt: \"\"\npublished: true\n---\n\n## Heading");
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const slug = formData.get("slug") as string;
    
    await savePost("blog", slug, content);
    router.push("/admin");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-space text-text mb-6">New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-muted text-sm font-medium mb-2">Slug</label>
            <input 
              type="text" 
              name="slug" 
              required 
              placeholder="my-new-post"
              className="w-full bg-bg border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit">Save Post</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          <div className="flex flex-col">
            <label className="block text-muted text-sm font-medium mb-2">Raw Markdown</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-bg border border-border rounded-md p-4 text-text font-mono text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="block text-muted text-sm font-medium mb-2">Preview</label>
            <div className="flex-1 border border-border rounded-md p-4 overflow-y-auto bg-bg2">
              <MarkdownPreview source={content.replace(/^---[\s\S]+?---/, '')} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
