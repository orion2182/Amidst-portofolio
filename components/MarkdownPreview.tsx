import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm as any],
    rehypePlugins: [rehypeHighlight as any],
  },
};

export default function MarkdownPreview({ source }: { source: string }) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <MDXRemote source={source} options={options} />
    </div>
  );
}
