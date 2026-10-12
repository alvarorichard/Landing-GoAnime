"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { DownloadCards } from "@/components/download-cards"
import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { pickDownloads } from "@/lib/releases"

// The last section of the home page asks for the one thing the page is for,
// with the latest release's files right there.
export function DownloadSection() {
  const { t, locale, href } = useLanguage()
  const { release } = useProject()
  const checksums = release ? pickDownloads(release.assets).checksums : undefined

  // In UTC, so the date the server renders matches the one the browser
  // hydrates, whatever either one's time zone.
  const published = release
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(release.published_at))
    : null

  return (
    <section id="download" aria-labelledby="download-title" className="border-t border-border py-20 sm:py-24 lg:py-36">
      <div className="container space-y-10 lg:space-y-16">
        <div className="space-y-5">
          <SectionHeading
            id="download-title"
            index="07"
            label={t("nav.download")}
            jp="ダウンロード"
            title={t("download.title")}
            subtitle={t("download.subtitle")}
            size="lg"
          />
          {release && (
            <Reveal
              as="p"
              className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[13px] text-subtle"
            >
              <span>
                {t("download.version")} <span className="text-foreground">{release.tag_name}</span>
              </span>
              {published && (
                <span>
                  {t("download.published")} <span className="text-foreground">{published}</span>
                </span>
              )}
              <a
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
              >
                {t("download.notes")}
              </a>
            </Reveal>
          )}
        </div>

        <DownloadCards release={release} />

        <Reveal className="flex flex-col gap-2 border-t border-border pt-5 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {checksums && (
            <a
              href={checksums.browser_download_url}
              className="inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              {t("download.checksums")}
            </a>
          )}
          <Link
            href={href("/download")}
            className="group inline-flex min-h-11 items-center gap-2 text-brand transition-colors hover:text-foreground"
          >
            {t("download.all")}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
