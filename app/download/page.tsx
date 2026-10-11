"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Download, ShieldCheck } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { EASE, Reveal, revealVariants, staggerVariants } from "@/components/motion"
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/os-icons"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProject } from "@/contexts/project-context"
import { usePlatform } from "@/hooks/use-platform"
import { links } from "@/lib/links"
import {
  LATEST_RELEASE_URL,
  REPO,
  fallbackLinks,
  formatSize,
  pickDownloads,
  type LinuxArch,
  type Platform,
  type Release,
} from "@/lib/releases"
import { cn } from "@/lib/utils"

type Status = "loading" | "ready" | "error"

interface FileLink {
  href: string
  label: string
  name?: string
  size?: number
}

export default function DownloadPage() {
  const { t, locale } = useLanguage()
  const platform = usePlatform()
  // The server normally supplies the latest release; if it could not reach
  // GitHub, the browser asks instead.
  const { release: serverRelease } = useProject()
  const [release, setRelease] = useState<Release | null>(serverRelease)
  const [status, setStatus] = useState<Status>(serverRelease ? "ready" : "loading")
  const [linuxArch, setLinuxArch] = useState<LinuxArch>("amd64")

  useEffect(() => {
    if (/aarch64|arm64/i.test(navigator.userAgent)) setLinuxArch("arm64")
  }, [])

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

  const files = useMemo(() => (release ? pickDownloads(release.assets) : null), [release])
  const linux = files?.linux[linuxArch]
  const linuxArches = files ? (Object.keys(files.linux) as LinuxArch[]) : (["amd64", "arm64"] as LinuxArch[])
  const linuxFile = linux?.archive?.name ?? `goanime-linux-${linuxArch}.tar.gz`
  const linuxBinary = linuxFile.replace(/\.tar\.gz$/, "")
  const macFile = files?.macos.binary?.name ?? "goanime-darwin-universal"

  const cards: {
    id: Platform
    title: string
    icon: React.ReactNode
    body: string
    primary: FileLink
    secondary?: FileLink
    extra?: React.ReactNode
  }[] = [
    {
      id: "windows",
      title: "Windows",
      icon: <WindowsIcon className="h-6 w-6" />,
      body: t("download.windows.body"),
      primary: {
        href: files?.windows.installer?.browser_download_url ?? fallbackLinks.windows,
        label: t("download.windows.primary"),
        name: files?.windows.installer?.name,
        size: files?.windows.installer?.size,
      },
      secondary: files?.windows.portable && {
        href: files.windows.portable.browser_download_url,
        label: t("download.windows.secondary"),
      },
    },
    {
      id: "macos",
      title: "macOS",
      icon: <AppleIcon className="h-6 w-6" />,
      body: t("download.macos.body"),
      primary: {
        href: files?.macos.binary?.browser_download_url ?? fallbackLinks.macos,
        label: t("download.macos.primary"),
        name: files?.macos.binary?.name,
        size: files?.macos.binary?.size,
      },
      secondary: files?.macos.archive && {
        href: files.macos.archive.browser_download_url,
        label: t("download.macos.secondary"),
      },
    },
    {
      id: "linux",
      title: "Linux",
      icon: <LinuxIcon className="h-6 w-6" />,
      body: t("download.linux.body"),
      primary: {
        href: linux?.archive?.browser_download_url ?? fallbackLinks.linux(linuxArch),
        label: t("download.linux.primary"),
        name: linux?.archive?.name,
        size: linux?.archive?.size,
      },
      secondary: linux?.binary && {
        href: linux.binary.browser_download_url,
        label: t("download.linux.secondary"),
      },
      extra: linuxArches.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="text-xs text-muted-foreground">{t("download.architecture")}</legend>
          <div className="flex gap-1 rounded-md border border-border p-1">
            {linuxArches.map((arch) => (
              <label
                key={arch}
                className={cn(
                  "flex-1 cursor-pointer rounded px-2 py-1.5 text-center font-mono text-xs transition-colors focus-within:ring-2 focus-within:ring-ring",
                  arch === linuxArch ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name="linux-arch"
                  value={arch}
                  checked={arch === linuxArch}
                  onChange={() => setLinuxArch(arch)}
                  className="sr-only"
                />
                {arch === "amd64" ? "x86_64" : "ARM64"}
              </label>
            ))}
          </div>
        </fieldset>
      ),
    },
  ]

  const published = release
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(release.published_at))
    : null

  return (
    <>
      <SiteHeader />

      <main id="main" className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_55%_at_50%_0%,hsl(var(--primary)/0.16),transparent_70%)]"
        />
        <div className="container py-10 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("download.back")}
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-8 max-w-2xl space-y-4"
          >
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{t("download.title")}</h1>
            <p className="text-pretty text-lg text-muted-foreground">{t("download.subtitle")}</p>
            <div className="min-h-6 text-sm text-muted-foreground" aria-live="polite">
              {status === "loading" && <span>{t("download.loading")}</span>}
              {status === "error" && <span>{t("download.error")}</span>}
              {status === "ready" && release && (
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>
                    {t("download.version")} <span className="font-mono text-foreground">{release.tag_name}</span>
                  </span>
                  {published && (
                    <span>
                      {t("download.published")} {published}
                    </span>
                  )}
                  {release.prerelease && (
                    <span className="rounded border border-border px-1.5 py-0.5 text-xs">
                      {t("download.prerelease")}
                    </span>
                  )}
                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline-offset-4 hover:underline"
                  >
                    {t("download.notes")}
                  </a>
                </span>
              )}
            </div>
          </motion.header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
            transition={{ delayChildren: 0.15 }}
            className="mt-10 grid gap-4 lg:grid-cols-3"
          >
            {cards.map((card) => {
              const recommended = card.id === platform
              return (
                <motion.section
                  key={card.id}
                  variants={revealVariants}
                  whileHover={{ y: -4 }}
                  aria-labelledby={`dl-${card.id}`}
                  className={cn(
                    "group flex flex-col gap-5 rounded-xl border bg-card/60 p-6 backdrop-blur-sm transition-colors",
                    // On phones the visitor's own system comes first.
                    recommended
                      ? "border-beam order-first border-primary/40 lg:order-none"
                      : "border-border hover:border-foreground/20",
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-500 ease-out group-hover:scale-110",
                          recommended
                            ? "border-primary/40 bg-primary/15 text-foreground shadow-[0_0_30px_-6px_hsl(var(--primary)/0.7)]"
                            : "border-border bg-white/[0.03] text-foreground/90",
                        )}
                      >
                        {card.icon}
                      </span>
                      {recommended && (
                        <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-brand">
                          {t("download.recommended")}
                        </span>
                      )}
                    </div>
                    <h2 id={`dl-${card.id}`} className="text-xl font-semibold tracking-tight">
                      {card.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>

                  {card.extra}

                  <div className="mt-auto space-y-3">
                    {card.primary.name && (
                      <p className="flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                        <span className="truncate">{card.primary.name}</span>
                        {card.primary.size ? <span className="shrink-0">{formatSize(card.primary.size)}</span> : null}
                      </p>
                    )}
                    <Button
                      asChild
                      className={cn("h-11 w-full", recommended && "btn-shine")}
                      variant={recommended ? "default" : "secondary"}
                    >
                      <a href={card.primary.href}>
                        <Download aria-hidden="true" />
                        {card.primary.label}
                      </a>
                    </Button>
                    {card.secondary && (
                      <a
                        href={card.secondary.href}
                        className="block rounded-sm text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {card.secondary.label}
                      </a>
                    )}
                  </div>
                </motion.section>
              )
            })}
          </motion.div>

          {files?.checksums && (
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              <a
                href={files.checksums.browser_download_url}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("download.checksums")}
              </a>
            </p>
          )}

          <Reveal as="section" className="mt-20 space-y-8">
            <h2 id="after-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("download.after.title")}
            </h2>
            <div className="divide-y divide-border border-y border-border">
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">Windows</h3>
                <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                  {t("download.after.windows")} <code className="font-mono text-foreground">goanime</code>.
                </p>
              </div>
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">macOS</h3>
                <div className="min-w-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{t("download.after.macos")}</p>
                  <CodeBlock
                    code={`brew install mpv
chmod +x ${macFile}
sudo mv ${macFile} /usr/local/bin/goanime
sudo xattr -d com.apple.quarantine /usr/local/bin/goanime`}
                  />
                </div>
              </div>
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">Linux</h3>
                <div className="min-w-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{t("download.after.linux")}</p>
                  <CodeBlock
                    code={`tar -xzf ${linuxFile}
sudo install ${linuxBinary} /usr/local/bin/goanime`}
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="mt-20 space-y-8">
            <h2 id="other-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("download.other.title")}
            </h2>
            <div className="divide-y divide-border border-y border-border">
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">{t("download.other.aur")}</h3>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <CodeBlock code="yay -S goanime" />
                  <CodeBlock code="paru -S goanime" />
                </div>
              </div>
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">{t("download.other.go")}</h3>
                <CodeBlock className="min-w-0" code="go install github.com/alvarorichard/Goanime/cmd/goanime@latest" />
              </div>
              <div className="grid gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-medium">{t("download.other.source")}</h3>
                <div className="min-w-0 space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{t("download.other.source.body")}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline-offset-4 hover:underline"
                    >
                      GitHub
                    </a>
                    <a
                      href={links.devGuide}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline-offset-4 hover:underline"
                    >
                      {t("footer.devguide")}
                    </a>
                    <a
                      href={LATEST_RELEASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline-offset-4 hover:underline"
                    >
                      {t("footer.releases")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
