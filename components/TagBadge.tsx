interface TagBadgeProps {
  tag: string;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-mono border-l-2 border-accent text-accent bg-accent/5 uppercase tracking-widest">
      {tag}
    </span>
  );
}
