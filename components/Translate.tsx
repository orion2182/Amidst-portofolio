"use client";

import { useLang } from "@/lib/i18n";

interface TranslateProps {
  i18nKey: string;
  fallback?: string;
  className?: string;
}

export default function Translate({ i18nKey, fallback, className }: TranslateProps) {
  const { t } = useLang();
  
  if (className) {
    return <span className={className}>{t(i18nKey) || fallback || i18nKey}</span>;
  }
  
  return <>{t(i18nKey) || fallback || i18nKey}</>;
}
