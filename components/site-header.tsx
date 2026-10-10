"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { GitHubIcon } from "@/components/icons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LANGUAGES, useLanguage } from "@/contexts/language-context"
import { formatStars, useGitHubStars } from "@/hooks/use-github-stars"
import { links } from "@/lib/links"

export function SiteHeader() {
  const { t, language } = useLanguage()
  const stars = useGitHubStars()
  const locale = LANGUAGES.find((l) => l.code === language)?.htmlLang ?? "pt-BR"

  const nav = [
    { href: "/#features", label: t("nav.features") },
    { href: "/#demo", label: t("nav.demo") },
    { href: "/#install", label: t("nav.install") },
    { href: "/download", label: t("nav.download") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={t("nav.home")} className="flex items-center gap-2.5 rounded-md">
          <BrandMark size={30} priority />
          <span className="text-[17px] font-semibold tracking-tight">GoAnime</span>
        </Link>

        <nav aria-label={t("nav.label")} className="hidden items-center gap-7 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">GitHub</span>
            {stars !== null && (
              <span className="hidden items-center gap-1 border-l border-border pl-2 tabular-nums sm:inline-flex">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {formatStars(stars, locale)}
                <span className="sr-only">{t("hero.stars")}</span>
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}
