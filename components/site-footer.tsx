"use client"

import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { useLanguage } from "@/contexts/language-context"
import { links } from "@/lib/links"

export function SiteFooter() {
  const { t } = useLanguage()

  const columns = [
    {
      title: t("footer.project"),
      items: [
        { href: links.github, label: "GitHub", external: true },
        { href: links.releases, label: t("footer.releases"), external: true },
        { href: "/download", label: t("nav.download"), external: false },
        { href: links.license, label: t("footer.license"), external: true },
      ],
    },
    {
      title: t("footer.community"),
      items: [
        { href: links.discord, label: "Discord", external: true },
        { href: links.mobile, label: "GoAnime Mobile", external: true },
        { href: links.devGuide, label: t("footer.devguide"), external: true },
      ],
    },
  ]

  return (
    <footer className="border-t border-border/70">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="space-y-3 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark size={28} />
            <span className="font-semibold tracking-tight">GoAnime</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <p className="text-sm text-muted-foreground">
            {t("footer.by")}{" "}
            <a
              href={links.author}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              alvarorichard
            </a>{" "}
            {t("footer.contributors")} {t("footer.logo")}
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="space-y-3 text-sm">
            <h2 className="font-medium">{column.title}</h2>
            <ul className="space-y-2">
              {column.items.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border/70">
        <p className="container py-6 text-xs leading-relaxed text-muted-foreground">{t("footer.disclaimer")}</p>
      </div>
    </footer>
  )
}
