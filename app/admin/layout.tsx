import AdminLogoutButton from "@/components/AdminLogoutButton";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto w-full pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border pb-6 gap-4">
        <div>
          <p className="font-mono text-accent2 mb-2 text-xs uppercase tracking-widest">&gt; root_access_granted</p>
          <h1 className="text-4xl font-black font-space text-text uppercase tracking-tighter">
            <Link href="/admin" className="hover:text-accent transition-colors">Admin<span className="text-accent2">_Dashboard</span></Link>
          </h1>
        </div>
        <AdminLogoutButton />
      </header>
      {children}
    </div>
  );
}
