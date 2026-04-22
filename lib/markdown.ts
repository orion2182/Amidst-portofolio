import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export function getPosts(type: 'blog' | 'ctf' | 'projects' | 'experience') {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const markdownWithMeta = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data: frontmatter, content } = matter(markdownWithMeta);
    
    return {
      slug,
      frontmatter,
      content,
    };
  });
  
  // Sort by date desc
  return posts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });
}

export function getPostBySlug(type: 'blog' | 'ctf' | 'projects' | 'experience', slug: string) {
  const file = path.join(contentDir, type, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  
  const markdownWithMeta = fs.readFileSync(file, 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);
  
  return {
    slug,
    frontmatter,
    content,
  };
}
