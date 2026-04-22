import "./globals.css";
import "highlight.js/styles/github-dark.css";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import BootSequence from "@/components/BootSequence";
import CommandPalette from "@/components/CommandPalette";
import { LangProvider } from "@/lib/i18n";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "AMIDST | Cybersecurity Researcher & Red Team Portfolio",
    template: "%s | AMIDST",
  },
  description: "Cybersecurity Researcher & Red Team Practitioner — Vulnerability research, CTF writeups, and offensive security projects.",
  keywords: ["cybersecurity", "red team", "penetration testing", "CTF", "security researcher", "portfolio"],
  authors: [{ name: "Amidst" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AMIDST",
    title: "AMIDST | Cybersecurity Researcher & Red Team Portfolio",
    description: "Cybersecurity Researcher & Red Team Practitioner — Vulnerability research, CTF writeups, and offensive security projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMIDST | Cybersecurity Researcher & Red Team Portfolio",
    description: "Cybersecurity Researcher & Red Team Practitioner — Vulnerability research, CTF writeups, and offensive security projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-inter overflow-hidden bg-slate-50`}>
        <LangProvider>
        <BootSequence />
        <CustomCursor />
        <CommandPalette />

        {/* Full viewport — the OS desktop */}
        <div className="w-screen h-screen relative">
          {children}
        </div>

        </LangProvider>
      </body>
    </html>
  );
}
