"use client"

import type React from "react"
import { ArrowUpRight } from "lucide-react"
import { CountUp, Stagger } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"
import { formatCount } from "@/lib/utils"

// The live numbers under the hero, two by two on a phone and in a row from
// lg, each linking to where it comes from. Each one is left out when its API
// could not be reached, and the grid disappears if none could.
export function ProjectStats() {
  const { t, locale } = useLanguage()
  const { stars, downloads, contributors, discord } = useProject()

  const stats: { label: string; value: number; href: string; extra?: React.ReactNode }[] = []
  if (stars !== null) stats.push({ label: t("hero.stars"), value: stars, href: `${links.github}/stargazers` })
  if (downloads !== null) stats.push({ label: t("stats.downloads"), value: downloads, href: links.releases })
  if (contributors.length > 0) {
    stats.push({ label: t("stats.contributors"), value: contributors.length, href: links.contributors })
  }
  if (discord) {
    stats.push({
      label: t("stats.discord"),
      value: discord.members,
      href: links.discord,
      extra: (
        <span className="inline-flex items-center gap-2 font-mono text-xs text-subtle">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          {formatCount(discord.online, locale)} {t("stats.online")}
        </span>
      ),
    })
  }
  if (stats.length === 0) return null

  return (
    <section aria-label={t("stats.label")} className="pb-16 sm:pb-20 lg:pb-28">
      <div className="container">
        <Stagger as="ul" className="grid grid-cols-2 border-l border-t border-border lg:grid-cols-4">
          {stats.map(({ label, value, href, extra }, i) => (
            <li key={label} className="border-b border-r border-border">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-3 p-4 transition-colors hover:bg-card sm:gap-4 sm:p-6 lg:p-7"
              >
                <span className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-subtle transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </span>
                <span className="whitespace-nowrap font-display text-[clamp(1.6rem,7.4vw,2.6rem)] leading-none lg:text-[2.75rem]">
                  <CountUp value={value} format={(n) => formatCount(n, locale)} />
                </span>
                <span className="text-sm text-muted-foreground sm:text-[15px]">{label}</span>
                {extra}
              </a>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
