"use client"

import { useRef } from "react"
import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { LanguageSwitcher } from "@/components/language-switcher"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { links } from "@/lib/links"

export function SiteFooter() {
  const { t, href } = useLanguage()
  const big = useRef<HTMLDivElement>(null)

  // The outlined name at the very bottom rises into place as the page ends.
  useGSAP(
    () => {
      const el = big.current
      if (!el?.parentElement || prefersReducedMotion()) return
      gsap.fromTo(
        el,
        { yPercent: 55 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      )
    },
    { scope: big },
  )

  const columns = [
    {
      title: t("footer.project"),
      items: [
        { href: links.github, label: "GitHub", external: true },
        { href: links.releases, label: t("footer.releases"), external: true },
        { href: href("/download"), label: t("nav.download"), external: false },
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

  const linkClass = "flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground lg:min-h-9"

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-14 sm:pt-16 lg:grid-cols-[2fr_1fr_1fr_1.1fr] lg:gap-16 lg:pt-20">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Link href={href("/")} aria-label={t("nav.home")} className="inline-flex min-h-11 items-center gap-3">
            <BrandMark size={44} className="h-11 w-11" />
            <span className="font-display text-xl tracking-[0.04em]">GOANIME</span>
          </Link>
          <p className="text-soft">{t("footer.tagline")}</p>
          <p className="max-w-[34em] text-sm leading-relaxed text-subtle">
            {t("footer.by")}{" "}
            <a
              href={links.author}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              alvarorichard
            </a>{" "}
            {t("footer.contributors")} {t("footer.logo")}
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="space-y-2 text-[15px]">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-brand">{column.title}</h2>
            <ul>
              {column.items.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 space-y-4 sm:col-span-1">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-brand">{t("lang.label")}</h2>
          <LanguageSwitcher className="max-w-xs" />
        </div>
      </div>

      <div className="container">
        <p className="max-w-[60em] border-t border-border py-6 text-xs leading-relaxed text-subtle sm:text-[13px]">
          {t("footer.disclaimer")}
        </p>
      </div>

      <div aria-hidden="true" className="overflow-hidden pt-4">
        <div
          ref={big}
          lang="ja"
          className="text-outline -mb-[0.16em] whitespace-nowrap text-center font-display text-[clamp(4.5rem,19vw,18rem)] leading-[0.92]"
        >
          ゴーアニメ
        </div>
      </div>
    </footer>
  )
}
