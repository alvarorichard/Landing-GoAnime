"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Download } from "lucide-react"
import { Stagger } from "@/components/motion"
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/os-icons"
import { useLanguage } from "@/contexts/language-context"
import { usePlatform } from "@/hooks/use-platform"
import { fallbackLinks, formatSize, pickDownloads, type LinuxArch, type Platform, type Release } from "@/lib/releases"
import { cn } from "@/lib/utils"

interface FileLink {
  href: string
  label: string
  name?: string
  size?: number
}

// One card per system, with the files of the given release (or links that
// always reach the newest one, when it is not known). The visitor's own
// system is marked, and comes first on a phone.
// The Linux architecture can be held by the page (the download page shows
// install steps for the chosen one) or by the cards themselves.
export function DownloadCards({
  release,
  linuxArch: chosenArch,
  onLinuxArchChange,
}: {
  release: Release | null
  linuxArch?: LinuxArch
  onLinuxArchChange?: (arch: LinuxArch) => void
}) {
  const { t, locale } = useLanguage()
  const platform = usePlatform()
  const [ownArch, setOwnArch] = useState<LinuxArch>("amd64")
  const linuxArch = chosenArch ?? ownArch
  const setLinuxArch = onLinuxArchChange ?? setOwnArch

  useEffect(() => {
    if (/aarch64|arm64/i.test(navigator.userAgent)) setLinuxArch("arm64")
  }, [setLinuxArch])

  const files = useMemo(() => (release ? pickDownloads(release.assets) : null), [release])
  const linux = files?.linux[linuxArch]
  const linuxArches = files ? (Object.keys(files.linux) as LinuxArch[]) : (["amd64", "arm64"] as LinuxArch[])

  const cards: {
    id: Platform
    title: string
    arch: string
    icon: React.ReactNode
    body: string
    primary: FileLink
    secondary?: FileLink
    extra?: React.ReactNode
  }[] = [
    {
      id: "windows",
      title: "Windows",
      arch: "x86_64",
      icon: <WindowsIcon className="h-7 w-7" />,
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
        size: files.windows.portable.size,
      },
    },
    {
      id: "macos",
      title: "macOS",
      arch: "universal",
      icon: <AppleIcon className="h-7 w-7" />,
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
        size: files.macos.archive.size,
      },
    },
    {
      id: "linux",
      title: "Linux",
      arch: linuxArch === "amd64" ? "x86_64" : "ARM64",
      icon: <LinuxIcon className="h-7 w-7" />,
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
        size: linux.binary.size,
      },
      extra: linuxArches.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="font-mono text-xs text-subtle">{t("download.architecture")}</legend>
          <div className="grid grid-cols-2 border border-line">
            {linuxArches.map((arch) => (
              <label
                key={arch}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center font-mono text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                  arch === linuxArch ? "bg-paper text-ink" : "text-muted-foreground hover:text-foreground",
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

  return (
    <Stagger from={{ y: 60 }} className="grid gap-8 pr-2 sm:pr-2.5 lg:grid-cols-3">
      {cards.map((card) => {
        const recommended = card.id === platform
        return (
          <section
            key={card.id}
            aria-labelledby={`download-${card.id}`}
            data-recommended={recommended || undefined}
            className={cn(
              "download-card relative flex flex-col gap-5 p-6 pt-7 sm:p-7",
              recommended && "order-first lg:order-none",
            )}
          >
            {recommended && (
              <span className="absolute -top-3.5 left-5 bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                {t("download.recommended")}
              </span>
            )}
            <div className="flex items-center justify-between">
              {card.icon}
              <span className="font-mono text-xs text-subtle">{card.arch}</span>
            </div>
            <h3 id={`download-${card.id}`} className="font-display text-[1.75rem] leading-tight">
              {card.title}
            </h3>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">{card.body}</p>

            {card.extra}

            <div className="mt-auto space-y-2 pt-2">
              {card.primary.name && (
                <p className="flex items-center justify-between gap-3 font-mono text-xs text-subtle">
                  <span className="truncate">{card.primary.name}</span>
                  {card.primary.size ? <span className="shrink-0">{formatSize(card.primary.size, locale)}</span> : null}
                </p>
              )}
              <a
                href={card.primary.href}
                className={cn(
                  "flex h-13 items-center justify-center gap-2.5 px-5 font-semibold",
                  recommended ? "btn-crimson" : "btn-outline",
                )}
              >
                <Download className="h-[18px] w-[18px]" aria-hidden="true" />
                {card.primary.label}
              </a>
              {card.secondary && (
                <a
                  href={card.secondary.href}
                  className="flex min-h-11 items-center justify-between gap-3 font-mono text-[13px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <span>{card.secondary.label}</span>
                  {card.secondary.size ? <span>{formatSize(card.secondary.size, locale)}</span> : null}
                </a>
              )}
            </div>
          </section>
        )
      })}
    </Stagger>
  )
}
