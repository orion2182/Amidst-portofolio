import { getPosts } from "@/lib/markdown";
import OSDesktopClient from "./OSDesktopClient";

export default function Home() {
  // Fetch all content at build time (server component)
  const ctfPosts = getPosts("ctf").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || p.slug,
    date: p.frontmatter.date || "",
    excerpt: p.frontmatter.excerpt || "",
    tags: p.frontmatter.tags || [],
    content: p.content,
  }));

  const blogPosts = getPosts("blog").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || p.slug,
    date: p.frontmatter.date || "",
    excerpt: p.frontmatter.excerpt || "",
    tags: p.frontmatter.tags || [],
    content: p.content,
  }));

  const experiencePosts = getPosts("experience").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || p.slug,
    date: p.frontmatter.date || "",
    excerpt: p.frontmatter.excerpt || "",
    tags: p.frontmatter.tags || [],
    content: p.content,
  }));

  const projects = getPosts("projects").map(p => ({
    slug: p.slug,
    title: p.frontmatter.title || p.slug,
    description: p.frontmatter.description || "",
    tags: p.frontmatter.tags || [],
    live: p.frontmatter.live || "",
    github: p.frontmatter.github || "",
  }));

  const certifications = [
    { title: "Pentest+", issuer: "CompTIA" },
    { title: "Multi Cloud Blue Team Analyst", issuer: "CyberWarFare Labs" },
    { title: "Multi Cloud Red Team Analyst", issuer: "CyberWarFare Labs" },
    { title: "Certified Cyber Security Analyst", issuer: "CyberWarFare Labs" },
  ];

  const skills = [
    "Burp Suite", "Cobalt Strike", "Metasploit", "Nmap", "BloodHound",
    "Python", "Bash", "Go", "Active Directory", "AWS",
  ];

  const aboutText = "Cybersecurity Researcher & Red Team Practitioner dedicated to bridging academic knowledge with real-world offensive security operations. Passionate about vulnerability research, CTF competitions, and developing hands-on red team infrastructure.";

  const data = {
    ctf: ctfPosts,
    blog: blogPosts,
    experience: experiencePosts,
    projects,
    terminal: {
      aboutText,
      stats: [
        { label: "CTF_SOLVED", value: String(ctfPosts.length) },
        { label: "LOGS_WRITTEN", value: String(blogPosts.length) },
        { label: "PROJECTS_DEPLOYED", value: String(projects.length) },
        { label: "CERTS_OBTAINED", value: String(certifications.length) },
      ],
      certs: certifications,
      skills,
    },
  };

  return <OSDesktopClient data={data} />;
}