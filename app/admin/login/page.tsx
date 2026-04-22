"use client";
import { useState } from "react";
import { login } from "@/lib/actions";
import Button from "@/components/Button";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 w-full fade-in">
      <div className="w-full max-w-md brutal-card p-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
        
        <div className="mb-8 text-center">
          <p className="font-mono text-accent mb-2 text-xs uppercase tracking-widest">&gt; auth_required</p>
          <h1 className="text-4xl font-black font-space text-text uppercase tracking-tighter">System<span className="text-accent">_Login</span></h1>
        </div>
        
        {error && (
          <div className="bg-pink/10 border border-pink p-3 mb-6">
            <p className="text-pink text-center text-xs font-mono uppercase tracking-widest">[ERROR] {error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-mono uppercase tracking-widest" htmlFor="password">
              &gt; input_passphrase
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              required
              className="w-full bg-bg border border-border px-4 py-3 text-text font-mono focus:outline-none focus:border-accent focus:bg-bg2 transition-colors"
              placeholder="••••••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full mt-4">AUTHENTICATE</Button>
        </form>
      </div>
    </div>
  );
}
