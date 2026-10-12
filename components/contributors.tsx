"use client"

import { ArrowUpRight } from "lucide-react"
import { Reveal, Stagger } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"

// Past this many faces, the rest are counted in a link to GitHub's list.
const SHOWN = 48

// The people with code in GoAnime, from the GitHub API (bots left out), on
// the paper section.
export function Contributors() {
  const { t } = useLanguage()
  const { contributors } = useProject()
  if (contributors.length === 0) return null
  const rest = contributors.length - SHOWN

  return (
    <div className="space-y-6 border-t-2 border-ink pt-8 sm:pt-10">
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="space-y-2.5">
          <h3 className="font-display text-[1.6rem] leading-tight sm:text-[2rem]">
            {t("community.contributors.title").replace("{count}", String(contributors.length))}
          </h3>
          <p className="max-w-[40em] text-pretty text-ink-soft">{t("community.contributors.body")}</p>
        </div>
        <a
          href={links.devGuide}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors hover:text-ink"
        >
          {t("community.contributors.cta")}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </Reveal>

      <Stagger as="ul" from={{ scale: 0.4 }} ease="back.out(2)" stagger={0.03} className="flex flex-wrap gap-2 sm:gap-2.5">
        {contributors.slice(0, SHOWN).map((person) => (
          <li key={person.login}>
            <a
              href={person.url}
              target="_blank"
              rel="noopener noreferrer"
              title={person.login}
              className="block transition-transform duration-300 ease-snap hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.avatar}
                alt={person.login}
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 border-2 border-ink bg-[#d5dce3] sm:h-14 sm:w-14"
              />
            </a>
          </li>
        ))}
        {rest > 0 && (
          <li>
            <a
              href={links.contributors}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 min-w-11 items-center justify-center border-2 border-ink px-2 font-mono text-xs sm:h-14 sm:min-w-14"
            >
              +{rest}
            </a>
          </li>
        )}
      </Stagger>
    </div>
  )
}
