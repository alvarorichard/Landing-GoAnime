"use client"

import type React from "react"
import { ArrowUpRight, MessageCircle, Smartphone, Star } from "lucide-react"
import { Contributors } from "@/components/contributors"
import { GitHubIcon } from "@/components/icons"
import { Reveal, Stagger } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"
import { formatCount } from "@/lib/utils"

// The one paper section: the page turns light here, like a manga page, for
// the people behind the project.
export function Community() {
  const { t, locale } = useLanguage()
  const { stars } = useProject()

  const cards: { icon: React.ReactNode; title: string; body: string; cta: string; href: string }[] = [
    {
      icon: <GitHubIcon className="h-7 w-7" />,
      title: t("community.github.title"),
      body: t("community.github.body"),
      cta: t("community.github.cta"),
      href: links.github,
    },
    {
      icon: <MessageCircle className="h-7 w-7" aria-hidden="true" />,
      title: t("community.discord.title"),
      body: t("community.discord.body"),
      cta: t("community.discord.cta"),
      href: links.discord,
    },
    {
      icon: <Smartphone className="h-7 w-7" aria-hidden="true" />,
      title: t("community.mobile.title"),
      body: t("community.mobile.body"),
      cta: t("community.mobile.cta"),
      href: links.mobile,
    },
  ]

  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="paper-section relative isolate overflow-hidden py-20 sm:py-24 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="halftone-ink absolute right-0 top-0 -z-10 h-44 w-[75vw] sm:h-64 lg:h-80 lg:w-[min(55vw,720px)]"
      />
      <div className="container space-y-12 lg:space-y-20">
        <SectionHeading
          id="community-title"
          index="06"
          label={t("footer.community")}
          jp="コミュニティ"
          title={t("community.title")}
          subtitle={t("community.subtitle")}
          size="lg"
          tone="paper"
        />

        {/* The cards drop in like panels; the padding leaves room for their shadows. */}
        <Stagger from={{ y: 70, rotation: -2.5 }} className="grid gap-6 pr-1.5 sm:gap-8 sm:pr-3 lg:grid-cols-3">
          {cards.map((card, i) => (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-card group flex min-h-[15rem] flex-col gap-4 p-6 sm:p-7"
            >
              <span className="flex items-center justify-between">
                {card.icon}
                <span aria-hidden="true" className="font-mono text-xs tracking-[0.14em] text-ink-soft">
                  {String.fromCharCode(65 + i)}
                </span>
              </span>
              <h3 className="font-display text-2xl leading-tight sm:text-[1.625rem]">{card.title}</h3>
              <p className="text-pretty text-ink-soft">{card.body}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-primary">
                {card.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          ))}
        </Stagger>

        <Contributors />

        <Reveal className="on-ink flex flex-col gap-5 bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8">
          <p className="text-pretty text-soft sm:text-[17px]">{t("community.star")}</p>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crimson inline-flex h-13 shrink-0 items-center justify-center gap-3 px-5 font-semibold"
          >
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            {t("community.star.cta")}
            {stars !== null && (
              <span className="border-l border-white/35 pl-3 font-mono text-xs font-medium text-white/85">
                {formatCount(stars, locale)}
              </span>
            )}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
