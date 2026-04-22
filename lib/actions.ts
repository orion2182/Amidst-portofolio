"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

// Auth
export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    cookies().set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logout() {
  cookies().delete("admin_token");
  redirect("/admin/login");
}

// Content Management
export async function deletePost(type: 'blog' | 'ctf' | 'projects' | 'experience', slug: string) {
  const filePath = path.join(process.cwd(), "content", type, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    revalidatePath("/admin");
    revalidatePath(`/${type}`);
  }
}

export async function savePost(type: 'blog' | 'ctf' | 'projects' | 'experience', slug: string, content: string) {
  const dir = path.join(process.cwd(), "content", type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content);
  revalidatePath("/admin");
  revalidatePath(`/${type}`);
  revalidatePath(`/${type}/${slug}`);
}
