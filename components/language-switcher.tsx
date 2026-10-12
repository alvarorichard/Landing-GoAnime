"use client"

import type { MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { LANGUAGES, isLanguage, localizedPath, type Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// PT · EN · ES, all three in sight, so changing language is one tap. Each is
// a real link to the same page in that language; a plain click goes through
// setLanguage, which also remembers the choice.
export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()

  // The page without any language prefix. The Portuguese pages can report
  // their internal /pt path, so that prefix goes too.
  const [, first, ...rest] = pathname.split("/")
  const page = isLanguage(first) ? `/${rest.join("/")}` : pathname

  const onClick = (e: MouseEvent<HTMLAnchorElement>, code: Language) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (code !== language) setLanguage(code)
  }

  return (
    <div role="group" aria-label={t("lang.label")} className={cn("flex border border-line", className)}>
      {LANGUAGES.map(({ code, htmlLang }) => {
        const current = code === language
        return (
          <a
            key={code}
            href={localizedPath(code, page)}
            hrefLang={htmlLang}
            lang={htmlLang}
            aria-current={current ? "true" : undefined}
            onClick={(e) => onClick(e, code)}
            className={cn(
              "inline-flex h-11 min-w-11 flex-1 items-center justify-center px-3 font-mono text-xs font-medium tracking-[0.08em] transition-colors lg:h-9",
              current ? "bg-paper text-ink" : "text-muted-foreground hover:bg-raised hover:text-foreground",
            )}
          >
            <span aria-hidden="true">{code.toUpperCase()}</span>
            <span className="sr-only">{t(`lang.${code}`)}</span>
          </a>
        )
      })}
    </div>
  )
}
