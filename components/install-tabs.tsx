"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { Download } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion"
import { useLanguage } from "@/contexts/language-context"
import { usePlatform } from "@/hooks/use-platform"
import { LATEST_RELEASE_URL } from "@/lib/releases"
import { cn } from "@/lib/utils"

type TabId = "windows" | "macos" | "linux" | "arch" | "go"

// short is the label on phones, where all five have to fit across.
const TABS: { id: TabId; label: string; short?: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "arch", label: "Arch Linux", short: "Arch" },
  { id: "go", label: "Go" },
]

const COMMANDS = {
  macos: `brew install mpv
curl -Lo goanime ${LATEST_RELEASE_URL}/download/goanime-darwin-universal
chmod +x goanime
sudo mv goanime /usr/local/bin/
sudo xattr -d com.apple.quarantine /usr/local/bin/goanime`,
  linux: `curl -LO ${LATEST_RELEASE_URL}/download/goanime-linux-amd64.tar.gz
tar -xzf goanime-linux-amd64.tar.gz
sudo install goanime-linux-amd64 /usr/local/bin/goanime`,
  go: "go install github.com/alvarorichard/Goanime/cmd/goanime@latest",
}

// A terminal panel with one tab per way to install. It opens on the
// visitor's own system; on a phone the tabs scroll sideways.
export function InstallTabs() {
  const { t, href } = useLanguage()
  const platform = usePlatform()
  const [picked, setPicked] = useState<TabId | null>(null)
  const active: TabId = picked ?? platform ?? "windows"
  const panel = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    windows: null,
    macos: null,
    linux: null,
    arch: null,
    go: null,
  })

  // The new tab's content rises in, but only when the visitor picked it, not
  // when the page preselects their system.
  useGSAP(
    () => {
      if (!picked || !panel.current || prefersReducedMotion()) return
      gsap.from(panel.current.children, {
        y: 12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform,opacity",
      })
    },
    { dependencies: [picked], scope: panel },
  )

  const pick = (id: TabId) => {
    setPicked(id)
    // Keep the chosen tab in view in the sideways-scrolling row.
    tabRefs.current[id]?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  // Arrow keys move between tabs, as the WAI-ARIA tabs pattern expects.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    let next = -1
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length
    if (e.key === "Home") next = 0
    if (e.key === "End") next = TABS.length - 1
    if (next < 0) return
    e.preventDefault()
    pick(TABS[next].id)
    tabRefs.current[TABS[next].id]?.focus()
  }

  return (
    <div className="border-2 border-paper bg-background shadow-[6px_6px_0_var(--border)] sm:shadow-[10px_10px_0_var(--border)]">
      <div
        role="tablist"
        aria-label={t("install.tabs")}
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b-2 border-paper [scrollbar-width:none]"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              type="button"
              role="tab"
              id={`install-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="install-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(tab.id)}
              className={cn(
                "h-12 flex-1 shrink-0 whitespace-nowrap border-r border-border px-2.5 font-mono text-xs tracking-[0.04em] transition-colors last:border-r-0 sm:flex-none sm:px-5 sm:text-[13px] sm:tracking-[0.06em] sm:last:border-r",
                selected ? "bg-paper text-ink" : "text-muted-foreground hover:bg-raised hover:text-foreground",
              )}
            >
              {tab.short ? (
                <>
                  <span className="sm:hidden">{tab.short}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </>
              ) : (
                tab.label
              )}
            </button>
          )
        })}
      </div>

      <div
        ref={panel}
        role="tabpanel"
        id="install-panel"
        aria-labelledby={`install-tab-${active}`}
        tabIndex={0}
        className="space-y-4 p-4 sm:space-y-5 sm:p-7"
      >
        {active === "windows" && (
          <>
            <p className="text-soft">{t("install.windows.body")}</p>
            <Link
              href={href("/download")}
              className="btn-crimson flex h-13 items-center justify-center gap-2.5 px-5 font-semibold sm:inline-flex"
            >
              <Download className="h-[18px] w-[18px]" aria-hidden="true" />
              {t("install.windows.button")}
            </Link>
            <p className="text-sm text-subtle">{t("install.windows.note")}</p>
          </>
        )}
        {active === "macos" && (
          <>
            <p className="text-soft">{t("install.macos.body")}</p>
            <CodeBlock code={COMMANDS.macos} />
          </>
        )}
        {active === "linux" && (
          <>
            <p className="text-soft">{t("install.linux.body")}</p>
            <CodeBlock code={COMMANDS.linux} />
            <p className="text-sm text-subtle">{t("install.linux.note")}</p>
          </>
        )}
        {active === "arch" && (
          <>
            <p className="text-soft">{t("install.arch.body")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <CodeBlock code="yay -S goanime" />
              <CodeBlock code="paru -S goanime" />
            </div>
          </>
        )}
        {active === "go" && (
          <>
            <p className="text-soft">{t("install.go.body")}</p>
            <CodeBlock code={COMMANDS.go} />
            <p className="text-sm text-subtle">{t("install.go.note")}</p>
          </>
        )}
      </div>
    </div>
  )
}
