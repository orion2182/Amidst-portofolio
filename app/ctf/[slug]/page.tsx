import { getPostBySlug, getPosts } from '@/lib/markdown';
import MarkdownPreview from '@/components/MarkdownPreview';
import Link from 'next/link';
import type { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';
import CodeBlockEnhancer from '@/components/CodeBlockEnhancer';
import Translate from '@/components/Translate';

export async function generateStaticParams() {
  const posts = getPosts('ctf');
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug('ctf', params.slug);
  if (!post) return { title: 'Writeup Not Found' };
  return {
    title: `${post.frontmatter.title} | CTF Writeup`,
    description: post.frontmatter.excerpt || `CTF writeup for ${post.frontmatter.title}`,
    openGraph: {
      title: `${post.frontmatter.title} | CTF Writeup`,
      description: post.frontmatter.excerpt || `CTF writeup for ${post.frontmatter.title}`,
      type: 'article',
    },
  };
}

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function CTFPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug('ctf', params.slug);
  if (!post) return <div className="text-center py-20 text-text font-mono uppercase tracking-widest">Record not found // error_404</div>;

  const readingTime = getReadingTime(post.content);

  return (
    <div className="flex gap-8 w-full fade-in">
      <div className="max-w-4xl w-full mx-auto">
        <Link href="/ctf" className="text-muted hover:text-pink mb-8 inline-block font-mono text-xs uppercase tracking-widest group cursor-none">
          <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">&lt;&lt;</span> <Translate i18nKey="return_writeups" />
        </Link>
        
        <header className="mb-12 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border-l-4 border-pink text-pink bg-bg2">
              {post.frontmatter.category || 'Misc'}
            </span>
            <span className="text-xs text-muted font-mono px-2 py-1 uppercase tracking-widest border border-border">
              {post.frontmatter.difficulty || 'Medium'}
            </span>
            <span className="text-xs text-muted font-mono uppercase tracking-widest">
              {readingTime} <Translate i18nKey="min_read" />
            </span>
            <p className="font-mono text-accent2 text-xs uppercase tracking-widest ml-auto">
              {post.frontmatter.date}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space text-text mb-4 uppercase tracking-tighter leading-tight">{post.frontmatter.title}</h1>
          {post.frontmatter.event && <p className="text-pink text-sm font-mono uppercase tracking-widest mb-4 before:content-['@'] before:mr-1">{post.frontmatter.event}</p>}
        </header>

        <article className="prose prose-invert max-w-none 
          prose-headings:font-space prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-a:text-pink prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-accent
          prose-p:font-inter prose-p:text-text/80 prose-p:leading-relaxed
          prose-strong:text-text prose-strong:font-bold
          prose-code:font-mono prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1
          prose-pre:bg-bg2 prose-pre:border-l-4 prose-pre:border-pink prose-pre:rounded-none
          prose-table:w-full prose-table:border-collapse prose-table:text-sm
          prose-th:border prose-th:border-border prose-th:bg-bg2 prose-th:p-3 prose-th:text-left prose-th:font-mono prose-th:text-muted prose-th:uppercase
          prose-td:border prose-td:border-border prose-td:p-3 prose-td:font-inter">
          <MarkdownPreview source={post.content} />
        </article>
        <CodeBlockEnhancer />
      </div>
      <TableOfContents />
    </div>
  );
}
