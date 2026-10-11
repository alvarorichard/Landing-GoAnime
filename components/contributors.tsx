"use client"

import { ArrowUpRight } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"

// Past this many faces, the rest are counted in a link to GitHub's list.
const SHOWN = 48

// The people with code in GoAnime, from the GitHub API (bots left out).
export function Contributors() {
  const { t } = useLanguage()
  const { contributors } = useProject()
  if (contributors.length === 0) return null
  const rest = contributors.length - SHOWN

  return (
    <Reveal>
      <div className="space-y-5 rounded-xl border border-border p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h3 className="font-medium">
              {t("community.contributors.title").replace("{count}", String(contributors.length))}
            </h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {t("community.contributors.body")}
            </p>
          </div>
          <a
            href={links.devGuide}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand"
          >
            {t("community.contributors.cta")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <Stagger as="ul" gap={0.03} className="flex flex-wrap gap-2">
          {contributors.slice(0, SHOWN).map((person) => (
            <StaggerItem key={person.login} as="li">
              <a
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                title={person.login}
                className="block rounded-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person.avatar}
                  alt={person.login}
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 rounded-full border border-border bg-secondary"
                />
              </a>
            </StaggerItem>
          ))}
          {rest > 0 && (
            <StaggerItem as="li">
              <a
                href={links.contributors}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 min-w-11 items-center justify-center rounded-full border border-border px-2 text-xs tabular-nums text-muted-foreground transition-colors hover:text-foreground"
              >
                +{rest}
              </a>
            </StaggerItem>
          )}
        </Stagger>
      </div>
    </Reveal>
  )
}
