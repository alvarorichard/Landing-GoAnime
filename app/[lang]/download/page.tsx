"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { DownloadCards } from "@/components/download-cards"
import { MaskedWords, Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { links } from "@/lib/links"
import { LATEST_RELEASE_URL, REPO, pickDownloads, type LinuxArch, type Release } from "@/lib/releases"

type Status = "loading" | "ready" | "error"

// A row of the two lists at the bottom: what to do after downloading, and the
// other ways to install.
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-border py-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-9">
      <h3 className="font-display text-xl leading-tight">{title}</h3>
      <div className="min-w-0 space-y-3">{children}</div>
    </Reveal>
  )
}

export default function DownloadPage() {
  const { t, locale, href } = useLanguage()
  // The server normally supplies the latest release; if it could not reach
  // GitHub, the browser asks instead.
  const { release: serverRelease } = useProject()
  const [release, setRelease] = useState<Release | null>(serverRelease)
  const [status, setStatus] = useState<Status>(serverRelease ? "ready" : "loading")
  const [linuxArch, setLinuxArch] = useState<LinuxArch>("amd64")

  useEffect(() => {
    if (serverRelease) return
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        return res.json() as Promise<Release>
      })
      .then((data) => {
        setRelease(data)
        setStatus("ready")
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== "AbortError") setStatus("error")
      })
    return () => controller.abort()
  }, [serverRelease])

  const files = release ? pickDownloads(release.assets) : null
  const macFile = files?.macos.binary?.name ?? "goanime-darwin-universal"
  const linuxFile = files?.linux[linuxArch]?.archive?.name ?? `goanime-linux-${linuxArch}.tar.gz`
  const linuxBinary = linuxFile.replace(/\.tar\.gz$/, "")

  // In UTC, so the date the server renders matches the one the browser
  // hydrates, whatever either one's time zone.
  const published = release
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(release.published_at))
    : null

  return (
    <>
      <SiteHeader />

      <main id="main">
        <section aria-labelledby="download-title" className="relative isolate overflow-hidden border-b border-border">
          <div aria-hidden="true" className="panel-cols pointer-events-none absolute inset-0 -z-10" />
          <div className="container pb-10 pt-5 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-12">
            <Link
              href={href("/")}
              className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("download.back")}
            </Link>

            <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
              <div className="space-y-4">
                <p aria-hidden="true" className="flex items-center gap-3.5 font-mono text-xs uppercase tracking-[0.16em] text-brand">
                  <span>{t("nav.download")}</span>
                  <span lang="ja" className="tracking-[0.24em] text-subtle">
                    ダウンロード
                  </span>
                </p>
                <MaskedWords
                  as="h1"
                  id="download-title"
                  play="load"
                  text={t("download.title")}
                  className="font-display text-[clamp(2.5rem,11vw,4rem)] leading-[1.04] tracking-[-0.01em] text-balance lg:text-[clamp(3.5rem,6vw,5.5rem)]"
                />
              </div>
              <div className="space-y-3">
                <p className="text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
                  {t("download.subtitle")}
                </p>
                <div className="min-h-6 font-mono text-[13px] text-subtle" aria-live="polite">
                  {status === "loading" && <span>{t("download.loading")}</span>}
                  {status === "error" && <span>{t("download.error")}</span>}
                  {status === "ready" && release && (
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
                      <span>
                        {t("download.version")} <span className="text-foreground">{release.tag_name}</span>
                      </span>
                      {published && (
                        <span>
                          {t("download.published")} <span className="text-foreground">{published}</span>
                        </span>
                      )}
                      {release.prerelease && (
                        <span className="border border-line px-1.5 py-0.5">{t("download.prerelease")}</span>
                      )}
                      <a
                        href={release.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
                      >
                        {t("download.notes")}
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label={t("download.title")} className="container space-y-6 py-12 sm:py-16 lg:py-20">
          <DownloadCards release={release} linuxArch={linuxArch} onLinuxArchChange={setLinuxArch} />
          {files?.checksums && (
            <a
              href={files.checksums.browser_download_url}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              {t("download.checksums")}
            </a>
          )}
        </section>

        <section aria-labelledby="after-title" className="border-t border-border bg-panel py-16 sm:py-20 lg:py-28">
          <div className="container space-y-10">
            <SectionHeading
              id="after-title"
              index="01"
              label="Windows · macOS · Linux"
              jp="インストール"
              title={t("download.after.title")}
            />
            <div className="border-b border-border">
              <Row title="Windows">
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {t("download.after.windows")} <code className="inline-code">goanime</code>.
                </p>
              </Row>
              <Row title="macOS">
                <p className="text-[15px] text-muted-foreground">{t("download.after.macos")}</p>
                <CodeBlock
                  code={`brew install mpv
chmod +x ${macFile}
sudo mv ${macFile} /usr/local/bin/goanime
sudo xattr -d com.apple.quarantine /usr/local/bin/goanime`}
                />
              </Row>
              <Row title="Linux">
                <p className="text-[15px] text-muted-foreground">{t("download.after.linux")}</p>
                <CodeBlock
                  code={`tar -xzf ${linuxFile}
sudo install ${linuxBinary} /usr/local/bin/goanime`}
                />
              </Row>
            </div>
          </div>
        </section>

        <section aria-labelledby="other-title" className="border-t border-border py-16 sm:py-20 lg:py-28">
          <div className="container space-y-10">
            <SectionHeading
              id="other-title"
              index="02"
              label="AUR · Go · GitHub"
              jp="その他"
              title={t("download.other.title")}
            />
            <div className="border-b border-border">
              <Row title={t("download.other.aur")}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CodeBlock code="yay -S goanime" />
                  <CodeBlock code="paru -S goanime" />
                </div>
              </Row>
              <Row title={t("download.other.go")}>
                <CodeBlock code="go install github.com/alvarorichard/Goanime/cmd/goanime@latest" />
              </Row>
              <Row title={t("download.other.source")}>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{t("download.other.source.body")}</p>
                <div className="flex flex-wrap gap-x-6 font-mono text-[13px]">
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
                  >
                    GitHub
                  </a>
                  <a
                    href={links.devGuide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
                  >
                    {t("footer.devguide")}
                  </a>
                  <a
                    href={LATEST_RELEASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-brand underline-offset-4 hover:underline"
                  >
                    {t("footer.releases")}
                  </a>
                </div>
              </Row>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
