"use client"

import { ChevronDown, Globe } from "lucide-react"
import { LANGUAGES, useLanguage, type Language } from "@/contexts/language-context"

// A native select: keyboard, screen reader and mobile pickers work without
// any custom menu code.
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <label className="relative inline-flex h-9 items-center rounded-md border border-border text-sm text-muted-foreground transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/30 hover:text-foreground">
      <span className="sr-only">{t("lang.label")}</span>
      <Globe className="pointer-events-none absolute left-2.5 h-4 w-4" aria-hidden="true" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="h-full cursor-pointer appearance-none rounded-md bg-transparent pl-8 pr-7 outline-none"
      >
        {LANGUAGES.map(({ code }) => (
          <option key={code} value={code} className="bg-popover text-popover-foreground">
            {t(`lang.${code}`)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 opacity-60" aria-hidden="true" />
    </label>
  )
}
