"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "id" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.blog": { en: "Blog", id: "Blog" },
  "nav.ctf": { en: "CTF", id: "CTF" },
  "nav.projects": { en: "Projects", id: "Proyek" },
  "nav.experience": { en: "Experience", id: "Pengalaman" },
  "nav.admin": { en: "Admin", id: "Admin" },

  // Hero
  "hero.init": { en: "> init_user_profile", id: "> init_profil_pengguna" },
  "hero.access_projects": { en: "ACCESS_PROJECTS", id: "AKSES_PROYEK" },
  "hero.read_flags": { en: "READ_FLAGS", id: "BACA_FLAG" },

  // Section headings
  "section.about": { en: "> ABOUT_ME", id: "> TENTANG_SAYA" },
  "section.metrics": { en: "> SYSTEM_METRICS", id: "> METRIK_SISTEM" },
  "section.certs": { en: "> CERTIFICATIONS", id: "> SERTIFIKASI" },
  "section.loadout": { en: "> LOADOUT", id: "> PERALATAN" },
  "section.featured": { en: "> FEATURED_PROJECTS", id: "> PROYEK_UNGGULAN" },
  "section.recent": { en: "> RECENT_LOGS", id: "> LOG_TERBARU" },

  // About
  "about.text": {
    en: "Cybersecurity Researcher & Red Team Practitioner dedicated to bridging academic knowledge with real-world offensive security operations. Passionate about vulnerability research, CTF competitions, and developing hands-on red team infrastructure.",
    id: "Peneliti Keamanan Siber & Praktisi Red Team yang berdedikasi menjembatani pengetahuan akademis dengan operasi keamanan ofensif. Berpengalaman dalam riset kerentanan, kompetisi CTF, dan pengembangan infrastruktur red team.",
  },

  // Stats labels
  "stats.ctf": { en: "CTF_SOLVED", id: "CTF_SELESAI" },
  "stats.logs": { en: "LOGS_WRITTEN", id: "LOG_DITULIS" },
  "stats.projects": { en: "PROJECTS_DEPLOYED", id: "PROYEK_TERLUNCUR" },
  "stats.certs": { en: "CERTS_OBTAINED", id: "SERTIFIKAT_DIPEROLEH" },

  // Footer
  "footer.system": { en: "SYSTEM: ONLINE", id: "SISTEM: AKTIF" },
  "footer.connection": { en: "CONNECTION: ENCRYPTED", id: "KONEKSI: TERENKRIPSI" },
  "footer.terminal_hint": { en: "Press ~ for terminal", id: "Tekan ~ untuk terminal" },

  // Misc
  "view_all": { en: "VIEW_ALL", id: "LIHAT_SEMUA" },
  "return_logs": { en: "RETURN_TO_LOGS", id: "KEMBALI_KE_LOG" },
  "return_writeups": { en: "RETURN_TO_WRITEUPS", id: "KEMBALI_KE_WRITEUP" },
  "min_read": { en: "MIN_READ", id: "MENIT_BACA" },
  "no_logs": { en: "NO_LOGS_FOUND", id: "LOG_TIDAK_DITEMUKAN" },
  "no_projects": { en: "NO_FEATURED_PROJECTS", id: "TIDAK_ADA_PROYEK_UNGGULAN" },
  "show_all": { en: "SHOW_ALL", id: "TAMPILKAN_SEMUA" },
  "no_records": { en: "No_records_match_query", id: "Tidak_ada_yang_cocok" },
  "exec_live": { en: "EXEC_LIVE", id: "JALANKAN" },
  "src_code": { en: "SRC_CODE", id: "KODE_SUMBER" },
  "access_record": { en: "ACCESS_RECORD", id: "AKSES_REKAMAN" },

  // Command palette
  "cmd.placeholder": { en: "Search pages, posts, commands...", id: "Cari halaman, post, perintah..." },
  "cmd.no_results": { en: "No results found", id: "Tidak ditemukan" },

  // 404
  "404.title": { en: "ACCESS_DENIED", id: "AKSES_DITOLAK" },
  "404.subtitle": { en: "The requested resource could not be located in the system.", id: "Sumber yang diminta tidak ditemukan dalam sistem." },
  "404.home": { en: "RETURN_HOME", id: "KEMBALI_KE_BERANDA" },

  // Boot
  "boot.ready": { en: "SYSTEM READY.", id: "SISTEM SIAP." },
  "boot.entering": { en: "▶ ENTERING SYSTEM...", id: "▶ MEMASUKI SISTEM..." },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "id" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
