import { getPostBySlug, getPosts } from '@/lib/markdown';
import MarkdownPreview from '@/components/MarkdownPreview';
import TagBadge from '@/components/TagBadge';
import Link from 'next/link';
import type { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';
import CodeBlockEnhancer from '@/components/CodeBlockEnhancer';
import Translate from '@/components/Translate';

export async function generateStaticParams() {
  const posts = getPosts('blog');
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug('blog', params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt || 'A blog post by Amidst',
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt || 'A blog post by Amidst',
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug('blog', params.slug);
  if (!post) return <div className="text-center py-20 text-text font-mono uppercase tracking-widest">Post not found // error_404</div>;

  const readingTime = getReadingTime(post.content);

  return (
    <div className="flex gap-8 w-full fade-in">
      <div className="max-w-4xl w-full mx-auto">
        <Link href="/blog" className="text-muted hover:text-accent mb-8 inline-block font-mono text-xs uppercase tracking-widest group cursor-none">
          <span className="inline-block group-hover:-translate-x-1 transition-transform mr-2">&lt;&lt;</span> <Translate i18nKey="return_logs" />
        </Link>
        
        <header className="mb-12 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <p className="font-mono text-accent2 text-xs uppercase tracking-widest bg-accent2/10 inline-block px-2 py-1">
              {post.frontmatter.date}
            </p>
            <p className="font-mono text-muted text-xs uppercase tracking-widest">
              {readingTime} <Translate i18nKey="min_read" />
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space text-text mb-8 uppercase tracking-tighter leading-tight">{post.frontmatter.title}</h1>
          <div className="flex flex-wrap gap-2">
            {post.frontmatter.tags?.map((tag: string) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>

        <article className="prose prose-invert max-w-none 
          prose-headings:font-space prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-accent2
          prose-p:font-inter prose-p:text-text/80 prose-p:leading-relaxed
          prose-strong:text-text prose-strong:font-bold
          prose-code:font-mono prose-code:text-pink prose-code:bg-pink/10 prose-code:px-1
          prose-pre:bg-bg2 prose-pre:border-l-4 prose-pre:border-accent2 prose-pre:rounded-none
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
