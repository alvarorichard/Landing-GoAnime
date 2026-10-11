"use client"

import type React from "react"
import { ArrowUpRight } from "lucide-react"
import { CountUp, Stagger, StaggerItem } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"
import { formatCount } from "@/lib/utils"

// A strip of live numbers under the hero, each linking to where it comes
// from. Each one is left out when its API could not be reached, and the
// strip disappears if none could.
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
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {formatCount(discord.online, locale)} {t("stats.online")}
        </span>
      ),
    })
  }
  if (stats.length === 0) return null

  return (
    <section aria-label={t("stats.label")}>
      <div className="container pb-16 md:pb-20">
        <Stagger as="ul" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map(({ label, value, href, extra }) => (
            <StaggerItem key={label} as="li" className="md:border-l md:pl-6 md:first:border-0 md:first:pl-0">
              <a href={href} target="_blank" rel="noopener noreferrer" className="group block space-y-1 rounded-md">
                <span className="block text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                  <CountUp value={value} format={(n) => formatCount(n, locale)} />
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                  />
                </span>
                {extra}
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
