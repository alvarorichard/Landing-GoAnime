"use client"

import type React from "react"
import { CountUp, Stagger, StaggerItem } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { formatCount } from "@/lib/utils"

// A strip of live numbers under the hero. Each one is left out when its API
// could not be reached, and the strip disappears if none could.
export function ProjectStats() {
  const { t, locale } = useLanguage()
  const { stars, downloads, contributors, discord } = useProject()

  const stats: { label: string; value: number; extra?: React.ReactNode }[] = []
  if (stars !== null) stats.push({ label: t("hero.stars"), value: stars })
  if (downloads !== null) stats.push({ label: t("stats.downloads"), value: downloads })
  if (contributors.length > 0) stats.push({ label: t("stats.contributors"), value: contributors.length })
  if (discord) {
    stats.push({
      label: t("stats.discord"),
      value: discord.members,
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
        <Stagger as="dl" className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map(({ label, value, extra }) => (
            <StaggerItem key={label} className="flex flex-col-reverse justify-end gap-1 md:border-l md:pl-6 md:first:border-0 md:first:pl-0">
              {/* The term comes first for screen readers; the number shows above it. */}
              <dt className="space-y-1 text-sm text-muted-foreground">
                <span className="block">{label}</span>
                {extra}
              </dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                <CountUp value={value} format={(n) => formatCount(n, locale)} />
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
