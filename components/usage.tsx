"use client"

import { CopyButton } from "@/components/copy-button"
import { Reveal, Stagger } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"
import type { TranslationKey } from "@/lib/i18n"

const USAGE: { label: TranslationKey; command: string }[] = [
  { label: "usage.interactive", command: "goanime" },
  { label: "usage.direct", command: 'goanime "one piece"' },
  { label: "usage.episode", command: 'goanime -d "one piece" 1' },
  { label: "usage.range", command: 'goanime -d -r "naruto" 1-12' },
  { label: "usage.all", command: 'goanime -d -a "one piece"' },
  { label: "usage.quality", command: 'goanime -d --quality 720p "frieren" 1' },
  { label: "usage.source", command: 'goanime --source animefire "jujutsu kaisen"' },
  { label: "usage.movie", command: 'goanime -dm "Interstellar"' },
  { label: "usage.upscale", command: "goanime --upscale --upscale-hq video.mp4" },
  { label: "usage.update", command: "goanime --update" },
]

// The common commands as a cheat sheet. On a phone each row is the task over
// its command; from sm the two share a line, joined by a dotted leader.
export function Usage() {
  const { t } = useLanguage()

  return (
    <section id="usage" aria-labelledby="usage-title" className="border-t border-border py-16 sm:py-20 lg:py-32">
      <div className="container space-y-10 lg:space-y-14">
        <SectionHeading
          id="usage-title"
          index="04"
          label={t("usage.title")}
          jp="使い方"
          title={t("usage.title")}
          subtitle={t("usage.subtitle")}
        />
        <Stagger as="ul" from={{ x: -24 }} stagger={0.05} className="border-t border-line">
          {USAGE.map(({ label, command }) => (
            <li key={command} className="flex items-center gap-3 border-b border-border py-3 sm:gap-4 sm:py-2">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
                <p className="text-sm text-muted-foreground sm:shrink-0 sm:text-base sm:text-soft">{t(label)}</p>
                <span aria-hidden="true" className="hidden min-w-10 flex-1 border-b border-dotted border-input sm:block" />
                <code className="mt-1.5 block whitespace-pre-wrap font-mono text-[13px] [overflow-wrap:anywhere] sm:mt-0 sm:overflow-x-auto sm:whitespace-nowrap sm:text-sm">
                  <span className="select-none text-brand">$ </span>
                  {command}
                </code>
              </div>
              <CopyButton text={command} className="border border-line" />
            </li>
          ))}
        </Stagger>
        <Reveal as="p" className="text-[15px] text-muted-foreground">
          {t("usage.help")}
        </Reveal>
      </div>
    </section>
  )
}
